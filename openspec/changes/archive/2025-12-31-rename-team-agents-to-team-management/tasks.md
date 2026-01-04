# Rename "Team Agents" to "Team Management" - Implementation Tasks

## 1. Sidebar Navigation Component Updates
- [x] 1.1 Rename state variable `isTeamAgentsOpen` to `isTeamManagementOpen`
- [x] 1.2 Rename handler function `handleTeamAgentsClick` to `handleTeamManagementClick`
- [x] 1.3 Update watch logic for team view state

## 2. Template Structure Changes
- [x] 2.1 Remove "团队Agent" button from Agent section
- [x] 2.2 Create new Team Management section after Knowledge Base
- [x] 2.3 Add separator line between Knowledge Base and Team Management sections
- [x] 2.4 Move team items (team list) markup to new location
- [x] 2.5 Update button label from "团队Agent" to "团队管理"

## 3. View State Management
- [x] 3.1 Update `activeView` watch logic for new state variable
- [x] 3.2 Ensure collapsible behavior works with new position

## 4. Testing
- [ ] 4.1 Test navigation to team-agents view
- [ ] 4.2 Test navigation to team-detail view
- [ ] 4.3 Test collapsible section expand/collapse
- [ ] 4.4 Test team list display
- [ ] 4.5 Test keyboard navigation
- [ ] 4.6 Test responsive layout on mobile/tablet

## 5. Verification
- [x] 5.1 Verify no broken links or references
- [x] 5.2 Verify all existing functionality works
- [x] 5.3 Run type-check and fix any errors
- [ ] 5.4 Visual check of separator line
- [ ] 5.5 Visual check of label and position
