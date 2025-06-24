#!/usr/bin/env python3
"""
Simple test script for the proposal system.
"""

import requests
import json
import uuid

API_BASE = "http://localhost:8000"
SESSION_ID = str(uuid.uuid4())

def test_proposal_creation():
    """Test creating a proposal."""
    print("Testing proposal creation...")
    
    proposal_data = {
        "action_type": "code",
        "summary": "Add privacy-focused data encryption",
        "intent": "Implement end-to-end encryption for user data to enhance privacy and align with digital sovereignty mission.",
        "proposed_changes": {
            "file": "backend/app/models/database.py",
            "changes": ["Add encryption field", "Implement encryption methods"],
            "impact": "Enhanced user privacy"
        },
        "session_id": SESSION_ID
    }
    
    response = requests.post(f"{API_BASE}/api/proposals", json=proposal_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Proposal created: {result['proposal_id']}")
        print(f"   Status: {result['status']}")
        print(f"   Valid: {result['validation_result']['is_valid']}")
        return result['proposal_id']
    else:
        print(f"❌ Failed: {response.text}")
        return None

def test_proposal_status(proposal_id):
    """Test getting proposal status."""
    if not proposal_id:
        return
    
    print(f"\nTesting proposal status for {proposal_id}...")
    
    response = requests.get(f"{API_BASE}/api/proposals/{proposal_id}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Status: {result['status']}")
        print(f"   Type: {result['action_type']}")
        print(f"   Summary: {result['summary']}")
    else:
        print(f"❌ Failed: {response.text}")

def test_proposal_statistics():
    """Test getting proposal statistics."""
    print("\nTesting proposal statistics...")
    
    response = requests.get(f"{API_BASE}/api/proposals/stats")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Statistics:")
        print(f"   Total: {result['total']}")
        print(f"   Validated: {result['validated']}")
        print(f"   Rejected: {result['rejected']}")
        print(f"   Executed: {result['executed']}")
    else:
        print(f"❌ Failed: {response.text}")

def main():
    print("🚀 Testing Proposal System")
    print(f"Session: {SESSION_ID}")
    
    # Test proposal creation
    proposal_id = test_proposal_creation()
    
    # Test status check
    test_proposal_status(proposal_id)
    
    # Test statistics
    test_proposal_statistics()
    
    print("\n✅ Tests completed!")

if __name__ == "__main__":
    main() 