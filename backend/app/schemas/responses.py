from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ChatResponse(BaseModel):
    message: str = Field(..., description="AI response message")
    mission_alignment: float = Field(..., ge=0, le=1, description="Alignment with mission (0-1)")
    suggested_actions: Optional[List[str]] = Field(default=None, description="Suggested next actions")
    confidence: float = Field(..., ge=0, le=1, description="AI confidence in response")
    topics: Optional[List[str]] = Field(default=None, description="Detected topics")
    intent: Optional[str] = Field(default=None, description="Detected intent")

class FeedbackResponse(BaseModel):
    success: bool = Field(..., description="Whether feedback was submitted successfully")
    message: str = Field(..., description="Response message")
    feedback_id: Optional[str] = Field(default=None, description="Generated feedback ID")

class ValidationResponse(BaseModel):
    is_valid: bool = Field(..., description="Whether content passes validation")
    vision_alignment: float = Field(..., ge=0, le=1, description="Alignment with vision (0-1)")
    mission_alignment: float = Field(..., ge=0, le=1, description="Alignment with mission (0-1)")
    values_alignment: Dict[str, float] = Field(..., description="Alignment with each value")
    overall_values_score: float = Field(..., ge=0, le=1, description="Overall values alignment")
    violations: List[str] = Field(default_factory=list, description="Any violations found")
    recommendations: List[str] = Field(default_factory=list, description="Recommendations for improvement")

class ProposalResponse(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    proposal_id: Optional[str] = Field(default=None, description="Proposal ID")
    status: Optional[str] = Field(default=None, description="Proposal status")
    validation_result: Optional[Dict[str, Any]] = Field(default=None, description="Validation result")
    error: Optional[str] = Field(default=None, description="Error message if operation failed")

class ProposalStatusResponse(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    proposal_id: str = Field(..., description="Proposal ID")
    status: str = Field(..., description="Proposal status")
    action_type: str = Field(..., description="Type of action")
    summary: str = Field(..., description="Proposal summary")
    validation_result: Optional[Dict[str, Any]] = Field(default=None, description="Validation result")
    timestamp: str = Field(..., description="Proposal timestamp")
    error: Optional[str] = Field(default=None, description="Error message if operation failed")

class ProposalStatisticsResponse(BaseModel):
    total: int = Field(..., description="Total number of proposals")
    pending: int = Field(..., description="Number of pending proposals")
    validated: int = Field(..., description="Number of validated proposals")
    rejected: int = Field(..., description="Number of rejected proposals")
    executed: int = Field(..., description="Number of executed proposals")
    validation_rate: float = Field(..., description="Rate of validation success")
    execution_rate: float = Field(..., description="Rate of execution success")

class ProposalListResponse(BaseModel):
    proposals: List[Dict[str, Any]] = Field(..., description="List of proposals")
    total: int = Field(..., description="Total number of proposals")
    page: int = Field(..., description="Current page number")
    per_page: int = Field(..., description="Proposals per page")

class VoteResponse(BaseModel):
    vote_id: str = Field(..., description="Unique vote identifier")
    decision_id: str = Field(..., description="Decision being voted on")
    current_consensus: float = Field(..., ge=0, le=1, description="Current consensus level")
    total_votes: int = Field(..., ge=0, description="Total votes cast")
    time_remaining: Optional[int] = Field(default=None, description="Time remaining for voting (seconds)")

class SystemStatus(BaseModel):
    system_status: str = Field(..., description="Current system status")
    autonomous_mode: bool = Field(..., description="Whether autonomous evolution is active")
    pending_decisions: int = Field(..., ge=0, description="Number of pending decisions")
    community_size: int = Field(..., ge=0, description="Active community size")
    last_evolution: Optional[datetime] = Field(default=None, description="Last system evolution")
    mission_alignment_score: float = Field(..., ge=0, le=1, description="Overall mission alignment")

class DecisionSummary(BaseModel):
    decision_id: str = Field(..., description="Unique decision identifier")
    trigger: str = Field(..., description="What triggered the decision")
    status: str = Field(..., description="Decision status")
    consensus_level: float = Field(..., ge=0, le=1, description="Current consensus level")
    mission_alignment: Dict[str, float] = Field(..., description="Alignment scores")
    community_impact: Optional[str] = Field(default=None, description="Estimated community impact")
    implementation_timeline: Optional[str] = Field(default=None, description="Implementation timeline")

class OverrideResponse(BaseModel):
    success: bool = Field(..., description="Whether override was successful")
    action_taken: str = Field(..., description="Action that was taken")
    system_status: str = Field(..., description="New system status")
    timestamp: datetime = Field(..., description="When override was executed")
