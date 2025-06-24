# Proposal System

The proposal system ensures that all AI actions (code, content, config, social) are validated by MissionGuardian before execution. This provides a safety mechanism to prevent system drift and ensure all actions align with the core vision, mission, and values.

## Overview

### Key Features

- **Proposal Creation**: All AI actions are first created as proposals with a summary, intent, and proposed changes
- **MissionGuardian Validation**: Proposals are automatically validated against the immutable vision, mission, and values
- **Status Tracking**: Proposals have clear statuses: `pending`, `validated`, `rejected`, `executed`
- **Execution Control**: Only validated proposals can be executed
- **Comprehensive Logging**: All proposals and their validation results are logged for transparency

### Action Types

1. **Code**: Code changes, file modifications, new features
2. **Content**: Content updates, policy changes, documentation
3. **Config**: System configuration changes, settings updates
4. **Social**: Community interactions, notifications, communications

## Architecture

### Components

1. **Proposal Model** (`backend/app/models/database.py`)
   - Stores proposal data with validation results
   - Auto-expires after 30 days for privacy
   - Tracks status and execution history

2. **ProposalService** (`backend/app/services/proposal_service.py`)
   - Manages proposal lifecycle
   - Handles validation through MissionGuardian
   - Executes validated proposals

3. **AI Agent Integration** (`backend/app/services/ai_agent.py`)
   - Creates proposals for different action types
   - Provides methods for proposal management
   - Integrates with existing AI functionality

4. **API Endpoints** (`backend/app/main.py`)
   - RESTful API for proposal operations
   - Status checking and statistics
   - Execution and rejection endpoints

## Usage

### Creating a Proposal

```python
# Example: Creating a code proposal
proposal_data = {
    "action_type": "code",
    "summary": "Add privacy-focused data encryption",
    "intent": "Implement end-to-end encryption for user data to enhance privacy and align with digital sovereignty mission.",
    "proposed_changes": {
        "file": "backend/app/models/database.py",
        "changes": ["Add encryption field", "Implement encryption methods"],
        "impact": "Enhanced user privacy"
    },
    "session_id": "user-session-id"
}

response = requests.post("http://localhost:8000/api/proposals", json=proposal_data)
```

### Checking Proposal Status

```python
# Get proposal status
response = requests.get(f"http://localhost:8000/api/proposals/{proposal_id}")
result = response.json()
print(f"Status: {result['status']}")
print(f"Valid: {result['validation_result']['is_valid']}")
```

### Executing a Validated Proposal

```python
# Execute a validated proposal
response = requests.post(f"http://localhost:8000/api/proposals/{proposal_id}/execute")
result = response.json()
print(f"Executed: {result['success']}")
```

### Getting Statistics

```python
# Get proposal statistics
response = requests.get("http://localhost:8000/api/proposals/stats")
stats = response.json()
print(f"Total: {stats['total']}")
print(f"Validated: {stats['validated']}")
print(f"Rejected: {stats['rejected']}")
print(f"Executed: {stats['executed']}")
```

## API Endpoints

### POST `/api/proposals`
Create a new proposal.

**Request Body:**
```json
{
    "action_type": "code|content|config|social",
    "summary": "Brief summary of the proposed action",
    "intent": "Detailed intent and reasoning",
    "proposed_changes": {
        "key": "value"
    },
    "session_id": "optional-session-id"
}
```

**Response:**
```json
{
    "success": true,
    "proposal_id": "uuid",
    "status": "validated|rejected",
    "validation_result": {
        "is_valid": true,
        "vision_alignment": 0.85,
        "mission_alignment": 0.90,
        "overall_values_score": 0.88,
        "violations": [],
        "recommendations": []
    }
}
```

### GET `/api/proposals/{proposal_id}`
Get the status of a specific proposal.

**Response:**
```json
{
    "success": true,
    "proposal_id": "uuid",
    "status": "pending|validated|rejected|executed",
    "action_type": "code",
    "summary": "Proposal summary",
    "validation_result": {...},
    "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST `/api/proposals/{proposal_id}/execute`
Execute a validated proposal.

**Response:**
```json
{
    "success": true,
    "proposal_id": "uuid",
    "status": "executed"
}
```

### POST `/api/proposals/{proposal_id}/reject`
Reject a proposal.

**Request Body:**
```json
{
    "reason": "Optional rejection reason"
}
```

### GET `/api/proposals/stats`
Get statistics about all proposals.

**Response:**
```json
{
    "total": 10,
    "pending": 2,
    "validated": 6,
    "rejected": 1,
    "executed": 1,
    "validation_rate": 0.6,
    "execution_rate": 0.17
}
```

## Validation Process

### MissionGuardian Validation

Each proposal is validated against:

1. **Vision Alignment**: Checks alignment with collective ownership and digital sovereignty
2. **Mission Alignment**: Verifies support for awareness-raising and community building
3. **Values Compliance**: Ensures adherence to all core values
4. **Prohibited Patterns**: Detects violations of core principles

### Validation Criteria

- **Vision Alignment Threshold**: 0.8 (80%)
- **Values Compliance Threshold**: 0.9 (90%)
- **No Violations**: Must not contain prohibited patterns

### Automatic Rejection

Proposals are automatically rejected if they:
- Contain surveillance capitalism language
- Promote data exploitation
- Violate privacy principles
- Contradict core values

## Testing

Run the test script to verify the proposal system:

```bash
cd backend
python test_proposals.py
```

This will:
1. Create a sample proposal
2. Check its validation status
3. Display statistics
4. Demonstrate the complete workflow

## Security and Privacy

- **No Cookies**: The system doesn't set any cookies
- **No Caching**: User data is never cached
- **Auto-Expiration**: Proposals auto-delete after 30 days
- **Session-Based**: Uses anonymous session IDs for tracking
- **Validation Logging**: All validation decisions are logged for transparency

## Integration with Existing System

The proposal system integrates seamlessly with:

- **AI Agent**: All AI actions go through the proposal system
- **MissionGuardian**: Provides validation and safety checks
- **Database**: Stores proposals with proper privacy controls
- **API**: RESTful endpoints for all operations

## Future Enhancements

- **Community Voting**: Allow community members to vote on proposals
- **Automated Execution**: Execute validated proposals automatically
- **Rollback Capability**: Ability to rollback executed proposals
- **Advanced Analytics**: Detailed impact analysis and metrics
- **Integration Hooks**: Connect with external systems for execution 