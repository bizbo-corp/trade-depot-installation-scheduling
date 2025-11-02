"use client";

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { File, Folder, FileCode, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileNode as FileNodeType, DirectoryNode } from '@/lib/site-analyzer';

interface FileNodeData {
  label: string;
  node: FileNodeType | DirectoryNode;
  color: string;
  depth?: number;
  isExpanded?: boolean;
}

export const FileNodeComponent = memo(({ data }: NodeProps) => {
  if (!data) {
    return null;
  }
  
  const { label = '', node, color = '#6b7280', isExpanded } = (data as unknown) as FileNodeData;
  
  if (!node) {
    return null;
  }
  
  const isDirectory = node.type === 'directory';
  const fileNode = !isDirectory ? (node as FileNodeType) : null;
  
  // Check if directory has children
  const hasChildren = isDirectory && 'children' in node && (node as DirectoryNode).children.length > 0;
  
  const getIcon = () => {
    if (isDirectory) {
      return <Folder className="h-4 w-4" />;
    }
    return <FileCode className="h-4 w-4" />;
  };
  
  const getTypeLabel = () => {
    if (isDirectory) return 'Directory';
    if (fileNode) {
      switch (fileNode.type) {
        case 'page':
          return 'Page';
        case 'layout':
          return 'Layout';
        case 'component':
          return 'Component';
        case 'ui-component':
          return 'UI Component';
        case 'utility':
          return 'Utility';
        default:
          return 'File';
      }
    }
    return 'File';
  };
  
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 shadow-sm bg-background min-w-[200px]",
        isDirectory && hasChildren && "cursor-pointer hover:bg-muted/50 transition-colors"
      )}
      style={{ borderColor: color }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-start gap-2">
        {isDirectory && hasChildren && (
          <div className="mt-0.5 flex-shrink-0" style={{ color }}>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
        <div style={{ color }} className="mt-0.5 flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate" title={label}>
            {label}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {getTypeLabel()}
          </div>
          {fileNode && (
            <>
              {fileNode.isClient && (
                <div className="text-xs text-blue-500 mt-1">Client Component</div>
              )}
              {fileNode.imports.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {fileNode.imports.length} import{fileNode.imports.length !== 1 ? 's' : ''}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1 truncate" title={fileNode.relativePath}>
                {fileNode.relativePath}
              </div>
            </>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});

FileNodeComponent.displayName = 'FileNode';

