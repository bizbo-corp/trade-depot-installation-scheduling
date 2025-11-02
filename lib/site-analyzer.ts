/**
 * Site analyzer utility that scans the codebase structure
 * and extracts page, component, and import relationships
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, dirname } from 'path';
import { existsSync } from 'fs';

export interface FileInfo {
  path: string;
  relativePath: string;
  name: string;
  type: 'page' | 'layout' | 'component' | 'ui-component' | 'utility' | 'other';
  isClient: boolean;
  imports: string[];
  exports: string[];
  size: number;
}

export interface DirectoryNode {
  name: string;
  path: string;
  type: 'directory';
  children: SiteNode[];
}

export interface FileNode {
  name: string;
  path: string;
  relativePath: string;
  type: 'page' | 'layout' | 'component' | 'ui-component' | 'utility' | 'other';
  isClient: boolean;
  imports: string[];
  size: number;
}

export type SiteNode = DirectoryNode | FileNode;

export interface SiteStructure {
  pages: FileInfo[];
  components: FileInfo[];
  uiComponents: FileInfo[];
  tree: SiteNode[];
  importMap: Map<string, Set<string>>;
  analyzedAt: number;
}

const ROOT_DIR = process.cwd();
const APP_DIR = join(ROOT_DIR, 'app');
const COMPONENTS_DIR = join(ROOT_DIR, 'components');
const LIB_DIR = join(ROOT_DIR, 'lib');

/**
 * Resolve import path to a relative path that matches our file structure
 * Handles: @/, ./, ../, with/without extensions
 */
export function resolveImportPath(
  importPath: string,
  fromFile: string,
  allFiles: FileInfo[]
): string | null {
  let resolvedPath: string;
  
  // Handle alias imports (@/ -> root directory)
  if (importPath.startsWith('@/')) {
    resolvedPath = importPath.substring(2); // Remove '@/'
  }
  // Handle relative imports
  else if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const fromDir = dirname(fromFile);
    resolvedPath = join(fromDir, importPath);
    
    // Get relative path from ROOT_DIR
    const fullPath = resolvedPath;
    resolvedPath = relative(ROOT_DIR, fullPath);
  } else {
    // Absolute import (not supported in this context)
    return null;
  }
  
  // Normalize path separators
  resolvedPath = resolvedPath.replace(/\\/g, '/');
  
  // Try to match the resolved path with existing files
  // First, try exact match
  const exactMatch = allFiles.find(f => f.relativePath === resolvedPath);
  if (exactMatch) {
    return exactMatch.relativePath;
  }
  
  // Try with .tsx extension
  const withTsx = `${resolvedPath}.tsx`;
  const tsxMatch = allFiles.find(f => f.relativePath === withTsx);
  if (tsxMatch) {
    return tsxMatch.relativePath;
  }
  
  // Try with .ts extension
  const withTs = `${resolvedPath}.ts`;
  const tsMatch = allFiles.find(f => f.relativePath === withTs);
  if (tsMatch) {
    return tsMatch.relativePath;
  }
  
  // Try directory imports (index files)
  const indexTsx = `${resolvedPath}/index.tsx`;
  const indexTsxMatch = allFiles.find(f => f.relativePath === indexTsx);
  if (indexTsxMatch) {
    return indexTsxMatch.relativePath;
  }
  
  const indexTs = `${resolvedPath}/index.ts`;
  const indexTsMatch = allFiles.find(f => f.relativePath === indexTs);
  if (indexTsMatch) {
    return indexTsMatch.relativePath;
  }
  
  // No match found
  return null;
}

/**
 * Build a map of import paths to resolved file paths
 */
export function buildImportMap(files: FileInfo[]): Map<string, Set<string>> {
  const importMap = new Map<string, Set<string>>();
  
  for (const file of files) {
    const resolvedImports = new Set<string>();
    
    for (const importPath of file.imports) {
      const resolved = resolveImportPath(importPath, file.relativePath, files);
      if (resolved) {
        resolvedImports.add(resolved);
      }
    }
    
    if (resolvedImports.size > 0) {
      importMap.set(file.relativePath, resolvedImports);
    }
  }
  
  return importMap;
}

/**
 * Determine file type based on path
 */
function getFileType(filePath: string, relativePath: string): FileInfo['type'] {
  if (relativePath.startsWith('app/') || relativePath.startsWith('app\\')) {
    if (relativePath.includes('/page.tsx') || relativePath.includes('\\page.tsx')) {
      return 'page';
    }
    if (relativePath.includes('/layout.tsx') || relativePath.includes('\\layout.tsx')) {
      return 'layout';
    }
    return 'other';
  }
  
  if (relativePath.includes('components/ui/') || relativePath.includes('components\\ui\\')) {
    return 'ui-component';
  }
  
  if (relativePath.startsWith('components/') || relativePath.startsWith('components\\')) {
    return 'component';
  }
  
  if (relativePath.startsWith('lib/') || relativePath.startsWith('lib\\')) {
    return 'utility';
  }
  
  return 'other';
}

/**
 * Check if file is a client component
 */
async function isClientComponent(filePath: string): Promise<boolean> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content.trimStart().startsWith('"use client"') || content.trimStart().startsWith("'use client'");
  } catch {
    return false;
  }
}

/**
 * Extract imports from TypeScript/TSX file
 */
