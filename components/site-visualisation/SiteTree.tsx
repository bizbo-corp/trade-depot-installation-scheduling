"use client";

import { useMemo, useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
  BackgroundVariant,
  NodeMouseHandler,
  NodeChange,
  applyNodeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { SiteNode, FileNode, DirectoryNode } from '@/lib/site-analyzer';
import { FileNodeComponent } from './FileNode';

const nodeTypes: NodeTypes = {
  fileNode: FileNodeComponent,
};

export type FilterType = 'pages' | 'files' | 'api' | 'components';

interface SiteTreeProps {
  tree: SiteNode[];
  filters: Set<FilterType>;
}

/**
 * Get the category for a node based on its path location
 */
function getNodeCategory(node: SiteNode): FilterType {
  const path = node.path;

  // app/ root directory should not be filtered by any category (always visible)
  // This is handled specially in filterTree to always show
  if (path === 'app') {
    return 'pages'; // Will be handled specially in filterTree to always show
  }

  // API: app/api itself AND all its descendants
  if (path === 'app/api' || path.startsWith('app/api/')) {
    return 'api';
  }

  // Components: components at root or anything starting with components/
  if (path === 'components' || path.startsWith('components/')) {
    return 'components';
  }

  if (node.type !== 'directory') {
    const fileNode = node as FileNode;

    // Files filter should only control page.tsx entries (green nodes)
    if (fileNode.type === 'page') {
      return 'files';
    }

    // Layouts belong with their page directories so they follow the Pages toggle
    if (fileNode.type === 'layout') {
      return 'pages';
    }

    // Component and UI component files should follow the Components toggle
    if (fileNode.type === 'component' || fileNode.type === 'ui-component') {
      return 'components';
    }

    // Any other files under app/ behave like pages by default
    if (path.startsWith('app/')) {
      return 'pages';
    }
  }

  // Pages: direct child directories of app/ (excluding api)
  // This covers directories like app/site-architecture, app/components-showcase
  if (path.startsWith('app/') && path !== 'app') {
    if (node.type === 'directory') {
      return 'pages';
    }

    // Non-directory files that reach here default to the Pages category
    return 'pages';
  }

  // Fallback (shouldn't happen in normal cases, but default to pages)
  return 'pages';
}

/**
 * Filter tree based on active category filters
 * When a category is filtered out, all nodes in that category and their descendants are hidden
 * Special cases (always visible):
 * - app/ root directory (Blue)
 * - components/ top-level directory (Amber)
 * - app/api directory and descendants (Red)
 * - 'pages' directories remain visible even when 'files' filter hides their .tsx children
 */
function filterTree(tree: SiteNode[], filters: Set<FilterType>): SiteNode[] {
  return tree
    .filter(node => {
      const nodeCategory = getNodeCategory(node);
      
      // app/ root directory is always visible (Blue)
      if (node.path === 'app') {
        return true;
      }
      
      // components/ top-level directory is always visible (Amber)
      if (node.path === 'components') {
        return true;
      }
      
      // api directory is always visible (Red)
      if (node.path === 'app/api' || node.path.startsWith('app/api')) {
        return true;
      }
      
      // 'pages' directories are always visible (not affected by 'files' filter)
      // This ensures directories like components-showcase and site-architecture stay visible
      // even when their .tsx file children are filtered out
      if (node.type === 'directory' && nodeCategory === 'pages') {
        return true;
      }
      
      // If node's category is not in filters, hide it
      if (!filters.has(nodeCategory)) {
        return false;
      }
      
      return true;
    })
    .map(node => {
      if (node.type === 'directory' && 'children' in node) {
        const dirNode = node as DirectoryNode;
        // Recursively filter children
        const filteredChildren = filterTree(dirNode.children, filters);
        return {
          ...dirNode,
          children: filteredChildren,
        } as DirectoryNode;
      }
      return node;
    })
    .filter(node => {
      // app/ root directory is always visible
      if (node.path === 'app') {
        return true;
      }
      
      // components/ top-level directory is always visible
      if (node.path === 'components') {
        return true;
      }
      
      // api directory is always visible
      if (node.path === 'app/api' || node.path.startsWith('app/api')) {
        return true;
      }
      
      if (node.type === 'directory' && 'children' in node) {
        const dirNode = node as DirectoryNode;
        const nodeCategory = getNodeCategory(node);
        
        // Keep 'pages' directories visible even if their children are filtered by 'files' filter
        // This ensures directories like components-showcase and site-architecture stay visible
        // even when their .tsx file children are filtered out
      if (nodeCategory === 'pages') {
        return true;
      }
        
        // Remove directory if no visible children remain
        return dirNode.children.length > 0;
      }
      return true;
    });
}

interface NodeInfo {
  id: string;
  parentId: string | null;
  depth: number;
  isDirectory: boolean;
  nodeType: FilterType;
  childIds: string[];
}

// Estimated node dimensions for collision detection
const NODE_WIDTH = 220;
const NODE_HEIGHT = 100;
const MIN_HORIZONTAL_SPACING = 250;
const MIN_VERTICAL_SPACING = 120;

// Category-based color constants
const CATEGORY_COLORS = {
  app: '#3b82f6',           // Blue (existing directory color)
  appHomepage: '#10b981',   // Green (special - homepage)
  appPageDirectory: '#8b5cf6', // Purple/pink - directories within app (pages of site)
  components: '#f59e0b',    // Amber/orange - components category
  api: '#ef4444',           // Red - API category
  default: '#6b7280',       // Gray - default
};

/**
 * Check if node is app homepage (app/page.tsx)
 */
function isAppHomepage(node: SiteNode): boolean {
  if (node.type === 'directory') return false;
  const fileNode = node as FileNode;
  return fileNode.path === 'app/page.tsx' || fileNode.relativePath === 'app/page.tsx';
}

/**
 * Check if directory is a direct child of app (contains pages)
 */
function isAppDirectory(node: SiteNode, parentId: string | null): boolean {
  if (node.type !== 'directory') return false;
  if (!parentId) return false;
  // Extract path from node ID (format: "node-{path}")
  const parentPath = parentId.startsWith('node-') ? parentId.substring(5) : parentId;
  return parentPath === 'app';
}

/**
 * Check if node is under components category
 */
function isComponentsCategory(node: SiteNode): boolean {
  return node.path.startsWith('components/') || node.path.includes('/components/');
}

/**
 * Check if node is under api category
 */
function isApiCategory(node: SiteNode): boolean {
  return node.path === 'app/api' || node.path.startsWith('app/api/') || node.path.includes('/api/');
}

/**
 * Get category-based color for a node
 */
function getCategoryColor(
  node: SiteNode,
  parentPath: string | null,
  level: number
): string {
  // API category gets red color - check BEFORE app directories to ensure app/api is red
  if (isApiCategory(node)) {
    return CATEGORY_COLORS.api;
  }
  
  // Files (page.tsx) get green color
  const category = getNodeCategory(node);
  if (category === 'files') {
    return CATEGORY_COLORS.appHomepage;
  }
  
  // App directory itself gets blue
  if (node.type === 'directory' && (node.path === 'app' || node.name === 'app')) {
    return CATEGORY_COLORS.app;
  }
  
  // Components category gets amber color (including the parent directory)
  if (node.name === 'components' && node.type === 'directory') {
    return CATEGORY_COLORS.components;
  }
  
  // Components category gets amber color (children)
  if (isComponentsCategory(node)) {
    return CATEGORY_COLORS.components;
  }
  
  // Directories within app get purple color (they contain pages)
  // This must come AFTER API check so app/api doesn't get purple
  if (node.type === 'directory' && isAppDirectory(node, parentPath)) {
    return CATEGORY_COLORS.appPageDirectory;
  }
  
  // Default colors based on category for remaining nodes
  switch (category) {
    case 'pages': return CATEGORY_COLORS.appPageDirectory; // Purple (directories under app/)
    case 'api': return CATEGORY_COLORS.api; // Red (app/api and descendants)
    case 'components': return CATEGORY_COLORS.components; // Amber (components/ and descendants)
    default: return CATEGORY_COLORS.default;
  }
}

/**
 * Check if two nodes overlap
 */
function nodesOverlap(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number },
  padding: number = 10
): boolean {
  return (
    pos1.x < pos2.x + NODE_WIDTH + padding &&
    pos1.x + NODE_WIDTH + padding > pos2.x &&
    pos1.y < pos2.y + NODE_HEIGHT + padding &&
    pos1.y + NODE_HEIGHT + padding > pos2.y
  );
}

