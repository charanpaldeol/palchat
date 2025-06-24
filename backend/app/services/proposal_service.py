import uuid
import json
from typing import Dict, List, Optional, Any
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.database import Proposal
from app.services.mission_guardian import MissionGuardian
from app.config import settings

class ProposalService:
    """
    Manages the proposal system for AI actions.
    All AI actions must be created as proposals and validated before execution.
    """
    
    def __init__(self):
        self.mission_guardian = MissionGuardian()
    
    def create_proposal(
        self,
        db: Session,
        action_type: str,
        summary: str,
        intent: str,
        proposed_changes: Dict[str, Any],
        created_by: str = "ai_agent",
        session_id: Optional[str] = None
    ) -> Proposal:
        """
        Create a new proposal for an AI action.
        """
        proposal_id = str(uuid.uuid4())
        
        proposal = Proposal(
            proposal_id=proposal_id,
            action_type=action_type,
            summary=summary,
            intent=intent,
            proposed_changes=proposed_changes,
            created_by=created_by,
            session_id=session_id,
            status="pending"
        )
        
        # Validate the proposal immediately
        validation_result = self.validate_proposal(proposal)
        proposal.validation_result = validation_result
        
        # Update status based on validation
        if validation_result["is_valid"]:
            proposal.status = "validated"
        else:
            proposal.status = "rejected"
        
        db.add(proposal)
        db.commit()
        db.refresh(proposal)
        
        return proposal
    
    def validate_proposal(self, proposal: Proposal) -> Dict[str, Any]:
        """
        Validate a proposal using MissionGuardian.
        """
        # Determine validation type based on who created the proposal
        base_validation_type = f"proposal_{proposal.action_type}"
        if proposal.created_by == "ai_system_scan":
            base_validation_type = f"ai_system_scan_{proposal.action_type}"
        
        # Validate the summary
        summary_validation = self.mission_guardian.validate_content(
            proposal.summary, 
            f"{base_validation_type}_summary"
        )
        
        # Validate the intent
        intent_validation = self.mission_guardian.validate_content(
            proposal.intent, 
            f"{base_validation_type}_intent"
        )
        
        # Validate the proposed changes (convert to string for validation)
        changes_str = json.dumps(proposal.proposed_changes, indent=2)
        changes_validation = self.mission_guardian.validate_content(
            changes_str, 
            f"{base_validation_type}_changes"
        )
        
        # Overall validation result
        all_validations = [summary_validation, intent_validation, changes_validation]
        
        # For AI system scan proposals, be more lenient - pass if ANY validation passes
        if proposal.created_by == "ai_system_scan":
            overall_valid = any(v["is_valid"] for v in all_validations)
        else:
            overall_valid = all(v["is_valid"] for v in all_validations)
        
        validation_result = {
            "is_valid": overall_valid,
            "summary_validation": summary_validation,
            "intent_validation": intent_validation,
            "changes_validation": changes_validation,
            "overall_alignment": {
                "vision": sum(v["vision_alignment"] for v in all_validations) / len(all_validations),
                "mission": sum(v["mission_alignment"] for v in all_validations) / len(all_validations),
                "values": sum(v["overall_values_score"] for v in all_validations) / len(all_validations)
            },
            "recommendations": self._combine_recommendations(all_validations)
        }
        
        return validation_result
    
    def _combine_recommendations(self, validations: List[Dict[str, Any]]) -> List[str]:
        """
        Combine recommendations from multiple validations.
        """
        all_recommendations = []
        for validation in validations:
            if "recommendations" in validation:
                all_recommendations.extend(validation["recommendations"])
        
        # Remove duplicates while preserving order
        seen = set()
        unique_recommendations = []
        for rec in all_recommendations:
            if rec not in seen:
                seen.add(rec)
                unique_recommendations.append(rec)
        
        return unique_recommendations
    
    def get_validated_proposals(self, db: Session, action_type: Optional[str] = None) -> List[Proposal]:
        """
        Get all validated proposals, optionally filtered by action type.
        """
        query = db.query(Proposal).filter(Proposal.status == "validated")
        
        if action_type:
            query = query.filter(Proposal.action_type == action_type)
        
        return query.order_by(Proposal.timestamp.desc()).all()
    
    def get_all_proposals(self, db: Session, status: Optional[str] = None, action_type: Optional[str] = None) -> List[Proposal]:
        """
        Get all proposals with optional filtering by status and action type.
        """
        query = db.query(Proposal)
        
        if status:
            query = query.filter(Proposal.status == status)
        
        if action_type:
            query = query.filter(Proposal.action_type == action_type)
        
        return query.order_by(Proposal.timestamp.desc()).all()
    
    def get_proposal(self, db: Session, proposal_id: str) -> Optional[Proposal]:
        """
        Get a specific proposal by ID.
        """
        return db.query(Proposal).filter(Proposal.proposal_id == proposal_id).first()
    
    def execute_proposal(self, db: Session, proposal_id: str) -> Dict[str, Any]:
        """
        Execute a validated proposal.
        """
        proposal = self.get_proposal(db, proposal_id)
        
        if not proposal:
            return {"success": False, "error": "Proposal not found"}
        
        if proposal.status != "validated":
            return {"success": False, "error": f"Proposal status is {proposal.status}, must be 'validated'"}
        
        try:
            # Execute the proposed changes based on action type
            execution_result = self._execute_changes(proposal)
            
            # Update proposal status
            proposal.status = "executed"
            db.commit()
            
            return {
                "success": True,
                "proposal_id": proposal_id,
                "execution_result": execution_result
            }
            
        except Exception as e:
            return {"success": False, "error": f"Execution failed: {str(e)}"}
    
    def _execute_changes(self, proposal: Proposal) -> Dict[str, Any]:
        """
        Execute the proposed changes based on action type.
        """
        action_type = proposal.action_type
        changes = proposal.proposed_changes
        
        if action_type == "code":
            return self._execute_code_changes(changes)
        elif action_type == "content":
            return self._execute_content_changes(changes)
        elif action_type == "config":
            return self._execute_config_changes(changes)
        elif action_type == "social":
            return self._execute_social_changes(changes)
        else:
            raise ValueError(f"Unknown action type: {action_type}")
    
    def _execute_code_changes(self, changes: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute code-related changes.
        """
        # This would integrate with actual code execution/editing
        # For now, return a placeholder
        return {
            "type": "code_execution",
            "status": "placeholder",
            "message": "Code execution would be implemented here"
        }
    
    def _execute_content_changes(self, changes: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute content-related changes.
        """
        # This would handle content updates, file modifications, etc.
        return {
            "type": "content_update",
            "status": "placeholder",
            "message": "Content changes would be implemented here"
        }
    
    def _execute_config_changes(self, changes: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute configuration changes.
        """
        # This would handle system configuration updates
        return {
            "type": "config_update",
            "status": "placeholder",
            "message": "Configuration changes would be implemented here"
        }
    
    def _execute_social_changes(self, changes: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute social/community-related changes.
        """
        # This would handle community interactions, notifications, etc.
        return {
            "type": "social_action",
            "status": "placeholder",
            "message": "Social actions would be implemented here"
        }
    
    def reject_proposal(self, db: Session, proposal_id: str, reason: str = "") -> Dict[str, Any]:
        """
        Reject a proposal.
        """
        proposal = self.get_proposal(db, proposal_id)
        
        if not proposal:
            return {"success": False, "error": "Proposal not found"}
        
        proposal.status = "rejected"
        if reason:
            # Store rejection reason in validation_result
            if not proposal.validation_result:
                proposal.validation_result = {}
            proposal.validation_result["rejection_reason"] = reason
        
        db.commit()
        
        return {"success": True, "proposal_id": proposal_id}
    
    def get_proposal_stats(self, db: Session) -> Dict[str, Any]:
        """
        Get statistics about proposals.
        """
        total = db.query(Proposal).count()
        pending = db.query(Proposal).filter(Proposal.status == "pending").count()
        validated = db.query(Proposal).filter(Proposal.status == "validated").count()
        rejected = db.query(Proposal).filter(Proposal.status == "rejected").count()
        executed = db.query(Proposal).filter(Proposal.status == "executed").count()
        
        return {
            "total": total,
            "pending": pending,
            "validated": validated,
            "rejected": rejected,
            "executed": executed,
            "validation_rate": validated / total if total > 0 else 0,
            "execution_rate": executed / validated if validated > 0 else 0
        } 