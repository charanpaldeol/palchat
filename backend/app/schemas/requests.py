from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ChatMessage(BaseModel):
    session_id: str = Field(..., description="Anonymous session identifier")
    message: str = Field(..., min_length=1, max_length=1000, description="User message")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Additional context")

class FeedbackSubmission(BaseModel):
    session_id: str = Field(..., description="Anonymous session identifier")
    feedback_type: str = Field(..., description="Type of feedback")
    content: str = Field(..., min_length=1, max_length=2000, description="Feedback content")
    urgency: Optional[int] = Field(default=1, ge=1, le=5, description="Urgency level 1-5")
    category: Optional[str] = Field(default=None, description="Feedback category")

class VoteSubmission(BaseModel):
    session_id: str = Field(..., description="Anonymous session identifier")
    decision_id: str = Field(..., description="ID of the decision being voted on")
    vote: str = Field(..., pattern="^(support|oppose|neutral)$", description="Vote choice")
    reasoning: Optional[str] = Field(default=None, max_length=500, description="Optional reasoning")
    concerns: Optional[List[str]] = Field(default=None, description="Any concerns")

class SystemOverride(BaseModel):
    owner_token: str = Field(..., description="Owner authentication token")
    action: str = Field(..., pattern="^(stop|rollback|freeze|reset|override)$", description="Override action")
    reason: str = Field(..., min_length=1, max_length=500, description="Reason for override")
    target_decision_id: Optional[str] = Field(default=None, description="Specific decision to override")

class MissionValidation(BaseModel):
    content: str = Field(..., description="Content to validate")
    validation_type: str = Field(..., pattern="^(vision|mission|values|decision)$", description="Type of validation")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Additional context")

class CreateProposalRequest(BaseModel):
    action_type: str = Field(..., description="Type of action: 'code', 'content', 'config', 'social'")
    summary: str = Field(..., description="Brief summary of the proposed action")
    intent: str = Field(..., description="Detailed intent and reasoning")
    proposed_changes: Dict[str, Any] = Field(..., description="Specific changes to be made")
    session_id: Optional[str] = Field(default=None, description="Associated session if user-triggered")

class ExecuteProposalRequest(BaseModel):
    proposal_id: str = Field(..., description="ID of the proposal to execute")

class RejectProposalRequest(BaseModel):
    proposal_id: str = Field(..., description="ID of the proposal to reject")
    reason: Optional[str] = Field(default=None, description="Reason for rejection")
