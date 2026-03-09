[Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null

$images = @(
    @{ Path = 'f:\iraq\frontend\public\assets\device-laptop-light.png'; Width = 800; Height = 459 },
    @{ Path = 'f:\iraq\frontend\public\assets\device-tablet-light.png'; Width = 500; Height = 692 },
    @{ Path = 'f:\iraq\frontend\public\assets\device-phone-light.png'; Width = 400; Height = 806 },
    @{ Path = 'f:\iraq\backend\uploads\ticket_57f53c2e3c5a48e189946dbeb649f382.png'; Width = 800; Height = 1000 } # Resizing the 2.8MB ticket
)

foreach ($item in $images) {
    $path = $item.Path
    if (Test-Path $path) {
        try {
            $img = [System.Drawing.Image]::FromFile($path)
            # Calculate height to maintain aspect ratio if it's the ticket
            $w = $item.Width
            $h = $item.Height
            if ($path -like "*ticket*") {
                $ratio = $img.Height / $img.Width
                $h = [int]($w * $ratio)
            }
            
            $newImg = new-object System.Drawing.Bitmap($w, $h)
            $g = [System.Drawing.Graphics]::FromImage($newImg)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.DrawImage($img, 0, 0, $w, $h)
            
            $outPath = $path.Replace('.png', '-new.png').Replace('.jpg', '-new.jpg')
            $newImg.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
            
            $img.Dispose()
            $newImg.Dispose()
            $g.Dispose()
            
            Move-Item -Path $outPath -Destination $path -Force
            Write-Host "Optimized: $path"
        } catch {
            Write-Warning "Failed to optimize $path : $_"
        }
    } else {
        Write-Host "Not found: $path"
    }
}
