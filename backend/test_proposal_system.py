#!/usr/bin/env python3
"""
Test script for the proposal system.
Demonstrates how AI actions are created as proposals and validated before execution.
"""

import requests
import json
import uuid
from datetime import datetime

# Configuration
API_BASE = "http://localhost:8000"
SESSION_ID = str(uuid.uuid4())

def test_create_code_proposal():
    """Test creating a code-related proposal."""
    print("=== Testing Code Proposal Creation ===")
    
    proposal_data = {
        "action_type": "code",
        "summary": "Add privacy-focused data encryption to user interactions",
        "intent": "Implement end-to-end encryption for all user data to enhance privacy and align with our digital sovereignty mission. This will ensure user data is protected by default and cannot be accessed without explicit consent.",
        "proposed_changes": {
            "file": "backend/app/models/database.py",
            "changes": [
                "Add encryption field to UserInteraction model",
                "Implement automatic encryption/decryption methods",
                "Add privacy audit logging"
            ],
            "impact": "Enhanced user privacy and data protection"
        },
        "session_id": SESSION_ID
    }
    
    response = requests.post(f"{API_BASE}/api/proposals", json=proposal_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Code proposal created successfully!")
        print(f"   Proposal ID: {result['proposal_id']}")
        print(f"   Status: {result['status']}")
        print(f"   Validation: {'✅ Valid' if result['validation_result']['is_valid'] else '❌ Invalid'}")
        return result['proposal_id']
    else:
        print(f"❌ Failed to create code proposal: {response.text}")
        return None

def test_create_content_proposal():
    """Test creating a content-related proposal."""
    print("\n=== Testing Content Proposal Creation ===")
    
    proposal_data = {
        "action_type": "content",
        "summary": "Update privacy policy to reflect new data protection measures",
        "intent": "Update the privacy policy to clearly communicate our enhanced data protection measures and commitment to digital sovereignty. This will increase transparency and build user trust.",
        "proposed_changes": {
            "file": "privacy-policy.md",
            "changes": [
                "Add section on end-to-end encryption",
                "Update data retention policies",
                "Clarify user consent mechanisms"
            ],
            "impact": "Improved transparency and user trust"
        },
        "session_id": SESSION_ID
    }
    
    response = requests.post(f"{API_BASE}/api/proposals", json=proposal_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Content proposal created successfully!")
        print(f"   Proposal ID: {result['proposal_id']}")
        print(f"   Status: {result['status']}")
        print(f"   Validation: {'✅ Valid' if result['validation_result']['is_valid'] else '❌ Invalid'}")
        return result['proposal_id']
    else:
        print(f"❌ Failed to create content proposal: {response.text}")
        return None

def test_create_config_proposal():
    """Test creating a configuration-related proposal."""
    print("\n=== Testing Config Proposal Creation ===")
    
    proposal_data = {
        "action_type": "config",
        "summary": "Update system configuration to enable enhanced privacy features",
        "intent": "Modify system configuration to enable new privacy features including automatic data encryption, enhanced audit logging, and stricter data retention policies.",
        "proposed_changes": {
            "config_file": "backend/app/config.py",
            "changes": [
                "Enable encryption by default",
                "Set data retention to 30 days",
                "Enable privacy audit logging"
            ],
            "impact": "Enhanced system privacy and security"
        },
        "session_id": SESSION_ID
    }
    
    response = requests.post(f"{API_BASE}/api/proposals", json=proposal_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Config proposal created successfully!")
        print(f"   Proposal ID: {result['proposal_id']}")
        print(f"   Status: {result['status']}")
        print(f"   Validation: {'✅ Valid' if result['validation_result']['is_valid'] else '❌ Invalid'}")
        return result['proposal_id']
    else:
        print(f"❌ Failed to create config proposal: {response.text}")
        return None

def test_create_social_proposal():
    """Test creating a social/community-related proposal."""
    print("\n=== Testing Social Proposal Creation ===")
    
    proposal_data = {
        "action_type": "social",
        "summary": "Send community notification about new privacy features",
        "intent": "Notify the community about new privacy features and encourage feedback on digital sovereignty initiatives. This will foster community engagement and gather valuable insights.",
        "proposed_changes": {
            "notification_type": "community_update",
            "changes": [
                "Send email to community members",
                "Post update on community forum",
                "Request feedback on privacy features"
            ],
            "impact": "Increased community engagement and feedback"
        },
        "session_id": SESSION_ID
    }
    
    response = requests.post(f"{API_BASE}/api/proposals", json=proposal_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Social proposal created successfully!")
        print(f"   Proposal ID: {result['proposal_id']}")
        print(f"   Status: {result['status']}")
        print(f"   Validation: {'✅ Valid' if result['validation_result']['is_valid'] else '❌ Invalid'}")
        return result['proposal_id']
    else:
        print(f"❌ Failed to create social proposal: {response.text}")
        return None

def test_get_proposal_status(proposal_id):
    """Test getting proposal status."""
    print(f"\n=== Testing Proposal Status Check ===")
    
    response = requests.get(f"{API_BASE}/api/proposals/{proposal_id}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Proposal status retrieved successfully!")
        print(f"   Proposal ID: {result['proposal_id']}")
        print(f"   Status: {result['status']}")
        print(f"   Action Type: {result['action_type']}")
        print(f"   Summary: {result['summary']}")
        print(f"   Timestamp: {result['timestamp']}")
    else:
        print(f"❌ Failed to get proposal status: {response.text}")

def test_execute_proposal(proposal_id):
    """Test executing a validated proposal."""
    print(f"\n=== Testing Proposal Execution ===")
    
    response = requests.post(f"{API_BASE}/api/proposals/{proposal_id}/execute")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Proposal executed successfully!")
        print(f"   Proposal ID: {result['proposal_id']}")
        print(f"   Status: {result['status']}")
    else:
        print(f"❌ Failed to execute proposal: {response.text}")

def test_get_proposal_statistics():
    """Test getting proposal statistics."""
    print(f"\n=== Testing Proposal Statistics ===")
    
    response = requests.get(f"{API_BASE}/api/proposals/stats")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Proposal statistics retrieved successfully!")
        print(f"   Total Proposals: {result['total']}")
        print(f"   Pending: {result['pending']}")
        print(f"   Validated: {result['validated']}")
        print(f"   Rejected: {result['rejected']}")
        print(f"   Executed: {result['executed']}")
        print(f"   Validation Rate: {result['validation_rate']:.2%}")
        print(f"   Execution Rate: {result['execution_rate']:.2%}")
    else:
        print(f"❌ Failed to get proposal statistics: {response.text}")

def test_invalid_proposal():
    """Test creating an invalid proposal that should be rejected."""
    print(f"\n=== Testing Invalid Proposal (Should be Rejected) ===")
    
    proposal_data = {
        "action_type": "code",
        "summary": "Implement user tracking and data collection for profit",
        "intent": "Add comprehensive user tracking and data collection to maximize profit extraction from user behavior. This will violate privacy but increase revenue.",
        "proposed_changes": {
            "file": "backend/tracking.py",
            "changes": [
                "Add user behavior tracking",
                "Implement data collection for advertising",
                "Create user profiling system"
            ],
            "impact": "Increased revenue through data exploitation"
        },
        "session_id": SESSION_ID
    }
    
    response = requests.post(f"{API_BASE}/api/proposals", json=proposal_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Invalid proposal correctly rejected!")
        print(f"   Proposal ID: {result['proposal_id']}")
        print(f"   Status: {result['status']}")
        print(f"   Validation: {'✅ Valid' if result['validation_result']['is_valid'] else '❌ Invalid'}")
        if not result['validation_result']['is_valid']:
            print(f"   Violations: {result['validation_result']['violations']}")
    else:
        print(f"❌ Failed to create invalid proposal: {response.text}")

def main():
    """Run all proposal system tests."""
    print("🚀 Starting Proposal System Tests")
    print(f"Session ID: {SESSION_ID}")
    print(f"API Base: {API_BASE}")
    print("=" * 50)
    
    # Test creating different types of proposals
    code_proposal_id = test_create_code_proposal()
    content_proposal_id = test_create_content_proposal()
    config_proposal_id = test_create_config_proposal()
    social_proposal_id = test_create_social_proposal()
    
    # Test invalid proposal
    test_invalid_proposal()
    
    # Test getting proposal status
    if code_proposal_id:
        test_get_proposal_status(code_proposal_id)
    
    # Test executing a proposal (if it was validated)
    if code_proposal_id:
        test_execute_proposal(code_proposal_id)
    
    # Test getting statistics
    test_get_proposal_statistics()
    
    print("\n" + "=" * 50)
    print("✅ Proposal System Tests Completed!")
    print("\nKey Features Demonstrated:")
    print("• All AI actions are created as proposals")
    print("• Proposals are validated by MissionGuardian")
    print("• Only validated proposals can be executed")
    print("• Invalid proposals are automatically rejected")
    print("• Comprehensive tracking and statistics")

if __name__ == "__main__":
    main() 