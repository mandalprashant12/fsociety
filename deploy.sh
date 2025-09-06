#!/bin/bash

# Task Manager + Calendar + Scheduling App Deployment Script
echo "🚀 Starting deployment of Task Manager App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file from template..."
    cat > .env << EOF
# Production Environment Variables
NODE_ENV=production
MONGODB_URI=mongodb://admin:password123@mongo:27017/task-manager?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production-$(openssl rand -hex 32)
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
PORT=5000

# Add your API keys here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
EOF
    print_warning "Please update the .env file with your actual API keys before running the application."
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Remove old images (optional)
if [ "$1" = "--clean" ]; then
    print_status "Cleaning up old images..."
    docker-compose down --rmi all
fi

# Build and start the application
print_status "Building and starting the application..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Check if services are running
print_status "Checking service health..."

# Check MongoDB
if docker-compose exec -T mongo mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    print_success "MongoDB is running"
else
    print_error "MongoDB failed to start"
    exit 1
fi

# Check Backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_success "Backend API is running"
else
    print_error "Backend API failed to start"
    exit 1
fi

# Check Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend is running"
else
    print_error "Frontend failed to start"
    exit 1
fi

print_success "🎉 Deployment completed successfully!"
print_status "Application is now running at:"
print_status "  Frontend: http://localhost:3000"
print_status "  Backend API: http://localhost:5000"
print_status "  MongoDB: localhost:27017"

print_status "To view logs, run: docker-compose logs -f"
print_status "To stop the application, run: docker-compose down"

# Show container status
print_status "Container status:"
docker-compose ps
