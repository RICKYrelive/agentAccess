# Knowledge Base Team Sharing - Implementation Tasks

## 1. Data Model & Type Extensions
- [x] 1.1 Update `KnowledgeBase` interface in `src/types/knowledge-base.ts`
- [x] 1.2 Add `TeamSharing` interface definition
- [x] 1.3 Update knowledge base store mock data to include new fields

## 2. Store Updates
- [x] 2.1 Add `canViewKnowledgeBase` helper function to store
- [x] 2.2 Add `canEditKnowledgeBase` helper function to store
- [x] 2.3 Add `shareKnowledgeBaseToTeam` action
- [x] 2.4 Add `updateKnowledgeBaseSharing` action
- [x] 2.5 Add `getTeamKnowledgeBases` getter

## 3. KnowledgeBasePage UI Updates
- [x] 3.1 Add category tabs (我的知识库, 团队知识库)
- [x] 3.2 Implement tab switching logic
- [x] 3.3 Filter knowledge bases by category
- [x] 3.4 Add team badge on team-shared knowledge base cards

## 4. Edit Dialog Updates
- [x] 4.1 Add "共享设置" section to EditKnowledgeBaseDialog
- [x] 4.2 Add category selection (personal/team)
- [x] 4.3 Add permission type dropdown with category constraints
- [x] 4.4 Add team selection multi-select with search
- [x] 4.5 Add permission level toggle (read/write)
- [x] 4.6 Implement permission validation logic

## 5. Create Dialog Updates
- [x] 5.1 Add "知识库分类" option to import dialogs
- [x] 5.2 Show team selection when "团队知识库" is selected
- [x] 5.3 Pre-fill sharing settings based on category

## 6. Access Control Integration
- [x] 6.1 Update delete action to check edit permission
- [x] 6.2 Update edit button visibility based on permission
- [x] 6.3 Add visual indicators for read-only team knowledge bases

## 7. Testing
- [ ] 7.1 Test personal knowledge base creation
- [ ] 7.2 Test team knowledge base creation
- [ ] 7.3 Test sharing personal knowledge base to team
- [ ] 7.4 Test view permission enforcement
- [ ] 7.5 Test edit permission enforcement
- [ ] 7.6 Test category tab filtering
- [ ] 7.7 Test team selection with search
