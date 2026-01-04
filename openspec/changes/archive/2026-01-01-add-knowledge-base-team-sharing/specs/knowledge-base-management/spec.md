# Knowledge Base Team Sharing - Specification Deltas

## ADDED Requirements

### Requirement: Knowledge Base Ownership and Classification

The system SHALL track ownership and classification for each knowledge base.

#### Scenario: System sets owner on knowledge base creation

- **GIVEN** a user creates a new knowledge base
- **WHEN** the knowledge base is created
- **THEN** the system SHALL set `owner` to the creating user's ID
- **AND** the system SHALL set `category` to 'personal' by default
- **AND** the system SHALL set `permission` to 'owner' by default

#### Scenario: User views personal vs team knowledge base

- **GIVEN** a user has created 3 personal knowledge bases
- **AND** the user has access to 2 team knowledge bases
- **WHEN** the user navigates to the Knowledge Base page
- **THEN** the system SHALL display 3 knowledge bases in "我的知识库" tab
- **AND** the system SHALL display 2 knowledge bases in "团队知识库" tab

### Requirement: Team Knowledge Base Creation

The system SHALL allow users to create team knowledge bases directly with team sharing configured.

#### Scenario: User creates team knowledge base

- **GIVEN** a user opens the text import dialog
- **WHEN** the user selects "团队知识库" as the category
- **THEN** the system SHALL display team selection options
- **AND** the user MUST select at least one team to proceed
- **WHEN** the user submits the form with team selections
- **THEN** the system SHALL create the knowledge base with `category: 'team'`
- **AND** the system SHALL store the selected teams in `sharedTeams`
- **AND** the system SHALL set `permission: 'team'`

#### Scenario: User creates team knowledge base with write permission

- **GIVEN** a user is creating a team knowledge base
- **WHEN** the user selects "可编辑" permission for a team
- **THEN** team members SHALL be able to view and modify the knowledge base

### Requirement: Share Personal Knowledge Base to Team

The system SHALL allow knowledge base owners to share their personal knowledge bases with teams.

#### Scenario: Owner shares personal knowledge base to team

- **GIVEN** a user owns a personal knowledge base
- **WHEN** the user opens the edit dialog
- **AND** changes the category to "团队知识库"
- **AND** selects one or more teams to share with
- **AND** selects permission level for each team
- **WHEN** the user saves the changes
- **THEN** the system SHALL update `category` to 'team'
- **AND** the system SHALL store team sharing settings in `sharedTeams`
- **AND** the system SHALL update `permission` to 'team'

#### Scenario: Owner shares knowledge base with multiple teams

- **GIVEN** a user owns a personal knowledge base
- **WHEN** the user shares the knowledge base with team "研发部" as read-only
- **AND** shares the knowledge base with team "市场部" as write-enabled
- **THEN** "研发部" members SHALL be able to view but not edit
- **AND** "市场部" members SHALL be able to view and edit

### Requirement: Team Knowledge Base Access Control

The system SHALL control access to team knowledge bases based on team membership and sharing settings.

#### Scenario: Team member can view shared knowledge base

- **GIVEN** a knowledge base is shared with team "研发部"
- **WHEN** a user who is a member of "研发部" accesses the system
- **THEN** the knowledge base SHALL appear in the user's "团队知识库" tab
- **AND** the user SHALL be able to view the knowledge base details

#### Scenario: Non-team member cannot access team knowledge base

- **GIVEN** a knowledge base is shared only with team "研发部"
- **WHEN** a user who is NOT a member of "研发部" accesses the system
- **THEN** the knowledge base SHALL NOT appear in any of the user's tabs
- **AND** the user SHALL NOT be able to access the knowledge base

#### Scenario: Team member with read permission cannot edit

- **GIVEN** a knowledge base is shared with team "研发部" with read permission
- **WHEN** a "研发部" member views the knowledge base card
- **THEN** the edit button SHALL be hidden or disabled
- **AND** the delete button SHALL be hidden or disabled
- **AND** a "只读" badge SHALL be displayed on the card

#### Scenario: Team member with write permission can edit

- **GIVEN** a knowledge base is shared with team "研发部" with write permission
- **WHEN** a "研发部" member views the knowledge base card
- **THEN** the edit button SHALL be visible and enabled
- **AND** the delete button SHALL remain hidden (only owner can delete)

### Requirement: Knowledge Base Category and Permission Constraints

The system SHALL enforce category-based permission constraints.

#### Scenario: Personal category restricts permission options

