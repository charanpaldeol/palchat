from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from app.config import settings
import json

# Database setup
engine = create_engine(settings.database_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Database Models
class UserInteraction(Base):
    __tablename__ = "user_interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)  # Anonymous session identifier
    timestamp = Column(DateTime, default=datetime.utcnow)
    interaction_type = Column(String)  # 'chat', 'feedback', 'vote', etc.
    content = Column(Text)  # Encrypted content
    sentiment = Column(Float)  # -1 to 1 sentiment score
    topics = Column(JSON)  # Detected topics
    mission_alignment = Column(Float)  # 0 to 1 alignment score
    expires_at = Column(DateTime)  # Auto-delete timestamp
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set expiration date for privacy
        self.expires_at = datetime.utcnow() + timedelta(days=settings.data_retention_days)

class SystemDecision(Base):
    __tablename__ = "system_decisions"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    trigger = Column(Text)  # What triggered the decision
    options_considered = Column(JSON)  # All options evaluated
    community_feedback = Column(JSON)  # Feedback summary
    consensus_level = Column(Float)  # Percentage agreement
    mission_alignment = Column(JSON)  # Alignment scores
    implementation_plan = Column(Text)
    risk_assessment = Column(Text)
    status = Column(String)  # 'pending', 'approved', 'rejected', 'implemented'
    owner_notified = Column(Boolean, default=False)
    impact_metrics = Column(JSON)  # Post-implementation metrics

class CommunityVote(Base):
    __tablename__ = "community_votes"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(String, index=True)
    session_id = Column(String, index=True)  # Anonymous voter
    timestamp = Column(DateTime, default=datetime.utcnow)
    vote = Column(String)  # 'support', 'oppose', 'neutral'
    reasoning = Column(Text)  # Optional reasoning
    concerns = Column(JSON)  # Any concerns raised
    expires_at = Column(DateTime)  # Auto-delete timestamp
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.expires_at = datetime.utcnow() + timedelta(days=settings.data_retention_days)

class SystemEvolution(Base):
    __tablename__ = "system_evolution"
    
    id = Column(Integer, primary_key=True, index=True)
    evolution_id = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    change_type = Column(String)  # 'feature', 'content', 'ui', 'policy'
    description = Column(Text)
    rationale = Column(Text)
    community_impact = Column(JSON)
    success_metrics = Column(JSON)
    rollback_plan = Column(Text)
    implemented = Column(Boolean, default=False)
    success_score = Column(Float)  # Post-implementation success rating

class Proposal(Base):
    __tablename__ = "proposals"
    
    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    action_type = Column(String)  # 'code', 'content', 'config', 'social'
    summary = Column(Text)  # Brief summary of the proposed action
    intent = Column(Text)  # Detailed intent and reasoning
    proposed_changes = Column(JSON)  # Specific changes to be made
    validation_result = Column(JSON)  # MissionGuardian validation result
    status = Column(String)  # 'pending', 'validated', 'rejected', 'executed'
    created_by = Column(String)  # 'ai_agent', 'system', 'user'
    session_id = Column(String, index=True)  # Associated session if user-triggered
    expires_at = Column(DateTime)  # Auto-delete timestamp
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.expires_at = datetime.utcnow() + timedelta(days=settings.data_retention_days)

# Create tables
Base.metadata.create_all(bind=engine)
