# Starts this static PWA on localhost so ES Modules, manifest, and Service Worker work correctly.
$port = 8080
Write-Host "あさじたく を起動しています…" -ForegroundColor Cyan
Write-Host "ブラウザで http://localhost:$port を開いてください。終了は Ctrl+C です。" -ForegroundColor Yellow
python -m http.server $port
