export interface KnowledgeBase {
  id: string
  name: string
  description?: string
  category: KnowledgeCategory
  documentCount: number
  lastUpdated: Date
  isPublic: boolean
  createdBy: string
}

export interface KnowledgeCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
}

export interface KnowledgeDocument {
  id: string
  title: string
  content: string
  knowledgeBaseId: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  author: string
  type: 'text' | 'markdown' | 'pdf' | 'doc'
}

export interface FunctionCard {
  id: string
  title: string
  description: string
  icon: string
  category: string
  isActive: boolean
  knowledgeBaseId?: string
}
