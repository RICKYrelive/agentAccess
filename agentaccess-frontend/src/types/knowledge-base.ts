export type KnowledgeBaseType = 'text' | 'spreadsheet' | 'database'

export type DatabaseType = 'mysql' | 'postgresql'

// Embedding models
export type EmbeddingModel =
  | 'text-embedding-3-small'
  | 'text-embedding-3-large'
  | 'text-embedding-ada-002'
  | 'bge-large-zh'
  | 'bge-small-zh'
  | 'm3e-base'
  | 'm3e-large'

// ReRank models
export type ReRankModel =
  | 'bge-reranker-large'
  | 'bge-reranker-base'
  | 'cohere-rerank-v3'
  | 'jina-reranker-v1'

// Sync frequency for database
export type SyncFrequency = 'realtime' | 'hourly' | 'daily' | 'manual'

export interface FileInfo {
  id: string
  fileType: string
  fileName: string
  fileSize: number
  addedAt: Date
}

export interface DatabaseConnectionInfo {
  dbType: DatabaseType
  host: string
  port: number
  username: string
  database: string
}

// Chunking configuration for text/spreadsheet
export interface ChunkingConfig {
  // Chunk size in tokens
  chunkSize: number
  // Overlap between chunks
  chunkOverlap: number
  // For spreadsheet: split by row or column
  splitBy?: 'row' | 'column'
  // For spreadsheet: has header row
  hasHeader?: boolean
}

// Embedding configuration
export interface EmbeddingConfig {
  enabled: boolean
  model: EmbeddingModel
  // Dimension for the embedding model
  dimension?: number
}

// ReRank configuration
export interface ReRankConfig {
  enabled: boolean
  model: ReRankModel
  // Number of results to return after reranking
  topK: number
  // Similarity threshold (0-1)
  scoreThreshold: number
}

// Database sync configuration
export interface DatabaseSyncConfig {
  // Sync frequency
  frequency: SyncFrequency
  // Last sync time
  lastSyncAt?: Date
  // Max rows per query
  maxRowsPerQuery: number
  // Enable caching
  enableCache: boolean
}

// Common settings for all knowledge base types
export interface KnowledgeBaseSettings {
  // Is knowledge base public
  isPublic: boolean
  // Is knowledge base enabled
  isEnabled: boolean
  // Tags for organization
  tags: string[]
}

// Configuration specific to each knowledge base type
export interface KnowledgeBaseConfig {
  // Common settings
  settings: KnowledgeBaseSettings
  // Chunking configuration (for text/spreadsheet)
  chunking?: ChunkingConfig
  // Embedding configuration
  embedding: EmbeddingConfig
  // ReRank configuration
  rerank: ReRankConfig
  // Database sync configuration (for database type)
  databaseSync?: DatabaseSyncConfig
}

export interface KnowledgeBaseSourceInfo {
  // Multiple files for text/spreadsheet
  files?: FileInfo[]
  // Legacy single file support (for backward compatibility)
  fileType?: string
  fileName?: string
  fileSize?: number
  // Database connection with multiple tables
  connection?: DatabaseConnectionInfo
  tables?: string[]
  // Legacy database fields (for backward compatibility)
  dbType?: DatabaseType
  host?: string
  port?: number
  username?: string
  password?: string
  database?: string
  table?: string
}

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  type: KnowledgeBaseType
  sourceInfo: KnowledgeBaseSourceInfo
  config: KnowledgeBaseConfig
  createdAt: Date
  updatedAt: Date
}

export interface TextImportForm {
  name: string
  description: string
  files: File[]
  encoding: string
  language: string
}

export interface SpreadsheetImportForm {
  name: string
  description: string
  files: File[]
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
  tables: string[]
}

export interface DatabaseConnectionTest {
  success: boolean
  message: string
  tables?: string[]
}