- **GIVEN** a user is editing a personal knowledge base
- **WHEN** the category is set to "个人知识库"
- **THEN** the permission type SHALL be restricted to "仅自己可见"
- **AND** team selection options SHALL be hidden or disabled

#### Scenario: Team category enables team permissions

- **GIVEN** a user is editing a team knowledge base
- **WHEN** the category is set to "团队知识库"
- **THEN** the permission type SHALL be restricted to "指定团队" or "指定团队与用户"
- **AND** team selection options SHALL be displayed

### Requirement: Team Selection with Search

The system SHALL provide team selection with search functionality for sharing knowledge bases.

#### Scenario: User searches for teams to share with

- **GIVEN** a user has access to 20 teams
- **WHEN** the user types "研发" in the team search box
- **THEN** the system SHALL filter teams to show only those matching "研发"
- **AND** the user SHALL be able to select multiple teams from the filtered results

#### Scenario: User selects multiple teams with different permissions

- **GIVEN** a user is configuring team sharing
- **WHEN** the user selects "研发部" with write permission
- **AND** selects "市场部" with read permission
- **THEN** both teams SHALL be stored in `sharedTeams` with their respective permission levels

### Requirement: Knowledge Base Sharing Display

The system SHALL display sharing information on knowledge base cards.

#### Scenario: Team knowledge base card displays shared teams

- **GIVEN** a knowledge base is shared with 2 teams
- **WHEN** the knowledge base card is displayed
- **THEN** the card SHALL show team badges for each shared team
- **AND** the card SHALL show total count of teams if more than 3
- **AND** hover over the count SHALL display all team names

#### Scenario: Read-only knowledge base shows badge

- **GIVEN** a user is viewing a team-shared knowledge base with read permission
- **WHEN** the knowledge base card is displayed
- **THEN** a "只读" badge SHALL be displayed on the card
- **AND** edit/delete actions SHALL be visually disabled

### Requirement: Owner Privileges

The system SHALL grant full privileges to knowledge base owners regardless of team sharing.

#### Scenario: Owner retains full control after sharing

- **GIVEN** a knowledge base owner shares the knowledge base with a team
- **WHEN** the owner views the knowledge base card
- **THEN** the owner SHALL see edit and delete buttons
- **AND** the owner SHALL be able to modify sharing settings
- **AND** the owner SHALL be able to revoke team access

#### Scenario: Owner can revoke team access

- **GIVEN** a knowledge base is shared with team "研发部"
- **WHEN** the owner removes "研发部" from the shared teams list
- **AND** saves the changes
- **THEN** "研发部" members SHALL NO LONGER see the knowledge base
- **AND** the system SHALL update `sharedTeams` to exclude "研发部"

## MODIFIED Requirements

### Requirement: Knowledge Base Data Model

The system SHALL extend the KnowledgeBase data model to support team sharing.

[Original requirement exists - this extends the data model with ownership, category, sharedTeams, and permission fields]

#### Scenario: Extended knowledge base model with team sharing

- **GIVEN** a knowledge base is created
- **THEN** it SHALL include the following fields:
  - `owner`: string - the ID of the creating user
  - `category`: 'personal' | 'team' - classification of the knowledge base
  - `sharedTeams`: TeamSharing[] - array of team sharing configurations
  - `permission`: 'owner' | 'team' | 'public' | 'specific' - access control type

#### Scenario: Backward compatibility for existing knowledge bases

- **GIVEN** the system loads an existing knowledge base without the new fields
- **THEN** the system SHALL default `owner` to the current user
- **AND** the system SHALL default `category` to 'personal'
- **AND** the system SHALL default `permission` to 'owner'
- **AND** the system SHALL initialize `sharedTeams` as empty array

### Requirement: Knowledge Base Editing

The system SHALL allow owners to edit knowledge base sharing settings.

[Original requirement exists - this adds sharing settings to the edit dialog]

#### Scenario: Owner edits sharing settings

- **GIVEN** a user owns a knowledge base
- **WHEN** the user opens the edit dialog
- **THEN** the dialog SHALL include a "共享设置" section
- **AND** the user SHALL be able to change the category
- **AND** the user SHALL be able to add or remove team sharing
- **AND** the user SHALL be able to modify permission levels for each team

#### Scenario: Non-owner cannot edit sharing settings

- **GIVEN** a user is viewing a team-shared knowledge base with write permission
- **WHEN** the user opens the edit dialog
- **THEN** the "共享设置" section SHALL be read-only or hidden
- **AND** the user SHALL only be able to modify name and description
