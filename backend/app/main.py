from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from app.config import settings
from app.models.database import get_db, UserInteraction, SystemDecision, CommunityVote, SystemEvolution
from app.schemas.requests import ChatMessage, FeedbackSubmission, VoteSubmission, SystemOverride, MissionValidation
from app.schemas.responses import ChatResponse, FeedbackResponse, VoteResponse, SystemStatus, DecisionSummary, OverrideResponse
from app.services.mission_guardian import MissionGuardian
from app.services.ai_agent import AIAgent

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Self-evolving, human-centric digital system for digital sovereignty advocacy"
)

# Add CORS middleware
# Get allowed origins from environment variable, split by comma
allowed_origins = [origin.strip() for origin in settings.allowed_origins.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
mission_guardian = MissionGuardian()
ai_agent = AIAgent()
security = HTTPBearer()

# Root endpoint
@app.get("/")
async def root():
    """Welcome page for the HumaneStack Self-Evolving System."""
    return HTMLResponse(
        content="""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>HumaneStack Self-Evolving System</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <div class="container">
                <h1>Welcome to HumaneStack Self-Evolving System</h1>
                <p>A privacy-first, community-driven digital system for digital sovereignty advocacy</p>
                <p>Version: {settings.app_version}</p>
                <p>Status: autonomous_evolution_active</p>
                <p>Endpoints:</p>
                <ul>
                    <li><a href="/health">Health Check</a></li>
                    <li><a href="/docs">API Documentation</a></li>
                    <li><a href="/api/system/status">System Status</a></li>
                    <li><a href="/api/chat">Chat</a></li>
                    <li><a href="/api/feedback">Feedback</a></li>
                    <li><a href="/api/vote">Vote</a></li>
                </ul>
                <p>Mission:</p>
                <p>Building technology that serves humanity, not profit</p>
                <p>Values:</p>
                <ul>
                    <li>Digital Sovereignty</li>
                    <li>Privacy-First Design</li>
                    <li>Community Governance</li>
                    <li>Transparent Evolution</li>
                    <li>Human-Centric Technology</li>
                </ul>
            </div>
        </body>
        </html>
        """.format(settings=settings)
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.app_version,
        "system_status": "autonomous_evolution_active"
    }

# AI Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    db: Session = Depends(get_db)
):
    """Chat with the privacy-first AI agent about digital sovereignty."""
    try:
        # Process message with AI agent
        response_data = ai_agent.process_message(
            message.message,
            message.session_id,
            message.context
        )
        
        # Store interaction in database
        interaction = UserInteraction(
            session_id=message.session_id,
            interaction_type="chat",
            content=message.message,  # In production, this would be encrypted
            sentiment=0.0,  # Would be calculated by sentiment analysis
            topics=response_data["topics"],
            mission_alignment=response_data["mission_alignment"]
        )
        db.add(interaction)
        db.commit()
        
        return ChatResponse(
            message=response_data["message"],
            mission_alignment=response_data["mission_alignment"],
            suggested_actions=response_data["suggested_actions"],
            confidence=response_data["confidence"]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat message: {str(e)}"
        )

# Feedback submission endpoint
@app.post("/api/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    feedback: FeedbackSubmission,
    db: Session = Depends(get_db)
):
    """Submit feedback for system evolution."""
    try:
        # Validate feedback against mission
        validation = mission_guardian.validate_content(feedback.content, "feedback")
        
        # Store feedback in database
        interaction = UserInteraction(
            session_id=feedback.session_id,
            interaction_type="feedback",
            content=feedback.content,  # In production, this would be encrypted
            sentiment=0.0,  # Would be calculated by sentiment analysis
            topics=[feedback.feedback_type],
            mission_alignment=validation["overall_values_score"]
        )
        db.add(interaction)
        db.commit()
        
        # Generate feedback ID
        feedback_id = str(uuid.uuid4())
        
        return FeedbackResponse(
            feedback_id=feedback_id,
            status="received",
            estimated_impact="Will be analyzed for community consensus",
            next_steps=["Pattern analysis", "Community consultation", "Decision proposal"]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing feedback: {str(e)}"
        )