/**
 * Find all collisions in a set of positions and resolve them iteratively
 */
function resolveCollisions(positions: Map<string, { x: number; y: number }>): Map<string, { x: number; y: number }> {
  const resolved = new Map(positions);
  let hasCollisions = true;
  let iterations = 0;
  const maxIterations = 50; // Prevent infinite loops
  
  // Iteratively resolve collisions until none remain
  while (hasCollisions && iterations < maxIterations) {
    hasCollisions = false;
    iterations++;
    const positionArray = Array.from(resolved.entries());
    
    // Sort by Y, then X for deterministic processing
    positionArray.sort((a, b) => {
      const yDiff = a[1].y - b[1].y;
      if (Math.abs(yDiff) < NODE_HEIGHT / 2) {
        // Similar Y - likely horizontal neighbors, sort by X
        return a[1].x - b[1].x;
      }
      return yDiff;
    });
    
    for (let i = 0; i < positionArray.length; i++) {
      const [nodeId1, pos1] = positionArray[i];
      
      for (let j = i + 1; j < positionArray.length; j++) {
        const [nodeId2, pos2] = positionArray[j];
        
        if (nodesOverlap(pos1, pos2)) {
          hasCollisions = true;
          
          // Calculate overlap amounts
          const xOverlap = Math.max(0, Math.min(
            pos1.x + NODE_WIDTH + 10 - pos2.x,
            pos2.x + NODE_WIDTH + 10 - pos1.x
          ));
          const yOverlap = Math.max(0, Math.min(
            pos1.y + NODE_HEIGHT + 10 - pos2.y,
            pos2.y + NODE_HEIGHT + 10 - pos1.y
          ));
          
          // Determine which direction to adjust
          // If nodes are at similar Y levels, align horizontally
          // Otherwise, align vertically
          if (Math.abs(pos1.y - pos2.y) < NODE_HEIGHT || xOverlap > yOverlap) {
            // Align horizontally - move node2 to the right
            const newX = Math.max(
              pos1.x + MIN_HORIZONTAL_SPACING,
              pos2.x + xOverlap + 10
            );
            resolved.set(nodeId2, { x: newX, y: pos2.y });
            positionArray[j] = [nodeId2, { x: newX, y: pos2.y }];
          } else {
            // Align vertically - move node2 down
            const newY = Math.max(
              pos1.y + MIN_VERTICAL_SPACING,
              pos2.y + yOverlap + 10
            );
            resolved.set(nodeId2, { x: pos2.x, y: newY });
            positionArray[j] = [nodeId2, { x: pos2.x, y: newY }];
          }
        }
      }
    }
  }
  
  return resolved;
}

