#!/bin/bash

# Peptok Docker Quick Start Script

echo "🐳 Starting Peptok with Docker..."

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists, if not copy from example
if [ ! -f .env ]; then
    echo "📋 Creating .env file from .env.docker..."
    cp .env.docker .env
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start the services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait a moment for services to start
sleep 5

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=10

echo ""
echo "🎉 Peptok is now running!"
echo ""
echo "📱 Frontend (React App): http://localhost:8080"
echo "🔧 Backend API: http://localhost:3001"
echo "🗄️  Database: localhost:5432"
echo ""
echo "🔧 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Shell into frontend: docker-compose exec frontend sh"
echo "  Shell into backend: docker-compose exec backend sh"
echo ""
echo "💡 The app works with mock data, so you can start using it immediately!"
echo "   Create mentorship requests, invite team members, and explore all features."
