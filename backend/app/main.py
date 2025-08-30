from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.routers import health_plans, users, analytics
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fitness Health Planner API",
    description="A comprehensive API for generating personalized fitness and health plans",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_plans.router, prefix="/api/v1", tags=["Health Plans"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(analytics.router, prefix="/api/v1", tags=["Analytics"])

# Serve static files (frontend)
if os.path.exists("../index.html"):
    app.mount("/static", StaticFiles(directory=".."), name="static")

@app.get("/")
async def root():
    """Serve the main application"""
    return FileResponse("../index.html")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Fitness Health Planner API is running",
        "version": "1.0.0"
    }

@app.get("/api")
async def api_info():
    """API information endpoint"""
    return {
        "name": "Fitness Health Planner API",
        "version": "1.0.0",
        "description": "Generate personalized fitness and health plans",
        "endpoints": {
            "health_plans": "/api/v1/health-plans",
            "users": "/api/v1/users",
            "analytics": "/api/v1/analytics",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
