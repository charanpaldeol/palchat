#!/usr/bin/env python3
"""
Daily AI System Scan Scheduler

This script performs daily automated system scans to generate prioritized proposals
for improving the system based on our vision and mission.

Usage:
    python daily_scan_scheduler.py

Can be run as a cron job:
    0 9 * * * cd /path/to/backend && python daily_scan_scheduler.py
"""

import os
import sys
import logging
from datetime import datetime
import requests
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.database import get_db
from app.services.ai_agent import AIAgent
from app.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('daily_scan.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def perform_daily_scan():
    """
    Perform the daily AI system scan.
    """
    try:
        logger.info("🤖 Starting daily AI system scan...")
        
        # Initialize AI agent
        ai_agent = AIAgent()
        
        # Get database session
        db = next(get_db())
        
        # Perform the scan
        result = ai_agent.perform_system_scan(db)
        
        if result["success"]:
            scan_summary = result["scan_summary"]
            proposals = result["proposals"]
            
            logger.info(f"✅ Daily scan completed successfully!")
            logger.info(f"📊 Scan Summary:")
            logger.info(f"   - Areas analyzed: {scan_summary['areas_analyzed']}")
            logger.info(f"   - Total proposals generated: {scan_summary['total_proposals_generated']}")
            logger.info(f"   - Proposals created: {scan_summary['proposals_created']}")
            
            # Log priority breakdown
            logger.info(f"🎯 Priority Breakdown:")
            for level, count in scan_summary['priority_breakdown'].items():
                if count > 0:
                    logger.info(f"   - {level}: {count}")
            
            # Log value categories
            logger.info(f"💎 Value Categories:")
            for category, count in scan_summary['value_categories'].items():
                display_name = category.replace('_', ' ').title()
                logger.info(f"   - {display_name}: {count}")
            
            # Log created proposals
            if proposals:
                logger.info(f"📋 Created Proposals:")
                for proposal in proposals:
                    logger.info(f"   - {proposal['proposal_id']}: {proposal['summary']}")
            
            return True
            
        else:
            logger.error(f"❌ Daily scan failed: {result['error']}")
            return False
            
    except Exception as e:
        logger.error(f"❌ Daily scan failed with exception: {str(e)}")
        return False
    finally:
        db.close()

def notify_admin(scan_success: bool, message: str):
    """
    Notify admin about scan results (placeholder for future implementation).
    """
    if scan_success:
        logger.info(f"📧 Admin notification: {message}")
    else:
        logger.error(f"📧 Admin notification (FAILURE): {message}")

def main():
    """
    Main function to run the daily scan.
    """
    start_time = datetime.now()
    logger.info(f"🚀 Daily scan started at {start_time}")
    
    try:
        # Perform the scan
        success = perform_daily_scan()
        
        end_time = datetime.now()
        duration = end_time - start_time
        
        if success:
            message = f"Daily AI scan completed successfully in {duration.total_seconds():.2f} seconds"
            logger.info(f"✅ {message}")
        else:
            message = f"Daily AI scan failed after {duration.total_seconds():.2f} seconds"
            logger.error(f"❌ {message}")
        
        # Notify admin (placeholder)
        notify_admin(success, message)
        
        return 0 if success else 1
        
    except Exception as e:
        logger.error(f"❌ Fatal error in daily scan: {str(e)}")
        notify_admin(False, f"Fatal error in daily scan: {str(e)}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code) 