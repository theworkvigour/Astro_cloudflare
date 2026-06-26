$png = [System.Convert]::FromBase64String('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==')
[System.IO.File]::WriteAllBytes((Resolve-Path 'src\assets\favicons\apple-touch-icon.png').Path, $png)

# Copy the PNG as favicon.ico (will work as fallback)
Copy-Item -Path 'src\assets\favicons\apple-touch-icon.png' -Destination 'src\assets\favicons\favicon.ico' -Force

Write-Output "Fixed favicon files:"
Get-ChildItem 'src\assets\favicons' | Select-Object Name, Length
