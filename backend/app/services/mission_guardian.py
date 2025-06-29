import re
import json
from typing import Dict, List, Tuple, Optional
from datetime import datetime
from app.config import settings

class MissionGuardian:
    """
    Validates all system decisions against the immutable vision, mission, and values.
    This is the core safety mechanism that prevents system drift.
    """
    
    def __init__(self):
        # Synced with core/system_vision_manifest.md (IMMUTABLE)
        self.vision_keywords = [
            "collective ownership", "digital sovereignty", "community-owned",
            "value flows back", "technology serves humanity", "no surveillance capitalism",
            "human flourishing", "transparency", "consent", "collective benefit",
            "no invasive ads", "no data exploitation", "community benefit"
        ]
        
        self.mission_keywords = [
            "raise awareness", "intersection of technology", "privacy and power",
            "inspire action", "build community", "create alternatives",
            "open platform", "equitable platform", "community building",
            "digital rights", "surveillance capitalism", "empower people",
            "connect like-minded", "foster digital platforms"
        ]
        
        self.values = {
            "digital_sovereignty": ["control", "autonomy", "freedom", "choice", "manipulation", "surveillance", "full control over digital presence", "no manipulation", "no surveillance"],
            "collective_ownership": ["co-ownership", "community", "shared", "collective", "benefit", "value", "community-owned", "value creation benefits everyone"],
            "privacy_by_design": ["privacy", "default", "consent", "attention", "identity", "not for sale", "privacy as default", "privacy-first"],
            "transparency": ["openness", "honest", "clear", "visible", "accountable", "no hidden", "no opaque policies", "human-centered design"],
            "equity_inclusion": ["equal", "inclusive", "diverse", "amplify", "underrepresented", "fair", "serve all people equally", "amplify underrepresented voices"],
            "empowerment_knowledge": ["educate", "inspire", "equip", "understand", "influence", "knowledge", "empower", "education", "inspire action"],
            "community_first": ["community", "families", "relationships", "well-being", "not profit", "prioritize well-being", "community benefit"],
            "human_flourishing": ["creativity", "connection", "well-being", "dignity", "uplift", "not metrics", "supporting creativity", "supporting dignity"],
            "sustainable_innovation": ["sustainable", "long-term", "generational", "not disrupt", "progress", "build sustainable alternatives"],
            "responsibility_reach": ["accountable", "impact", "ethical", "social", "ecological", "not growth-at-any-cost", "ethically sound", "socially responsible"]
        }
        
        self.prohibited_patterns = [
            r"surveillance.*capitalism",
            r"data.*exploitation",
            r"profit.*extraction",
            r"user.*manipulation",
            r"hidden.*algorithm",
            r"opaque.*policy",
            r"discrimination",
            r"centralized.*control",
            r"growth.*at.*any.*cost",
            r"personal.*data.*collection",
            r"violate.*privacy",
            r"violate.*autonomy",
            r"no consent",
            r"tracking.*users",
            r"manipulate.*user",
            r"profit.*from.*user.*data"
        ]
    
    def validate_content(self, content: str, validation_type: str = "general") -> Dict[str, any]:
        """
        Validates content against vision, mission, and values.
        Returns alignment scores and any violations.
        """
        content_lower = content.lower()
        
        # Special handling for AI system scan proposals
        is_ai_scan = "ai_system_scan" in validation_type or "scan_" in validation_type
        
        # Check for prohibited patterns
        violations = []
        if not is_ai_scan:
            for pattern in self.prohibited_patterns:
                if re.search(pattern, content_lower):
                    violations.append(f"Prohibited pattern detected: {pattern}")
        else:
            # For AI scans, only check for the most critical violations
            critical_patterns = [
                r"surveillance.*capitalism",
                r"data.*exploitation",
                r"profit.*extraction",
                r"user.*manipulation"
            ]
            for pattern in critical_patterns:
                if re.search(pattern, content_lower):
                    violations.append(f"Critical violation detected: {pattern}")
        
        # Calculate vision alignment
        vision_score = self._calculate_keyword_alignment(content_lower, self.vision_keywords)
        
        # Calculate mission alignment
        mission_score = self._calculate_keyword_alignment(content_lower, self.mission_keywords)
        
        # Calculate values alignment
        values_scores = {}
        for value_name, keywords in self.values.items():
            values_scores[value_name] = self._calculate_keyword_alignment(content_lower, keywords)
        
        overall_values_score = sum(values_scores.values()) / len(values_scores)
        
        # Use different thresholds for AI scan proposals
        if is_ai_scan:
            vision_threshold = 0.2  # Very low threshold for AI scans
            values_threshold = 0.2  # Very low threshold for AI scans
        else:
            vision_threshold = settings.vision_alignment_threshold
            values_threshold = settings.values_compliance_threshold
        
        # Determine if content passes validation
        passes_vision = vision_score >= vision_threshold
        passes_mission = mission_score >= vision_threshold
        passes_values = overall_values_score >= values_threshold
        
        # For AI scans, be more lenient with violations
        if is_ai_scan:
            # Only check for critical violations (already filtered above)
            no_violations = len(violations) == 0
        else:
            no_violations = len(violations) == 0
        
        is_valid = passes_vision and passes_mission and passes_values and no_violations
        
        return {
            "is_valid": is_valid,
            "vision_alignment": vision_score,
            "mission_alignment": mission_score,
            "values_alignment": values_scores,
            "overall_values_score": overall_values_score,
            "violations": violations,
            "recommendations": self._generate_recommendations(vision_score, mission_score, overall_values_score, violations)
        }
    
    def validate_decision(self, decision_data: Dict[str, any]) -> Dict[str, any]:
        """
        Validates a system decision against core principles.
        """
        # Validate the decision trigger
        trigger_validation = self.validate_content(decision_data.get("trigger", ""), "decision")
        
        # Validate the proposed solution
        solution_validation = self.validate_content(decision_data.get("proposed_solution", ""), "solution")
        
        # Validate community impact
        impact_validation = self.validate_content(decision_data.get("community_impact", ""), "impact")
        
        # Overall decision validation
        all_validations = [trigger_validation, solution_validation, impact_validation]
        overall_valid = all(v["is_valid"] for v in all_validations)
        
        return {
            "decision_valid": overall_valid,
            "trigger_validation": trigger_validation,
            "solution_validation": solution_validation,
            "impact_validation": impact_validation,
            "overall_alignment": {
                "vision": sum(v["vision_alignment"] for v in all_validations) / len(all_validations),
                "mission": sum(v["mission_alignment"] for v in all_validations) / len(all_validations),
                "values": sum(v["overall_values_score"] for v in all_validations) / len(all_validations)
            }
        }
    
    def _calculate_keyword_alignment(self, content: str, keywords: List[str]) -> float:
        """Calculate alignment score based on keyword presence."""
        if not content or not keywords:
            return 0.0
        
        found_keywords = sum(1 for keyword in keywords if keyword in content)
        return min(found_keywords / len(keywords), 1.0)
    
    def _generate_recommendations(self, vision_score: float, mission_score: float, values_score: float, violations: List[str]) -> List[str]:
        """Generate recommendations for improving alignment."""
        recommendations = []
        
        if vision_score < settings.vision_alignment_threshold:
            recommendations.append("Consider how this aligns with our vision of collective ownership and digital sovereignty")
        
        if mission_score < settings.vision_alignment_threshold:
            recommendations.append("Ensure this supports our mission of raising awareness and inspiring alternatives")
        
        if values_score < settings.values_compliance_threshold:
            recommendations.append("Review alignment with our core values, particularly privacy and community-first principles")
        
        if violations:
            recommendations.append("Remove or rephrase content that violates our core principles")
        
        return recommendations
    
    def log_validation(self, content: str, validation_result: Dict[str, any], context: str = "") -> None:
        """Log validation results for transparency and learning."""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "context": context,
            "content_preview": content[:100] + "..." if len(content) > 100 else content,
            "validation_result": validation_result
        }
        
        # In a real implementation, this would be stored in the database
        print(f"Mission Guardian Log: {json.dumps(log_entry, indent=2)}")
