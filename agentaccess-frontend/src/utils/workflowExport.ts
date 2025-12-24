/**
 * Workflow Import/Export Utilities
 *
 * Handles importing and exporting workflows in FastGPT-compatible format
 */

import type { Workflow } from '@/types/workflow'
import type { FastGPTWorkflowTemplate } from '@/types/fastgpt'
import { getFastGPTService } from '@/services/fastgpt'

/**
 * Export a workflow to FastGPT JSON format
 */
export function exportToFastGPTFormat(workflow: Workflow): FastGPTWorkflowTemplate {
  const service = getFastGPTService()
  if (!service) {
    throw new Error('FastGPT service not available')
  }

  return service.convertToFastGPTFormat(workflow)
}

/**
 * Export a workflow and trigger file download
 */
export function downloadWorkflowAsJson(workflow: Workflow, filename?: string): void {
  const fastgptWorkflow = exportToFastGPTFormat(workflow)
  const json = JSON.stringify(fastgptWorkflow, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename || `${workflow.name.replace(/\s+/g, '-')}-fastgpt.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Import a workflow from FastGPT JSON format
 */
export function importFromFastGPTFormat(json: string): Workflow {
  const fastgptWorkflow = JSON.parse(json) as FastGPTWorkflowTemplate
  validateFastGPTWorkflow(fastgptWorkflow)

  const service = getFastGPTService()
  if (!service) {
    throw new Error('FastGPT service not available')
  }

  return service.convertFromFastGPTFormat(fastgptWorkflow)
}

/**
 * Validate FastGPT workflow format
 */
function validateFastGPTWorkflow(workflow: FastGPTWorkflowTemplate): void {
  const errors: string[] = []

  // Required fields
  if (!workflow.id) {
    errors.push('Missing required field: id')
  }
  if (!workflow.name) {
    errors.push('Missing required field: name')
  }
  if (!workflow.type) {
    errors.push('Missing required field: type')
  }

  // Nodes validation
  if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
    errors.push('nodes must be an array')
  }

  // Edges validation
  if (!workflow.edges || !Array.isArray(workflow.edges)) {
    errors.push('edges must be an array')
  }

  // Check for unsupported node types
  const supportedNodeTypes = [
    'StartNode',
    'EndNode',
    'DatasetSearchNode',
    'LLMNode',
    'HttpNode',
    'CodeNode'
  ]

  const unsupportedNodes: string[] = []
  workflow.nodes?.forEach(node => {
    if (!supportedNodeTypes.includes(node.flowNodeType)) {
      unsupportedNodes.push(`${node.flowNodeType} (${node.name})`)
    }
  })

  if (unsupportedNodes.length > 0) {
    console.warn('Workflow contains unsupported node types:', unsupportedNodes)
  }

  if (errors.length > 0) {
    throw new Error(`Invalid workflow format:\n${errors.join('\n')}`)
  }
}

/**
 * Get a summary of unsupported nodes in a workflow
 */
export function getUnsupportedNodesSummary(workflow: FastGPTWorkflowTemplate): {
  count: number
  nodes: Array<{ name: string; type: string }>
} {
  const supportedNodeTypes = [
    'StartNode',
    'EndNode',
    'DatasetSearchNode',
    'LLMNode',
    'HttpNode',
    'CodeNode'
  ]

  const unsupportedNodes = workflow.nodes
    ?.filter(node => !supportedNodeTypes.includes(node.flowNodeType))
    .map(node => ({
      name: node.name,
      type: node.flowNodeType
    })) || []

  return {
    count: unsupportedNodes.length,
    nodes: unsupportedNodes
  }
}

/**
 * Read a file and parse as JSON
 */
export function readFileAsJson(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        resolve(json)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

/**
 * Validate if a file is a valid workflow file
 */
export function isValidWorkflowFile(file: File): boolean {
  const validExtensions = ['.json', '.fastgpt']
  const fileName = file.name.toLowerCase()

  return validExtensions.some(ext => fileName.endsWith(ext))
}