/**
 * Calculate fixed positions for all nodes with special app layout
 * App is at top, page.tsx file below, app directories horizontal, components/api separate
 */
function calculateNodePositions(
  tree: SiteNode[],
  filters: Set<FilterType>,
  parentId: string | null = null,
  x: number = 0,
  y: number = 0,
  level: number = 0,
  isTopLevel: boolean = false
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const filteredTree = filterTree(tree, filters);
  const horizontalSpacing = MIN_HORIZONTAL_SPACING;
  const verticalSpacing = MIN_VERTICAL_SPACING;
  
  // Special handling for top-level (root)
  if (level === 0 && parentId === null) {
    // Filter out lib directory from root level
    const rootNodes = filteredTree.filter(n => n.name !== 'lib');
    
    // Find app node
    const appNode = rootNodes.find(n => n.name === 'app' && n.type === 'directory');
    const componentsNode = rootNodes.find(n => n.name === 'components' && n.type === 'directory');
    
    // Start Y position for app (top)
    let appY = 0;
    const centerX = 400; // Center X for app
    const componentsY = 0; // Same Y as app directory
    
    // 1. Place app node at top center
    if (appNode) {
      const appNodeId = `node-${appNode.path}`;
      positions.set(appNodeId, { x: centerX, y: appY });
      appY += verticalSpacing;
      
      // Find app/page.tsx (file)
      if ('children' in appNode) {
        const dirNode = appNode as DirectoryNode;
        const pageFile = dirNode.children.find(child => isAppHomepage(child));
        
        // Position the page file if it exists (may be filtered out)
        let pageFileY = appY;
        if (pageFile) {
          const pageFileId = `node-${pageFile.path}`;
          positions.set(pageFileId, { x: centerX, y: appY });
          pageFileY = appY;
          appY += verticalSpacing;
        }
        
        // 2. Place app directories horizontally next to page file (or app node if no page file)
        let appDirX = centerX + horizontalSpacing;
        // Separate api from other app directories
        const appDirectories = dirNode.children.filter(child => 
          child.type === 'directory' && !isAppHomepage(child) && child.name !== 'api'
        );
        const apiDirectory = dirNode.children.find(child => 
          child.type === 'directory' && child.name === 'api'
        );
        
        // Place non-api app directories first
        for (const appDir of appDirectories) {
          const appDirId = `node-${appDir.path}`;
          positions.set(appDirId, { x: appDirX, y: pageFileY }); // Same Y as page file
          appDirX += horizontalSpacing;
          
          // Calculate positions for app directory children (even if collapsed)
          if ('children' in appDir) {
            const childPositions = calculateNodePositions(
              (appDir as DirectoryNode).children,
              filters,
              appDirId,
              appDirX - horizontalSpacing, // Same X as parent
              pageFileY + verticalSpacing,
              level + 2,
              false
            );
            childPositions.forEach((pos, id) => positions.set(id, pos));
          }
        }
        
        // 3. Place api directory separately (to the right, same Y as page file)
        if (apiDirectory && 'children' in apiDirectory) {
          const apiNodeId = `node-${apiDirectory.path}`;
          positions.set(apiNodeId, { x: appDirX, y: pageFileY });
          appDirX += horizontalSpacing; // Increment for next node
          
          // Calculate children positions but they'll be hidden initially
          const apiChildPositions = calculateNodePositions(
            (apiDirectory as DirectoryNode).children,
            filters,
            apiNodeId,
            appDirX - horizontalSpacing, // Use api's X position
            pageFileY + verticalSpacing,
            level + 2,
            false
          );
          apiChildPositions.forEach((pos, id) => positions.set(id, pos));
        }
      }
    }
    
    // 4. Place components category aligned vertically with app directory (at Y=0)
    // Position it horizontally after all pages nodes have ended
    if (componentsNode) {
      const componentsNodeId = `node-${componentsNode.path}`;
      
      // Find the max X position of all pages nodes (violet directories)
      // These are horizontally arranged at the same Y level as page.tsx (pageFileY)
      let maxPagesX = centerX;
      let pageFileY: number | undefined = undefined;
      
      // Try to find pageFileY from app/page.tsx
      const pageFilePos = positions.get('node-app/page.tsx');
      if (pageFilePos) {
        pageFileY = pageFilePos.y;
      }
      
      if (pageFileY !== undefined) {
        // Find max X of all nodes at the same Y level as pages directories
        // These are the horizontally arranged pages directories (components-showcase, site-architecture, api)
        for (const [nodeId, pos] of positions.entries()) {
          // Match nodes at the same Y level as the page file (where pages directories are positioned)
          // These are the horizontally arranged pages directories
          if (Math.abs(pos.y - pageFileY) < 1) {
            maxPagesX = Math.max(maxPagesX, pos.x);
          }
        }
      } else {
        // Fallback: find max X of all nodes at any Y level that are under app/
        // This finds pages directories even if page.tsx wasn't found
        for (const [nodeId, pos] of positions.entries()) {
          const nodePath = nodeId.replace('node-', '');
          if (nodePath.startsWith('app/') && nodePath !== 'app/page.tsx') {
            maxPagesX = Math.max(maxPagesX, pos.x);
          }
        }
      }
      
      // If still no pages nodes found, fall back to finding max X at Y=0
      if (maxPagesX === centerX) {
        for (const [nodeId, pos] of positions.entries()) {
          if (pos.y === 0) {
            maxPagesX = Math.max(maxPagesX, pos.x);
          }
        }
      }
      
      // Place components to the right of all pages nodes, at same Y level as app (Y=0)
      const componentsX = maxPagesX + horizontalSpacing;
      
      positions.set(componentsNodeId, { x: componentsX, y: componentsY });
      
      // Calculate positions for components children (even if collapsed)
      if ('children' in componentsNode) {
        const dirNode = componentsNode as DirectoryNode;
        const componentsChildPositions = calculateNodePositions(
          dirNode.children,
          filters,
          componentsNodeId,
          componentsX,
          componentsY + verticalSpacing,
          level + 2,
          false
        );
        componentsChildPositions.forEach((pos, id) => positions.set(id, pos));
      }
    }
    
    // 5. Process other top-level nodes (excluding lib, app, components)
    const otherNodes = filteredTree.filter(n => 
      n.name !== 'app' && 
      n.name !== 'components' && 
      n.name !== 'lib' &&
      !(n.path.includes('/api') && n.type === 'directory')
    );
    
    for (const node of otherNodes) {
      const nodeId = `node-${node.path}`;
      if (!positions.has(nodeId)) {
        const nodeType = getNodeCategory(node);
        if (filters.has(nodeType) || node.type === 'directory') {
          let posX = x;
          let posY = componentsY + verticalSpacing * 2;
          
          // Avoid collisions
          let attempts = 0;
          while (attempts < 20) {
            let collision = false;
            for (const [_, existingPos] of positions.entries()) {
              if (nodesOverlap({ x: posX, y: posY }, existingPos)) {
                collision = true;
                break;
              }
            }
            if (!collision) break;
            posX += horizontalSpacing;
            attempts++;
          }
          
          positions.set(nodeId, { x: posX, y: posY });
        }
      }
    }
    
    // Final pass: resolve any remaining collisions
    return resolveCollisions(positions);
  }
  
  // Default behavior for nested nodes
  // Separate directories and files for different layout strategies
  const directories: SiteNode[] = [];
  const files: SiteNode[] = [];
  
  filteredTree.forEach(node => {
    const nodeType = getNodeCategory(node);
    // Only include if not filtered out or if it's a directory
    if (filters.has(nodeType) || node.type === 'directory') {
      if (node.type === 'directory') {
        directories.push(node);
      } else {
        files.push(node);
      }
    }
  });
  
  let currentX = x;
  let currentY = y;
  let directoryStartX = x;
  let directoryStartY = y;
  
  // First, place all directories horizontally
  for (let i = 0; i < directories.length; i++) {
    const node = directories[i];
    const nodeId = `node-${node.path}`;
    
    // Skip if already positioned (from special handling above) - but only for root-level nodes
    if (level === 0 && positions.has(nodeId)) {
      continue;
    }
    
    // Also skip components directory if we're processing app's children (it's a root-level node)
    if (parentId && parentId.startsWith('node-app/') && node.path === 'components') {
      continue; // Components is root-level, not under app
    }
    
    // Start with initial position (horizontal layout for directories)
    let position = { x: currentX, y: currentY };
    
    // Check for collision with already placed nodes
    let attempts = 0;
    const maxAttempts = 20;
    while (attempts < maxAttempts) {
      let collisionDetected = false;
      
      // Check against previously placed nodes
      for (const [existingId, existingPos] of positions.entries()) {
        if (nodesOverlap(position, existingPos)) {
          collisionDetected = true;
          break;
        }
      }
      
      if (!collisionDetected) {
        break; // No collision, use this position
      }
      
      // Move horizontally for directories
      position.x += horizontalSpacing;
      attempts++;
    }
    
    // Store position for this directory
    positions.set(nodeId, position);
    
    // Calculate positions for directory children
    if ('children' in node) {
      const dirNode = node as DirectoryNode;
      if (dirNode.children.length > 0) {
        // Place children below this directory
        const childPositions = calculateNodePositions(
          dirNode.children,
          filters,
          nodeId,
          position.x,
          position.y + verticalSpacing,
          level + 1,
          false
        );
        
        // Merge child positions
        childPositions.forEach((pos, id) => positions.set(id, pos));
      }
    }
    
    // Move to next directory position (horizontal)
    currentX = position.x + horizontalSpacing;
    // Keep Y the same for horizontal layout
  }
  
  // Determine starting position for files
  // Files should be placed vertically below parent, but if directories exist, start below them
  let fileStartY: number;
  let fileStartX: number;
  
  if (directories.length > 0) {
    // If directories exist, files start below them (at parent X, below directory row)
    fileStartX = x; // Parent's X position
    fileStartY = currentY + verticalSpacing; // Below the directory row
  } else {
    // No directories, files start directly below parent
    fileStartX = x;
    fileStartY = y + verticalSpacing;
  }
  
  // Now place all files vertically
  for (let i = 0; i < files.length; i++) {
    const node = files[i];
    const nodeId = `node-${node.path}`;
    
    // Skip if already positioned (from special handling above) - but only for root-level nodes
    if (level === 0 && positions.has(nodeId)) {
      continue;
    }
    
    // Files are placed vertically at parent's X position
    let position = { 
      x: fileStartX, 
      y: i === 0 ? fileStartY : currentY 
    };
    
    // Update currentY for first file
    if (i === 0) {
      currentY = fileStartY;
    }
    
    // Check for collision with already placed nodes
    let attempts = 0;
    const maxAttempts = 20;
    while (attempts < maxAttempts) {
      let collisionDetected = false;
      
      // Check against previously placed nodes
      for (const [existingId, existingPos] of positions.entries()) {
        if (nodesOverlap(position, existingPos)) {
          collisionDetected = true;
          break;
        }
      }
      
      if (!collisionDetected) {
        break; // No collision, use this position
      }
      
      // Move vertically for files
      position.y += verticalSpacing;
      attempts++;
    }
    
    // Store position for this file
    positions.set(nodeId, position);
    
    // Move to next file position (vertical)
    currentY = position.y + verticalSpacing;
    // Keep X the same for vertical layout
  }
  
  // Final pass: resolve any remaining collisions
  return resolveCollisions(positions);
}

