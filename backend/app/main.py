from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import subprocess

from app.config import settings
from app.models.database import get_db, UserInteraction, SystemDecision, CommunityVote, SystemEvolution, SavedNote
from app.schemas.requests import SaveTextRequest, FeedbackSubmission, VoteSubmission, SystemOverride, MissionValidation, CreateProposalRequest, ExecuteProposalRequest, RejectProposalRequest
from app.schemas.responses import SaveTextResponse, FeedbackResponse, VoteResponse, SystemStatus, DecisionSummary, OverrideResponse, ProposalResponse, ProposalStatusResponse, ProposalStatisticsResponse, ProposalListResponse
from app.services.mission_guardian import MissionGuardian
from app.services.ai_agent import AIAgent

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Self-evolving, human-centric digital system for digital sovereignty advocacy"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://palchat.org", "https://www.palchat.org", "http://localhost:4322"],
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

# Save text endpoint (store a few words in database)
@app.post("/api/saved-text", response_model=SaveTextResponse)
async def save_text(
    request: SaveTextRequest,
    db: Session = Depends(get_db)
):
    """Save text from the website to the database."""
    try:
        note = SavedNote(content=request.content.strip())
        db.add(note)
        db.commit()
        db.refresh(note)
        return SaveTextResponse(
            success=True,
            message="Saved successfully.",
            id=note.id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving text: {str(e)}"
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
            success=True,
            message="Feedback received. It will be analyzed for community consensus.",
            feedback_id=feedback_id
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

# Proposal endpoints
@app.post("/api/proposals", response_model=ProposalResponse)
async def create_proposal(
    request: CreateProposalRequest,
    db: Session = Depends(get_db)
):
    """Create a new proposal for an AI action."""
    try:
        # Route to appropriate proposal creation method based on action type
        if request.action_type == "code":
            result = ai_agent.create_code_proposal(
                db=db,
                summary=request.summary,
                intent=request.intent,
                proposed_changes=request.proposed_changes,
                session_id=request.session_id
            )
        elif request.action_type == "content":
            result = ai_agent.create_content_proposal(
                db=db,
                summary=request.summary,
                intent=request.intent,
                proposed_changes=request.proposed_changes,
                session_id=request.session_id
            )
        elif request.action_type == "config":
            result = ai_agent.create_config_proposal(
                db=db,
                summary=request.summary,
                intent=request.intent,
                proposed_changes=request.proposed_changes,
                session_id=request.session_id
            )
        elif request.action_type == "social":
            result = ai_agent.create_social_proposal(
                db=db,
                summary=request.summary,
                intent=request.intent,
                proposed_changes=request.proposed_changes,
                session_id=request.session_id
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid action type: {request.action_type}"
            )
        
        if result["success"]:
            return ProposalResponse(
                success=True,
                proposal_id=result["proposal_id"],
                status=result["status"],
                validation_result=result["validation_result"]
            )
        else:
            return ProposalResponse(
                success=False,
                error=result["error"]
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating proposal: {str(e)}"
        )

@app.get("/api/proposals/stats", response_model=ProposalStatisticsResponse)
async def get_proposal_statistics(db: Session = Depends(get_db)):
    """Get statistics about all proposals."""
    try:
        stats = ai_agent.get_proposal_statistics(db)
        
        return ProposalStatisticsResponse(
            total=stats["total"],
            pending=stats["pending"],
            validated=stats["validated"],
            rejected=stats["rejected"],
            executed=stats["executed"],
            validation_rate=stats["validation_rate"],
            execution_rate=stats["execution_rate"]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting proposal statistics: {str(e)}"
        )

@app.post("/api/system/scan", response_model=Dict[str, Any])
async def perform_system_scan(db: Session = Depends(get_db)):
    """Perform a comprehensive system scan and generate prioritized proposals."""
    try:
        result = ai_agent.perform_system_scan(db)
        
        if result["success"]:
            return {
                "success": True,
                "message": f"System scan completed successfully. {result['scan_summary']['proposals_created']} proposals created.",
                "scan_summary": result["scan_summary"],
                "proposals": result["proposals"]
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result["error"]
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing system scan: {str(e)}"
        )

@app.get("/api/proposals/{proposal_id}", response_model=ProposalStatusResponse)
async def get_proposal_status(
    proposal_id: str,
    db: Session = Depends(get_db)
):
    """Get the status of a specific proposal."""
    try:
        result = ai_agent.get_proposal_status(db, proposal_id)
        
        if result["success"]:
            return ProposalStatusResponse(
                success=True,
                proposal_id=result["proposal_id"],
                status=result["status"],
                action_type=result["action_type"],
                summary=result["summary"],
                validation_result=result["validation_result"],
                timestamp=result["timestamp"]
            )
        else:
            return ProposalStatusResponse(
                success=False,
                proposal_id=proposal_id,
                status="",
                action_type="",
                summary="",
                timestamp="",
                error=result["error"]
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting proposal status: {str(e)}"
        )

@app.post("/api/proposals/{proposal_id}/execute", response_model=ProposalResponse)
async def execute_proposal(
    proposal_id: str,
    db: Session = Depends(get_db)
):
    """Execute a validated proposal."""
    try:
        result = ai_agent.execute_validated_proposal(db, proposal_id)
        
        if result["success"]:
            return ProposalResponse(
                success=True,
                proposal_id=result["proposal_id"],
                status="executed"
            )
        else:
            return ProposalResponse(
                success=False,
                error=result["error"]
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing proposal: {str(e)}"
        )

@app.post("/api/proposals/{proposal_id}/reject", response_model=ProposalResponse)
async def reject_proposal(
    proposal_id: str,
    request: RejectProposalRequest,
    db: Session = Depends(get_db)
):
    """Reject a proposal."""
    try:
        result = ai_agent.proposal_service.reject_proposal(db, proposal_id, request.reason or "")
        
        if result["success"]:
            return ProposalResponse(
                success=True,
                proposal_id=result["proposal_id"],
                status="rejected"
            )
        else:
            return ProposalResponse(
                success=False,
                error=result["error"]
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error rejecting proposal: {str(e)}"
        )

@app.get("/api/proposals", response_model=ProposalListResponse)
async def get_all_proposals(
    status: Optional[str] = Query(None, description="Filter by status"),
    action_type: Optional[str] = Query(None, description="Filter by action type"),
    db: Session = Depends(get_db)
):
    """Get all proposals with optional filtering."""
    try:
        proposals = ai_agent.get_all_proposals(db, status=status, action_type=action_type)
        
        return ProposalListResponse(
            proposals=proposals,
            total=len(proposals),
            page=1,
            per_page=len(proposals)
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting proposals: {str(e)}"
        )

@app.get("/api/version")
def get_version():
    """Get the current code version running in production."""
    try:
        commit = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode("utf-8").strip()
        return {"commit": commit, "version": settings.app_version}
    except Exception as e:
        return {"commit": "unknown", "version": settings.app_version, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
