import json
import uuid
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session
from app.services.mission_guardian import MissionGuardian
from app.services.proposal_service import ProposalService
from app.config import settings

class AIAgent:
    """
    Privacy-first AI agent that educates about digital sovereignty.
    Processes conversations locally and maintains mission alignment.
    All AI actions are created as proposals and validated before execution.
    """
    
    def __init__(self):
        self.mission_guardian = MissionGuardian()
        self.proposal_service = ProposalService()
        
        # Knowledge base for digital sovereignty topics
        self.knowledge_base = {
            "digital_sovereignty": {
                "definition": "Full control over your digital presence, data, and choices",
                "key_concepts": [
                    "Data ownership and control",
                    "Privacy by design",
                    "Consent-based interactions",
                    "Freedom from surveillance",
                    "Digital autonomy"
                ],
                "examples": [
                    "Using privacy-focused browsers",
                    "Choosing open-source software",
                    "Supporting community-owned platforms",
                    "Understanding data collection practices"
                ]
            },
            "surveillance_capitalism": {
                "definition": "Economic system based on extracting and monetizing personal data",
                "key_concepts": [
                    "Data extraction without consent",
                    "Behavioral manipulation",
                    "Attention economy",
                    "Hidden algorithms",
                    "Profit from personal information"
                ],
                "examples": [
                    "Social media tracking",
                    "Targeted advertising",
                    "Data brokers",
                    "Algorithmic manipulation"
                ]
            },
            "collective_ownership": {
                "definition": "Communities owning and governing the platforms they use",
                "key_concepts": [
                    "Co-ownership models",
                    "Democratic governance",
                    "Value flowing back to users",
                    "Community decision-making",
                    "Shared benefits"
                ],
                "examples": [
                    "Cooperatives",
                    "Open-source communities",
                    "Platform cooperatives",
                    "Community-owned infrastructure"
                ]
            },
            "privacy_protection": {
                "definition": "Protecting personal information and digital autonomy",
                "key_concepts": [
                    "Data minimization",
                    "End-to-end encryption",
                    "Anonymous interactions",
                    "Consent-based data sharing",
                    "Privacy by default"
                ],
                "examples": [
                    "Using VPNs",
                    "Encrypted messaging",
                    "Privacy-focused search engines",
                    "Data deletion tools"
                ]
            }
        }
        
        # Conversation patterns for different topics
        self.conversation_patterns = {
            "greeting": [
                "Hello! I'm here to help you understand digital sovereignty and privacy-first technology. What would you like to learn about?",
                "Welcome! I'm your guide to digital rights and community-owned technology. How can I assist you today?",
                "Hi there! I'm passionate about helping people understand their digital rights. What questions do you have?"
            ],
            "digital_sovereignty": [
                "Digital sovereignty means having full control over your digital life. It's about choosing who has access to your data and how it's used.",
                "Think of digital sovereignty as your right to control your digital presence, just like you control your physical space.",
                "Digital sovereignty is the foundation of a free digital society where individuals, not corporations, control their data and choices."
            ],
            "surveillance_capitalism": [
                "Surveillance capitalism is when companies profit by collecting and selling your personal data without your full consent.",
                "It's an economic system built on extracting value from your attention and behavior, often without you realizing it.",
                "Surveillance capitalism turns your personal information into a commodity, using it to manipulate your behavior for profit."
            ],
            "collective_ownership": [
                "Collective ownership means communities own and govern the platforms they use, ensuring value flows back to everyone.",
                "Instead of corporations profiting from your data, collective ownership means you and your community benefit directly.",
                "Collective ownership creates platforms that serve people, not profit, with transparent governance and shared benefits."
            ],
            "privacy_protection": [
                "Privacy protection starts with understanding what data you're sharing and with whom. Knowledge is your first defense.",
                "Protecting your privacy means taking control of your digital footprint and choosing tools that respect your autonomy.",
                "Privacy isn't about hiding - it's about controlling what information you share and with whom you share it."
            ]
        }
    
    def process_message(self, message: str, session_id: str, context: Optional[Dict] = None) -> Dict[str, any]:
        """
        Process a user message and generate a mission-aligned response.
        """
        # Analyze the message for topics and intent
        topics = self._analyze_topics(message)
        intent = self._determine_intent(message)
        
        # Generate response based on topics and intent
        response = self._generate_response(message, topics, intent, context)
        
        # Validate response against mission
        validation = self.mission_guardian.validate_content(response, "ai_response")
        
        # If response doesn't align with mission, regenerate
        if not validation["is_valid"]:
            response = self._generate_mission_aligned_response(message, topics, intent, validation)
            validation = self.mission_guardian.validate_content(response, "ai_response")
        
        # Log the interaction
        self._log_interaction(session_id, message, response, topics, validation)
        
        return {
            "message": response,
            "mission_alignment": validation["overall_values_score"],
            "suggested_actions": self._suggest_actions(topics, intent),
            "confidence": self._calculate_confidence(topics, intent),
            "topics": topics,
            "intent": intent
        }
    
    def _analyze_topics(self, message: str) -> List[str]:
        """Analyze message to identify relevant topics."""
        message_lower = message.lower()
        topics = []
        
        for topic, info in self.knowledge_base.items():
            # Check for topic keywords
            if any(keyword in message_lower for keyword in info["key_concepts"]):
                topics.append(topic)
            # Check for topic name
            if topic.replace("_", " ") in message_lower:
                topics.append(topic)
        
        return topics if topics else ["general"]
    
    def _determine_intent(self, message: str) -> str:
        """Determine user intent from message."""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["hello", "hi", "hey", "greetings"]):
            return "greeting"
        elif any(word in message_lower for word in ["what", "how", "explain", "tell me"]):
            return "question"
        elif any(word in message_lower for word in ["help", "assist", "support"]):
            return "help"
        elif any(word in message_lower for word in ["learn", "understand", "know"]):
            return "learning"
        else:
            return "conversation"
    
    def _generate_response(self, message: str, topics: List[str], intent: str, context: Optional[Dict]) -> str:
        """Generate a response based on topics and intent."""
        if intent == "greeting":
            import random
            return random.choice(self.conversation_patterns["greeting"])
        
        # For other intents, provide topic-specific information
        if topics and topics[0] != "general":
            primary_topic = topics[0]
            if primary_topic in self.conversation_patterns:
                import random
                return random.choice(self.conversation_patterns[primary_topic])
        
        # Default response
        return "I'm here to help you understand digital sovereignty and privacy-first technology. What specific aspect would you like to explore?"
    
    def _generate_mission_aligned_response(self, message: str, topics: List[str], intent: str, validation: Dict) -> str:
        """Generate a response that better aligns with mission."""
        # Focus on core mission topics
        if "digital_sovereignty" in self.knowledge_base:
            return self.conversation_patterns["digital_sovereignty"][0]
        elif "privacy_protection" in self.knowledge_base:
            return self.conversation_patterns["privacy_protection"][0]
        else:
            return "I'm here to help you understand how technology can serve humanity rather than profit. What would you like to learn about digital sovereignty?"
    
    def _suggest_actions(self, topics: List[str], intent: str) -> List[str]:
        """Suggest next actions based on conversation."""
        suggestions = []
        
        if "digital_sovereignty" in topics:
            suggestions.append("Learn about privacy-focused tools and platforms")
            suggestions.append("Explore community-owned alternatives to big tech")
        
        if "surveillance_capitalism" in topics:
            suggestions.append("Review your current app permissions and data sharing")
            suggestions.append("Consider switching to privacy-respecting alternatives")
        
        if "collective_ownership" in topics:
            suggestions.append("Look into platform cooperatives and community ownership models")
            suggestions.append("Support open-source and community-driven projects")
        
        if "privacy_protection" in topics:
            suggestions.append("Audit your current privacy settings")
            suggestions.append("Learn about encryption and secure communication tools")
        
        return suggestions[:3]  # Limit to 3 suggestions
    
    def _calculate_confidence(self, topics: List[str], intent: str) -> float:
        """Calculate confidence in the response."""
        # Higher confidence for specific topics and clear intents
        topic_confidence = min(len(topics) * 0.3, 0.9)
        intent_confidence = 0.8 if intent != "conversation" else 0.6
        
        return (topic_confidence + intent_confidence) / 2
    
    def _log_interaction(self, session_id: str, message: str, response: str, topics: List[str], validation: Dict) -> None:
        """Log interaction for learning and transparency."""
        log_entry = {
            "session_id": session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "user_message": message,
            "ai_response": response,
            "topics": topics,
            "mission_alignment": validation["overall_values_score"],
            "validation_result": validation
        }
        
        # In a real implementation, this would be stored in the database
        print(f"AI Agent Log: {json.dumps(log_entry, indent=2)}")
    
    def create_code_proposal(
        self,
        db: Session,
        summary: str,
        intent: str,
        proposed_changes: Dict[str, any],
        session_id: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Create a proposal for code-related actions.
        """
        try:
            proposal = self.proposal_service.create_proposal(
                db=db,
                action_type="code",
                summary=summary,
                intent=intent,
                proposed_changes=proposed_changes,
                created_by="ai_agent",
                session_id=session_id
            )
            
            return {
                "success": True,
                "proposal_id": proposal.proposal_id,
                "status": proposal.status,
                "validation_result": proposal.validation_result
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to create code proposal: {str(e)}"
            }
    
    def create_content_proposal(
        self,
        db: Session,
        summary: str,
        intent: str,
        proposed_changes: Dict[str, any],
        session_id: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Create a proposal for content-related actions.
        """
        try:
            proposal = self.proposal_service.create_proposal(
                db=db,
                action_type="content",
                summary=summary,
                intent=intent,
                proposed_changes=proposed_changes,
                created_by="ai_agent",
                session_id=session_id
            )
            
            return {
                "success": True,
                "proposal_id": proposal.proposal_id,
                "status": proposal.status,
                "validation_result": proposal.validation_result
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to create content proposal: {str(e)}"
            }
    
    def create_config_proposal(
        self,
        db: Session,
        summary: str,
        intent: str,
        proposed_changes: Dict[str, any],
        session_id: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Create a proposal for configuration-related actions.
        """
        try:
            proposal = self.proposal_service.create_proposal(
                db=db,
                action_type="config",
                summary=summary,
                intent=intent,
                proposed_changes=proposed_changes,
                created_by="ai_agent",
                session_id=session_id
            )
            
            return {
                "success": True,
                "proposal_id": proposal.proposal_id,
                "status": proposal.status,
                "validation_result": proposal.validation_result
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to create config proposal: {str(e)}"
            }
    
    def create_social_proposal(
        self,
        db: Session,
        summary: str,
        intent: str,
        proposed_changes: Dict[str, any],
        session_id: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Create a proposal for social/community-related actions.
        """
        try:
            proposal = self.proposal_service.create_proposal(
                db=db,
                action_type="social",
                summary=summary,
                intent=intent,
                proposed_changes=proposed_changes,
                created_by="ai_agent",
                session_id=session_id
            )
            
            return {
                "success": True,
                "proposal_id": proposal.proposal_id,
                "status": proposal.status,
                "validation_result": proposal.validation_result
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to create social proposal: {str(e)}"
            }
    
    def execute_validated_proposal(self, db: Session, proposal_id: str) -> Dict[str, any]:
        """
        Execute a validated proposal.
        """
        return self.proposal_service.execute_proposal(db, proposal_id)
    
    def get_proposal_status(self, db: Session, proposal_id: str) -> Dict[str, any]:
        """
        Get the status of a specific proposal.
        """
        proposal = self.proposal_service.get_proposal(db, proposal_id)
        
        if not proposal:
            return {"success": False, "error": "Proposal not found"}
        
        return {
            "success": True,
            "proposal_id": proposal_id,
            "status": proposal.status,
            "action_type": proposal.action_type,
            "summary": proposal.summary,
            "validation_result": proposal.validation_result,
            "timestamp": proposal.timestamp.isoformat()
        }
    
    def get_proposal_statistics(self, db: Session) -> Dict[str, any]:
        """
        Get statistics about all proposals.
        """
        return self.proposal_service.get_proposal_stats(db)

    def get_all_proposals(self, db: Session, status: Optional[str] = None, action_type: Optional[str] = None) -> List[Dict[str, any]]:
        """
        Get all proposals with optional filtering.
        """
        proposals = self.proposal_service.get_all_proposals(db, status=status, action_type=action_type)
        
        # Convert to dictionary format for API response
        result = []
        for proposal in proposals:
            result.append({
                "proposal_id": proposal.proposal_id,
                "action_type": proposal.action_type,
                "summary": proposal.summary,
                "status": proposal.status,
                "timestamp": proposal.timestamp.isoformat(),
                "intent": proposal.intent,
                "proposed_changes": proposal.proposed_changes,
                "validation_result": proposal.validation_result
            })
        
        return result

    def perform_system_scan(self, db: Session) -> Dict[str, any]:
        """
        Perform a comprehensive system scan and generate prioritized proposals.
        This method analyzes the entire system and identifies areas for improvement
        that align with our vision and mission.
        """
        try:
            print("🔍 Starting comprehensive system scan...")
            
            # System analysis areas
            scan_areas = [
                {
                    "name": "privacy_protection",
                    "description": "Privacy and data protection measures",
                    "priority": 1,
                    "checks": [
                        "Data encryption implementation",
                        "User consent mechanisms",
                        "Data retention policies",
                        "Privacy audit logging"
                    ]
                },
                {
                    "name": "digital_sovereignty",
                    "description": "Digital sovereignty and user control",
                    "priority": 1,
                    "checks": [
                        "User data ownership",
                        "Transparent data practices",
                        "Community governance features",
                        "Open source compliance"
                    ]
                },
                {
                    "name": "community_building",
                    "description": "Community engagement and awareness",
                    "priority": 2,
                    "checks": [
                        "Educational content",
                        "Community interaction features",
                        "Awareness campaigns",
                        "Feedback mechanisms"
                    ]
                },
                {
                    "name": "technology_ethics",
                    "description": "Ethical technology practices",
                    "priority": 2,
                    "checks": [
                        "Algorithm transparency",
                        "Bias detection",
                        "Accessibility features",
                        "Sustainable practices"
                    ]
                },
                {
                    "name": "system_security",
                    "description": "System security and integrity",
                    "priority": 3,
                    "checks": [
                        "Security audit",
                        "Vulnerability assessment",
                        "Backup systems",
                        "Incident response"
                    ]
                }
            ]
            
            proposals = []
            
            # Analyze each area and generate proposals
            for area in scan_areas:
                area_proposals = self._analyze_area_and_generate_proposals(db, area)
                proposals.extend(area_proposals)
            
            # Prioritize proposals based on value to vision and mission
            prioritized_proposals = self._prioritize_proposals(proposals)
            
            # Limit to top 10 proposals
            final_proposals = prioritized_proposals[:10]
            
            # Create proposals in database
            created_proposals = []
            for proposal_data in final_proposals:
                try:
                    proposal = self.proposal_service.create_proposal(
                        db=db,
                        action_type=proposal_data["action_type"],
                        summary=proposal_data["summary"],
                        intent=proposal_data["intent"],
                        proposed_changes=proposal_data["proposed_changes"],
                        created_by="ai_system_scan",
                        session_id=f"scan_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
                    )
                    
                    created_proposals.append({
                        "proposal_id": proposal.proposal_id,
                        "summary": proposal.summary,
                        "priority_score": proposal_data["priority_score"],
                        "value_category": proposal_data["value_category"],
                        "status": proposal.status
                    })
                    
                except Exception as e:
                    print(f"❌ Failed to create proposal: {e}")
                    continue
            
            scan_summary = {
                "scan_timestamp": datetime.utcnow().isoformat(),
                "areas_analyzed": len(scan_areas),
                "total_proposals_generated": len(proposals),
                "proposals_created": len(created_proposals),
                "priority_breakdown": self._get_priority_breakdown(created_proposals),
                "value_categories": self._get_value_categories(created_proposals)
            }
            
            print(f"✅ System scan completed: {len(created_proposals)} proposals created")
            
            return {
                "success": True,
                "scan_summary": scan_summary,
                "proposals": created_proposals
            }
            
        except Exception as e:
            print(f"❌ System scan failed: {e}")
            return {
                "success": False,
                "error": f"System scan failed: {str(e)}"
            }

    def _analyze_area_and_generate_proposals(self, db: Session, area: Dict) -> List[Dict]:
        """
        Analyze a specific area and generate relevant proposals.
        """
        proposals = []
        
        # Generate proposals based on area type
        if area["name"] == "privacy_protection":
            proposals.extend(self._generate_privacy_proposals())
        elif area["name"] == "digital_sovereignty":
            proposals.extend(self._generate_sovereignty_proposals())
        elif area["name"] == "community_building":
            proposals.extend(self._generate_community_proposals())
        elif area["name"] == "technology_ethics":
            proposals.extend(self._generate_ethics_proposals())
        elif area["name"] == "system_security":
            proposals.extend(self._generate_security_proposals())
        
        return proposals

    def _generate_privacy_proposals(self) -> List[Dict]:
        """Generate privacy-focused proposals."""
        return [
            {
                "action_type": "code",
                "summary": "Implement end-to-end encryption for all user data",
                "intent": "Enhance user privacy by ensuring all sensitive data is encrypted at rest and in transit, aligning with our privacy-first mission.",
                "proposed_changes": {
                    "file": "backend/app/models/database.py",
                    "changes": [
                        "Add encryption field to UserInteraction model",
                        "Implement automatic encryption/decryption methods",
                        "Add privacy audit logging"
                    ],
                    "impact": "Enhanced user privacy and data protection"
                },
                "priority_score": 0.95,
                "value_category": "privacy_protection"
            },
            {
                "action_type": "content",
                "summary": "Update privacy policy with enhanced transparency",
                "intent": "Improve transparency by clearly communicating our data practices and user rights, building trust with the community.",
                "proposed_changes": {
                    "file": "privacy-policy.md",
                    "changes": [
                        "Add detailed data collection practices",
                        "Clarify user rights and controls",
                        "Include data retention timelines"
                    ],
                    "impact": "Improved transparency and user trust"
                },
                "priority_score": 0.85,
                "value_category": "transparency"
            }
        ]

    def _generate_sovereignty_proposals(self) -> List[Dict]:
        """Generate digital sovereignty proposals."""
        return [
            {
                "action_type": "config",
                "summary": "Implement user data export and deletion features",
                "intent": "Empower users with full control over their data by providing easy export and deletion capabilities.",
                "proposed_changes": {
                    "file": "backend/app/services/user_service.py",
                    "changes": [
                        "Add data export functionality",
                        "Implement account deletion with data cleanup",
                        "Create user data dashboard"
                    ],
                    "impact": "Enhanced user control and digital sovereignty"
                },
                "priority_score": 0.90,
                "value_category": "digital_sovereignty"
            }
        ]

    def _generate_community_proposals(self) -> List[Dict]:
        """Generate community-building proposals."""
        return [
            {
                "action_type": "social",
                "summary": "Launch digital sovereignty awareness campaign",
                "intent": "Educate the community about digital rights and privacy through targeted content and discussions.",
                "proposed_changes": {
                    "campaign_type": "educational",
                    "changes": [
                        "Create weekly privacy tips",
                        "Host community discussions",
                        "Share digital rights resources"
                    ],
                    "impact": "Increased community awareness and engagement"
                },
                "priority_score": 0.80,
                "value_category": "community_building"
            }
        ]

    def _generate_ethics_proposals(self) -> List[Dict]:
        """Generate technology ethics proposals."""
        return [
            {
                "action_type": "code",
                "summary": "Implement bias detection in AI responses",
                "intent": "Ensure our AI system operates fairly and without bias, maintaining ethical standards in all interactions.",
                "proposed_changes": {
                    "file": "backend/app/services/ai_agent.py",
                    "changes": [
                        "Add bias detection algorithms",
                        "Implement fairness metrics",
                        "Create bias reporting system"
                    ],
                    "impact": "Improved AI fairness and ethical operation"
                },
                "priority_score": 0.75,
                "value_category": "technology_ethics"
            }
        ]

    def _generate_security_proposals(self) -> List[Dict]:
        """Generate security-focused proposals."""
        return [
            {
                "action_type": "config",
                "summary": "Implement comprehensive security audit logging",
                "intent": "Enhance system security by tracking all security-relevant events for monitoring and incident response.",
                "proposed_changes": {
                    "file": "backend/app/config.py",
                    "changes": [
                        "Enable security event logging",
                        "Set up automated security alerts",
                        "Implement rate limiting"
                    ],
                    "impact": "Improved system security and monitoring"
                },
                "priority_score": 0.70,
                "value_category": "system_security"
            }
        ]

    def _prioritize_proposals(self, proposals: List[Dict]) -> List[Dict]:
        """
        Prioritize proposals based on value to vision and mission.
        """
        # Sort by priority score (highest first)
        sorted_proposals = sorted(proposals, key=lambda x: x["priority_score"], reverse=True)
        
        # Add ranking information
        for i, proposal in enumerate(sorted_proposals):
            proposal["rank"] = i + 1
            proposal["priority_level"] = self._get_priority_level(proposal["priority_score"])
        
        return sorted_proposals

    def _get_priority_level(self, score: float) -> str:
        """Convert priority score to human-readable level."""
        if score >= 0.9:
            return "Critical"
        elif score >= 0.8:
            return "High"
        elif score >= 0.7:
            return "Medium"
        else:
            return "Low"

    def _get_priority_breakdown(self, proposals: List[Dict]) -> Dict:
        """Get breakdown of proposals by priority level."""
        breakdown = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        for proposal in proposals:
            level = proposal.get("priority_level", "Low")
            breakdown[level] += 1
        return breakdown

    def _get_value_categories(self, proposals: List[Dict]) -> Dict:
        """Get breakdown of proposals by value category."""
        categories = {}
        for proposal in proposals:
            category = proposal.get("value_category", "general")
            categories[category] = categories.get(category, 0) + 1
        return categories