async function extractImports(filePath: string): Promise<string[]> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const imports: string[] = [];
    
    // Match import statements
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"]([@/].*?)['"]/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[2] || match[1];
      if (importPath && (importPath.startsWith('@/') || importPath.startsWith('./') || importPath.startsWith('../'))) {
        imports.push(importPath);
      }
    }
    
    return imports;
  } catch {
    return [];
  }
}

/**
 * Extract exports from TypeScript/TSX file
 */
async function extractExports(filePath: string): Promise<string[]> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const exports: string[] = [];
    
    // Match export statements
    const exportRegex = /export\s+(?:default\s+)?(?:function|const|class|interface|type|enum)\s+(\w+)/g;
    
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    // Also check for default exports
    if (content.includes('export default')) {
      exports.push('default');
    }
    
    return exports;
  } catch {
    return [];
  }
}

/**
 * Recursively scan directory and collect files
 */
async function scanDirectory(
  dirPath: string,
  rootPath: string = ROOT_DIR,
  excludeDirs: string[] = ['node_modules', '.next', '.git']
): Promise<FileInfo[]> {
  const files: FileInfo[] = [];
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const relativePath = relative(rootPath, fullPath);
      
      // Skip excluded directories
      if (entry.isDirectory() && excludeDirs.includes(entry.name)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subFiles = await scanDirectory(fullPath, rootPath, excludeDirs);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        // Process TypeScript/TSX files
        if (/\.(tsx?|jsx?)$/.test(entry.name)) {
          const stats = await stat(fullPath);
          const relativePathNormalized = relativePath.replace(/\\/g, '/');
          const fileType = getFileType(fullPath, relativePathNormalized);
          
          // Skip certain files
          if (entry.name === 'next-env.d.ts' || entry.name.startsWith('.') || entry.name.includes('.config.')) {
            continue;
          }
          
          const [isClient, imports, exports] = await Promise.all([
            isClientComponent(fullPath),
            extractImports(fullPath),
            extractExports(fullPath),
          ]);
          
          files.push({
            path: fullPath,
            relativePath: relativePathNormalized,
            name: entry.name,
            type: fileType,
            isClient,
            imports,
            exports,
            size: stats.size,
          });
        }
      }
    }
  } catch (error) {
    // Silently skip directories that can't be read
    console.error(`Error scanning ${dirPath}:`, error);
  }
  
  return files;
}

/**
 * Build tree structure from file list
 */
function buildTree(files: FileInfo[]): SiteNode[] {
  const tree: SiteNode[] = [];
  const nodeMap = new Map<string, SiteNode>();
  
  // Sort files by path for consistent ordering
  const sortedFiles = [...files].sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  
  for (const file of sortedFiles) {
    const pathParts = file.relativePath.split('/');
    let currentPath = '';
    
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isLast = i === pathParts.length - 1;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (nodeMap.has(currentPath)) {
        continue;
      }
      
      if (isLast) {
        // File node
        const fileNode: FileNode = {
          name: file.name,
          path: currentPath,  // Changed from file.path
          relativePath: file.relativePath,
          type: file.type,
          isClient: file.isClient,
          imports: file.imports,
          size: file.size,
        };
        
        nodeMap.set(currentPath, fileNode);
        
        // Add to parent
        if (i > 0) {
          const parentPath = pathParts.slice(0, i).join('/');
          const parent = nodeMap.get(parentPath) as DirectoryNode;
          if (parent && 'children' in parent) {
            parent.children.push(fileNode);
          }
        } else {
          tree.push(fileNode);
        }
      } else {
        // Directory node
        const dirNode: DirectoryNode = {
          name: part,
          path: currentPath,
          type: 'directory',
          children: [],
        };
        
        nodeMap.set(currentPath, dirNode);
        
        // Add to parent or root
        if (i > 0) {
          const parentPath = pathParts.slice(0, i).join('/');
          const parent = nodeMap.get(parentPath) as DirectoryNode;
          if (parent && 'children' in parent) {
            parent.children.push(dirNode);
          }
        } else {
          tree.push(dirNode);
        }
      }
    }
  }
  
  return tree;
}

/**
 * Main function to analyze the site structure
 */
export async function analyzeSiteStructure(): Promise<SiteStructure> {
  const files: FileInfo[] = [];
  
  // Scan app directory
  if (existsSync(APP_DIR)) {
    const appFiles = await scanDirectory(APP_DIR);
    files.push(...appFiles);
  }
  
  // Scan components directory
  if (existsSync(COMPONENTS_DIR)) {
    const componentFiles = await scanDirectory(COMPONENTS_DIR);
    files.push(...componentFiles);
  }
  
  // Scan lib directory
  if (existsSync(LIB_DIR)) {
    const libFiles = await scanDirectory(LIB_DIR);
    files.push(...libFiles);
  }
  
  // Categorize files
  const pages = files.filter(f => f.type === 'page' || f.type === 'layout');
  const components = files.filter(f => f.type === 'component');
  const uiComponents = files.filter(f => f.type === 'ui-component');
  
  // Build tree structure
  const tree = buildTree(files);
  
  // Build import map
  const importMap = buildImportMap(files);
  
  return {
    pages,
    components,
    uiComponents,
    tree,
    importMap,
    analyzedAt: Date.now(),
  };
}

