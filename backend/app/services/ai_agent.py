import json
import uuid
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from app.services.mission_guardian import MissionGuardian
from app.config import settings

class AIAgent:
    """
    Privacy-first AI agent that educates about digital sovereignty.
    Processes conversations locally and maintains mission alignment.
    """
    
    def __init__(self):
        self.mission_guardian = MissionGuardian()
        
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
