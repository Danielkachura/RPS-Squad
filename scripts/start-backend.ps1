Set-Location -LiteralPath $PSScriptRoot\..
$python = Join-Path $env:LOCALAPPDATA 'Programs\Python\Python312\python.exe'
New-Item -ItemType Directory -Force -Path server-logs | Out-Null
& $python -m uvicorn backend.python_api.app:app --host 127.0.0.1 --port 8000 *> server-logs\backend-live.log