/**
 * Convert site structure tree to React Flow nodes and edges with fixed positions
 */
function buildFlowGraph(
  tree: SiteNode[],
  filters: Set<FilterType>,
  expandedNodes: Set<string>,
  positions: Map<string, { x: number; y: number }>
): { nodes: Node[]; edges: Edge[]; nodeInfo: Map<string, NodeInfo> } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodeInfo = new Map<string, NodeInfo>();
  const filteredTree = filterTree(tree, filters);
  
  
  function processNode(
    node: SiteNode,
    parentId: string | null,
    level: number
  ): void {
    const nodeId = `node-${node.path}`;
    const isDirectory = node.type === 'directory';
    const nodeType = getNodeCategory(node);
    
    // Skip if this type is filtered out
    // Special case: Always visible nodes regardless of filters:
    // - app/ directory (Blue)
    // - components/ directory (Amber)  
    // - app/api directory and descendants (Red)
    if (!filters.has(nodeType)) {
      // Check if this is a special always-visible node
      const isAlwaysVisible = 
        node.path === 'app' ||
        node.path === 'components' ||
        node.path === 'app/api' ||
        node.path.startsWith('app/api/');
      
      if (!isAlwaysVisible) {
        // All other nodes are filtered based on their category
        return;
      }
    }
    
    // Get fixed position
    const position = positions.get(nodeId);
    if (!position) {
      return; // Skip if no position calculated
    }
    
    // Determine default visibility based on depth and category
    const shouldHideByDefault = (level: number, category: FilterType, node: SiteNode): boolean => {
      // Files visibility is controlled by filters
      
      // Hide nodes deeper than 3 levels
      if (level > 3) return true;
      
      return false;
    };
    
    // Check if this node should be hidden
    const isHidden = (() => {
      // app/ directory is always visible (Blue)
      if (node.path === 'app') {
        return false;
      }
      
      // components/ directory is always visible (Amber)
      if (node.path === 'components') {
        return false;
      }
      
      // app/api directory and descendants are always visible (Red)
      if (node.path === 'app/api' || node.path.startsWith('app/api')) {
        return false;
      }
      
      // If it's a child of a collapsed directory, hide it
      if (parentId && !expandedNodes.has(parentId)) {
        return true;
      }
      
      // For directories, always show (their children are hidden if collapsed)
      if (isDirectory) {
        return false;
      }
      
      // Apply default visibility rules for files
      if (shouldHideByDefault(level, getNodeCategory(node), node)) {
        // But show if parent is expanded
        if (parentId && expandedNodes.has(parentId)) {
          return false;
        }
        return true;
      }
      return false;
    })();
    
    // Determine node color using category-based logic
    const color = getCategoryColor(node, parentId, level);
    let label = node.name;
    
    // Collect child IDs
    const childIds: string[] = [];
    if (isDirectory && 'children' in node) {
      const dirNode = node as DirectoryNode;
      dirNode.children.forEach(child => {
        childIds.push(`node-${child.path}`);
      });
    }
    
    // Create node with fixed position
    const flowNode: Node = {
      id: nodeId,
      type: 'fileNode',
      position: position,
      hidden: isHidden,
      data: {
        label,
        node,
        color,
        depth: level,
        isExpanded: isDirectory ? expandedNodes.has(nodeId) : undefined,
      },
    };
    
    nodes.push(flowNode);
    
    // Store node info
    nodeInfo.set(nodeId, {
      id: nodeId,
      parentId,
      depth: level,
      isDirectory,
      nodeType,
      childIds,
    });
    
    // Create edge from parent
    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'smoothstep',
        hidden: isHidden,
      });
    }
    
    // Recursively process children
    if (isDirectory && 'children' in node) {
      const dirNode = node as DirectoryNode;
      dirNode.children.forEach(child => {
        processNode(child, nodeId, level + 1);
      });
    }
  }
  
  // Process all nodes
  filteredTree.forEach(node => {
    processNode(node, null, 0);
  });
  
  return { nodes, edges, nodeInfo };
}

