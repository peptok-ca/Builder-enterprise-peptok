# PowerShell script to clean up and start Docker containers
# Compatible with Windows PowerShell 5.1 and PowerShell Core 7+

Write-Host "Cleaning up existing containers..." -ForegroundColor Green

# Stop and remove existing containers
try {
    docker compose down 2>$null
} catch {
    Write-Host "No containers to stop" -ForegroundColor Yellow
}

# Remove any containers that might be using the ports
Write-Host "Removing containers using our ports..." -ForegroundColor Yellow
try {
    $containers = docker ps -q --filter "publish=8080" --filter "publish=3001" --filter "publish=5433" 2>$null
    if ($containers -and $containers.Count -gt 0) {
        docker stop $containers 2>$null
        docker rm $containers 2>$null
    }
} catch {
    Write-Host "No port-specific containers to remove" -ForegroundColor Yellow
}

Write-Host "Checking for processes using ports 8080, 3001, 5433..." -ForegroundColor Blue

# Function to kill process on port - compatible with different Windows versions
function Kill-ProcessOnPort {
    param($Port)

    try {
        # Try using Get-NetTCPConnection (Windows 8/Server 2012+)
        if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
            $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
            foreach ($connection in $connections) {
                $processId = $connection.OwningProcess
                if ($processId -and $processId -ne 0) {
                    Write-Host "WARNING: Port $Port is in use by process $processId, attempting to free it..." -ForegroundColor Yellow
                    try {
                        Stop-Process -Id $processId -Force -ErrorAction Stop
                        Write-Host "SUCCESS: Process $processId stopped successfully" -ForegroundColor Green
                    } catch {
                        Write-Host "ERROR: Failed to stop process $processId" -ForegroundColor Red
                    }
                }
            }
        } else {
            # Fallback using netstat for older Windows versions
            $netstatOutput = netstat -ano | findstr ":$Port "
            if ($netstatOutput) {
                Write-Host "WARNING: Port $Port appears to be in use (detected via netstat)" -ForegroundColor Yellow
                Write-Host "Please manually stop any processes using port $Port" -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "Could not check port $Port - $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Check and kill processes on our ports
Kill-ProcessOnPort 8080
Kill-ProcessOnPort 3001
Kill-ProcessOnPort 5433

Write-Host "Starting containers..." -ForegroundColor Green

# Check if Docker is running
try {
    docker version | Out-Null
} catch {
    Write-Host "ERROR: Docker is not running or not accessible. Please start Docker Desktop." -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Start the containers with clean build (no cache)
try {
    Write-Host "Building containers..." -ForegroundColor Blue
    docker compose build --no-cache

    Write-Host "Starting containers..." -ForegroundColor Blue
    docker compose up -d

    # Wait a moment for containers to start
    Start-Sleep -Seconds 3

    # Check if containers are running
    $runningContainers = docker compose ps --services --filter "status=running"
    if ($runningContainers) {
        Write-Host "SUCCESS: Docker environment is running!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan
        Write-Host "Backend API: http://localhost:3001" -ForegroundColor Cyan
        Write-Host "Database: localhost:5433" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "To view logs: docker compose logs -f" -ForegroundColor Gray
        Write-Host "To stop: docker compose down" -ForegroundColor Gray
    } else {
        Write-Host "ERROR: Some containers may not have started properly" -ForegroundColor Red
        Write-Host "Run 'docker compose logs' to check for errors" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: Error starting containers: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Try running 'docker compose down' and run this script again" -ForegroundColor Yellow
    exit 1
}
