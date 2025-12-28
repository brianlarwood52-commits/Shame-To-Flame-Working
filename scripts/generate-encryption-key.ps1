# Generate a secure 32-byte encryption key for message encryption
# This key will be used by Supabase Edge Functions to encrypt messages at rest

# Generate 32 random bytes (compatible with older PowerShell)
$bytes = New-Object byte[] 32
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$rng.GetBytes($bytes)
$b64 = [Convert]::ToBase64String($bytes)

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "ENCRYPTION KEY GENERATED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Add this to your Supabase Edge Function secrets:" -ForegroundColor Yellow
Write-Host ""
Write-Host "MESSAGE_ENCRYPTION_KEY_B64=$b64" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Save this key securely!" -ForegroundColor Red
Write-Host "- Add it to Supabase Dashboard → Settings → Edge Functions → Secrets" -ForegroundColor Yellow
Write-Host "- For local dev, add it to supabase/.env" -ForegroundColor Yellow
Write-Host "- Never commit this key to Git!" -ForegroundColor Red
Write-Host ""

# Copy to clipboard (optional)
Set-Clipboard -Value "MESSAGE_ENCRYPTION_KEY_B64=$b64"
Write-Host "Key copied to clipboard!" -ForegroundColor Green
Write-Host ""