/**
 * Directories to keep collapsed by default (standalone utilities)
 */
const EXCLUDED_DIRECTORIES = ['site-visualisation', 'site-parts', 'components-showcase', 'ui'];

/**
 * Check if a directory should be excluded from auto-expansion
 */
function shouldExcludeDirectory(node: SiteNode): boolean {
  if (node.type !== 'directory') return false;
  const pathParts = node.path.split('/');
  const directoryName = pathParts[pathParts.length - 1];
  
  // Always exclude api children
  if (isApiCategory(node) && node.path !== 'app/api' && !node.path.endsWith('/api')) {
    return true;
  }
  
  // Exclude components children (site-parts, ui)
  if (isComponentsCategory(node) && node.path !== 'components') {
    const pathSegments = node.path.split('/');
    if (pathSegments.length > 2 && pathSegments[0] === 'components') {
      return EXCLUDED_DIRECTORIES.includes(directoryName);
    }
  }
  
  return EXCLUDED_DIRECTORIES.includes(directoryName);
}

/**
 * Find directories that should be auto-expanded (contain visible content at level <= 3)
 */
function findAutoExpandNodes(
  tree: SiteNode[],
  filters: Set<FilterType>,
  level: number = 0
): Set<string> {
  const autoExpand = new Set<string>();
  const filteredTree = filterTree(tree, filters);
  
  for (const node of filteredTree) {
    const nodeId = `node-${node.path}`;
    const isDirectory = node.type === 'directory';
    
    // Never auto-expand api directory
    if (isApiCategory(node)) {
      continue;
    }
    
    // Skip excluded directories (keep them collapsed)
    if (isDirectory && shouldExcludeDirectory(node)) {
      continue;
    }
    
    if (isDirectory && 'children' in node && level < 3) {
      const dirNode = node as DirectoryNode;
      // Check if this directory has any visible children
      const hasVisibleChildren = dirNode.children.some(child => {
        const childCategory = getNodeCategory(child);
        // Child is visible if: not filtered out and depth <= 3
        if (!filters.has(childCategory)) return false;
        if (level + 1 > 3) return false; // Too deep by default
        // Don't auto-expand based on api children
        if (isApiCategory(child)) return false;
        return true;
      });
      
      if (hasVisibleChildren) {
        autoExpand.add(nodeId);
        // Recursively check children (but don't auto-expand excluded directories)
        const childAutoExpand = findAutoExpandNodes(dirNode.children, filters, level + 1);
        childAutoExpand.forEach(id => autoExpand.add(id));
      }
    }
  }
  
  return autoExpand;
}

