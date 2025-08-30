#!/usr/bin/env python3
"""
Startup script for Fitness Health Planner FastAPI application
"""

import uvicorn
import os
from pathlib import Path

if __name__ == "__main__":
    # Get the directory where this script is located
    backend_dir = Path(__file__).parent
    
    # Change to the backend directory
    os.chdir(backend_dir)
    
    # Run the FastAPI application
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )
