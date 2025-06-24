from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Application
    app_name: str = "HumaneStack Self-Evolving System"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Database
    database_url: str = "sqlite:///./humane_stack.db"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Privacy & Data
    data_retention_days: int = 30  # Auto-delete data after 30 days
    encryption_key: str = "your-encryption-key-change-in-production"
    
    # AI & Learning
    ai_model_path: Optional[str] = None  # Path to local AI model
    clustering_threshold: float = 0.7  # Similarity threshold for clustering
    consensus_threshold: float = 0.75  # Minimum consensus for changes
    
    # Community
    min_community_size: int = 10  # Minimum users for consensus
    feedback_analysis_interval: int = 3600  # Analyze feedback every hour
    
    # System Control
    owner_email: str = "owner@palchat.org"  # System owner contact
    emergency_override_enabled: bool = True
    
    # Mission Guardian
    vision_alignment_threshold: float = 0.3  # Minimum alignment with vision (lowered from 0.8)
    values_compliance_threshold: float = 0.4  # Minimum compliance with values (lowered from 0.9)
    
    # Allowed Origins
    allowed_origins: str = "http://localhost:4321,https://palchat.org"
    
    class Config:
        env_file = ".env"

settings = Settings()