export function SiteTree({ tree, filters }: SiteTreeProps) {
  // Calculate initial auto-expanded nodes (directories with visible content at level <= 3)
  const initialExpanded = useMemo(
    () => findAutoExpandNodes(tree, filters),
    [tree, filters]
  );
  
  // Track expanded directory nodes
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(initialExpanded);
  const [nodeInfoMap, setNodeInfoMap] = useState<Map<string, NodeInfo>>(new Map());
  
  // Calculate fixed positions for all nodes (doesn't change when expand state changes)
  const nodePositions = useMemo(
    () => calculateNodePositions(tree, filters, null, 0, 0, 0, true),
    [tree, filters]
  );
  
  // Update expanded nodes when filters change
  useEffect(() => {
    const newAutoExpand = findAutoExpandNodes(tree, filters);
    setExpandedNodes(newAutoExpand);
  }, [tree, filters]);
  
  // Build graph with fixed positions
  const { nodes: initialNodes, edges: initialEdges, nodeInfo: initialNodeInfo } = useMemo(
    () => buildFlowGraph(tree, filters, expandedNodes, nodePositions),
    [tree, filters, expandedNodes, nodePositions]
  );
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Track previous node positions for drag delta calculation
  const [previousPositions, setPreviousPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  
  // Store node info map
  useEffect(() => {
    setNodeInfoMap(initialNodeInfo);
  }, [initialNodeInfo]);
  
  // Initialize previous positions when nodes are rebuilt (tree/filter changes)
  useEffect(() => {
    const newPositions = new Map<string, { x: number; y: number }>();
    nodes.forEach(node => {
      newPositions.set(node.id, { x: node.position.x, y: node.position.y });
    });
    setPreviousPositions(newPositions);
  }, [tree, filters, expandedNodes, nodePositions]);
  
  // Update previous positions after dragging (when nodes change due to dragging)
  useEffect(() => {
    // Only update if nodes actually changed positions (not just rebuilt)
    const currentPositions = new Map<string, { x: number; y: number }>();
    nodes.forEach(node => {
      currentPositions.set(node.id, { x: node.position.x, y: node.position.y });
    });
    
    // Check if any positions actually changed (dragging occurred)
    let positionsChanged = false;
    for (const [nodeId, currentPos] of currentPositions.entries()) {
      const prevPos = previousPositions.get(nodeId);
      if (!prevPos || 
          Math.abs(currentPos.x - prevPos.x) > 0.1 || 
          Math.abs(currentPos.y - prevPos.y) > 0.1) {
        positionsChanged = true;
        break;
      }
    }
    
    if (positionsChanged) {
      setPreviousPositions(currentPositions);
    }
  }, [nodes]);
  
  /**
   * Recursively get all descendant node IDs for a given parent node
   */
  const getAllDescendants = useCallback((nodeId: string, nodeInfoMap: Map<string, NodeInfo>): string[] => {
    const descendants: string[] = [];
    const nodeInfo = nodeInfoMap.get(nodeId);
    
    if (!nodeInfo) return descendants;
    
    // Get direct children
    nodeInfo.childIds.forEach(childId => {
      descendants.push(childId);
      // Recursively get descendants of this child
      const childDescendants = getAllDescendants(childId, nodeInfoMap);
      descendants.push(...childDescendants);
    });
    
    return descendants;
  }, []);
  
  /**
   * Custom onNodesChange handler that applies relative dragging to child nodes
   */
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Track which nodes moved and their deltas
    const nodeDeltas = new Map<string, { dx: number; dy: number }>();
    
    changes.forEach(change => {
      if (change.type === 'position' && change.position !== undefined) {
        const node = nodes.find(n => n.id === change.id);
        if (node) {
          const oldPos = previousPositions.get(change.id) || node.position;
          const newPos = change.position;
          const dx = newPos.x - oldPos.x;
          const dy = newPos.y - oldPos.y;
          
          // Only track if there was actual movement (dragging, not just initialization)
          if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            nodeDeltas.set(change.id, { dx, dy });
          }
        }
      }
    });
    
    // Apply deltas to all descendants
    if (nodeDeltas.size > 0) {
      // First apply original changes to get updated node positions
      const updatedNodes = applyNodeChanges(changes, nodes);
      const nodesToUpdate = new Map<string, { x: number; y: number }>();
      
      nodeDeltas.forEach((delta, parentId) => {
        const descendants = getAllDescendants(parentId, nodeInfoMap);
        
        descendants.forEach(descendantId => {
          const descendantNode = updatedNodes.find(n => n.id === descendantId);
          if (descendantNode) {
            const newPos = {
              x: descendantNode.position.x + delta.dx,
              y: descendantNode.position.y + delta.dy,
            };
            nodesToUpdate.set(descendantId, newPos);
          }
        });
      });
      
      // Create additional changes for descendant nodes
      const descendantChanges: NodeChange[] = [];
      nodesToUpdate.forEach((newPos, nodeId) => {
        descendantChanges.push({
          id: nodeId,
          type: 'position',
          position: newPos,
        });
      });
      
      // Combine original changes with descendant changes and apply all at once
      const allChanges = [...changes, ...descendantChanges];
      onNodesChange(allChanges);
    } else {
      // No dragging detected, just apply the changes normally
      onNodesChange(changes);
    }
  }, [nodes, previousPositions, nodeInfoMap, getAllDescendants, onNodesChange]);
  
  // Handle node click to expand/collapse
  const onNodeClick: NodeMouseHandler = useCallback((_event, clickedNode) => {
    const info = nodeInfoMap.get(clickedNode.id);
    if (!info || !info.isDirectory) {
      return; // Only directories can be expanded/collapsed
    }
    
    const isCurrentlyExpanded = expandedNodes.has(clickedNode.id);
    const newExpandedNodes = new Set(expandedNodes);
    
    if (isCurrentlyExpanded) {
      // Collapse: remove this node and all its descendants
      newExpandedNodes.delete(clickedNode.id);
      // Remove all descendants
      const removeDescendants = (nodeId: string) => {
        const nodeInfo = nodeInfoMap.get(nodeId);
        if (nodeInfo) {
          nodeInfo.childIds.forEach(childId => {
            const childInfo = nodeInfoMap.get(childId);
            if (childInfo?.isDirectory) {
              newExpandedNodes.delete(childId);
              removeDescendants(childId);
            }
          });
        }
      };
      removeDescendants(clickedNode.id);
    } else {
      // Expand: add this node
      newExpandedNodes.add(clickedNode.id);
    }
    
    setExpandedNodes(newExpandedNodes);
  }, [expandedNodes, nodeInfoMap]);
  
  // Update nodes/edges when tree, filters, or expanded state changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges, nodeInfo: newNodeInfo } = buildFlowGraph(
      tree,
      filters,
      expandedNodes,
      nodePositions
    );
    setNodes(newNodes);
    setEdges(newEdges);
    setNodeInfoMap(newNodeInfo);
  }, [tree, filters, expandedNodes, nodePositions, setNodes, setEdges]);
  
  return (
    <div className="h-[calc(100vh-200px)] w-full border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const color = (node.data as { color?: string })?.color;
            return color || '#6b7280';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}


