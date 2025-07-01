# PowerShell script to clean up and start Docker containers

Write-Host "🧹 Cleaning up existing containers..." -ForegroundColor Green

# Stop and remove existing containers
docker compose down

# Remove any containers that might be using the ports
$containers = docker ps -q --filter "publish=8080" --filter "publish=3001" --filter "publish=5433"
if ($containers) {
    Write-Host "Stopping containers using our ports..." -ForegroundColor Yellow
    docker stop $containers 2>$null
    docker rm $containers 2>$null
}

Write-Host "🔍 Checking for processes using ports 8080, 3001, 5433..." -ForegroundColor Blue

# Function to kill process on port
function Kill-ProcessOnPort {
    param($Port)

    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($process) {
        $processId = (Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue).Id
        if ($processId) {
            Write-Host "⚠️  Port $Port is in use by process $processId, attempting to free it..." -ForegroundColor Yellow
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    }
}

# Check and kill processes on our ports
Kill-ProcessOnPort 8080
Kill-ProcessOnPort 3001
Kill-ProcessOnPort 5433

Write-Host "🚀 Starting containers..." -ForegroundColor Green

# Start the containers with clean build (no cache)
docker compose build --no-cache
docker compose up

Write-Host "✅ Docker environment should be running!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🔗 Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🗄️  Database: localhost:5433" -ForegroundColor Cyan
