export type KnowledgeBaseType = 'text' | 'spreadsheet' | 'database'

export type DatabaseType = 'mysql' | 'postgresql'

export interface KnowledgeBaseSourceInfo {
  // Text/Spreadsheet specific
  fileType?: string
  fileName?: string
  fileSize?: number
  // Database specific
  dbType?: DatabaseType
  host?: string
  port?: number
  database?: string
  table?: string
}

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  type: KnowledgeBaseType
  sourceInfo: KnowledgeBaseSourceInfo
  createdAt: Date
  updatedAt: Date
}

export interface TextImportForm {
  name: string
  description: string
  file: File | null
  encoding: string
  language: string
}

export interface SpreadsheetImportForm {
  name: string
  description: string
  file: File | null
  hasHeader: boolean
  encoding: string
}

export interface DatabaseImportForm {
  name: string
  description: string
  dbType: DatabaseType
  host: string
  port: number
  username: string
  password: string
  database: string
  table: string
}

export interface DatabaseConnectionTest {
  success: boolean
  message: string
  tables?: string[]
}