# Community voting endpoint
@app.post("/api/vote", response_model=VoteResponse)
async def submit_vote(
    vote: VoteSubmission,
    db: Session = Depends(get_db)
):
    """Submit a vote on a system decision."""
    try:
        # Check if decision exists
        decision = db.query(SystemDecision).filter(
            SystemDecision.decision_id == vote.decision_id
        ).first()
        
        if not decision:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Decision not found"
            )
        
        # Store vote in database
        vote_record = CommunityVote(
            decision_id=vote.decision_id,
            session_id=vote.session_id,
            vote=vote.vote,
            reasoning=vote.reasoning,
            concerns=vote.concerns or []
        )
        db.add(vote_record)
        db.commit()
        
        # Calculate current consensus
        all_votes = db.query(CommunityVote).filter(
            CommunityVote.decision_id == vote.decision_id
        ).all()
        
        support_votes = sum(1 for v in all_votes if v.vote == "support")
        total_votes = len(all_votes)
        consensus_level = support_votes / total_votes if total_votes > 0 else 0.0
        
        return VoteResponse(
            vote_id=str(uuid.uuid4()),
            decision_id=vote.decision_id,
            current_consensus=consensus_level,
            total_votes=total_votes,
            time_remaining=86400  # 24 hours in seconds
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing vote: {str(e)}"
        )

# System status endpoint
@app.get("/api/system/status", response_model=SystemStatus)
async def get_system_status(db: Session = Depends(get_db)):
    """Get current system status and metrics."""
    try:
        # Calculate community size (unique sessions in last 30 days)
        from datetime import timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        community_size = db.query(UserInteraction.session_id).filter(
            UserInteraction.timestamp >= thirty_days_ago
        ).distinct().count()
        
        # Count pending decisions
        pending_decisions = db.query(SystemDecision).filter(
            SystemDecision.status == "pending"
        ).count()
        
        # Get last evolution
        last_evolution = db.query(SystemEvolution).order_by(
            SystemEvolution.timestamp.desc()
        ).first()
        
        # Calculate overall mission alignment (average of recent interactions)
        recent_interactions = db.query(UserInteraction).filter(
            UserInteraction.timestamp >= thirty_days_ago
        ).all()
        
        if recent_interactions:
            mission_alignment_score = sum(i.mission_alignment for i in recent_interactions) / len(recent_interactions)
        else:
            mission_alignment_score = 1.0  # Default to perfect alignment if no interactions
        
        return SystemStatus(
            system_status="autonomous_evolution_active",
            autonomous_mode=True,
            pending_decisions=pending_decisions,
            community_size=community_size,
            last_evolution=last_evolution.timestamp if last_evolution else None,
            mission_alignment_score=mission_alignment_score
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting system status: {str(e)}"
        )

# Mission validation endpoint
@app.post("/api/mission/validate")
async def validate_mission_alignment(validation: MissionValidation):
    """Validate content against mission, vision, and values."""
    try:
        result = mission_guardian.validate_content(
            validation.content,
            validation.validation_type
        )
        
        return {
            "is_valid": result["is_valid"],
            "vision_alignment": result["vision_alignment"],
            "mission_alignment": result["mission_alignment"],
            "values_alignment": result["values_alignment"],
            "overall_values_score": result["overall_values_score"],
            "violations": result["violations"],
            "recommendations": result["recommendations"]
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error validating mission alignment: {str(e)}"
        )

# Owner override endpoint (protected)
@app.post("/api/system/override", response_model=OverrideResponse)
async def system_override(
    override: SystemOverride,
    db: Session = Depends(get_db)
):
    """Emergency override for system owner."""
    try:
        # In production, this would validate the owner token
        if override.owner_token != "owner-secret-token":  # Replace with proper authentication
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized override attempt"
            )
        
        # Execute override action
        if override.action == "stop":
            system_status = "autonomous_evolution_stopped"
        elif override.action == "rollback":
            system_status = "rolled_back_to_stable_state"
        elif override.action == "freeze":
            system_status = "frozen_no_changes"
        elif override.action == "reset":
            system_status = "reset_to_initial_state"
        elif override.action == "override":
            system_status = "manual_override_active"
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid override action"
            )
        
        return OverrideResponse(
            success=True,
            action_taken=override.action,
            system_status=system_status,
            timestamp=datetime.utcnow()
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing override: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
