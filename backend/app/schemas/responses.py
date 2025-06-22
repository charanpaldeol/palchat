from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ChatResponse(BaseModel):
    message: str = Field(..., description="AI response message")
    mission_alignment: float = Field(..., ge=0, le=1, description="Alignment with mission (0-1)")
    suggested_actions: Optional[List[str]] = Field(default=None, description="Suggested next actions")
    confidence: float = Field(..., ge=0, le=1, description="AI confidence in response")

class FeedbackResponse(BaseModel):
    feedback_id: str = Field(..., description="Unique feedback identifier")
    status: str = Field(..., description="Processing status")
    estimated_impact: Optional[str] = Field(default=None, description="Estimated community impact")
    next_steps: Optional[List[str]] = Field(default=None, description="Next steps for processing")

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
