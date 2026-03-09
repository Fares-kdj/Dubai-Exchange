Add-Type -AssemblyName System.Drawing
function Resize-Image {
    param([string]$path, [int]$width, [int]$height)
    $img = [System.Drawing.Image]::FromFile($path)
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.DrawImage($img, 0, 0, $width, $height)
    $name = [System.IO.Path]::GetFileNameWithoutExtension($path)
    $dir = [System.IO.Path]::GetDirectoryName($path)
    $ext = [System.IO.Path]::GetExtension($path)
    # Save as PNG but check if we can use JPG for backgrounds
    if ($path -match "splash") {
        $bmp.Save("$dir\$name-opt.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
    } else {
        $bmp.Save("$dir\$name-opt.png", [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $img.Dispose()
    $bmp.Dispose()
    $graph.Dispose()
}

# Splash Backgrounds (1.6MB and 7.4MB) -> Target 1920x1080 JPG
Resize-Image "f:\iraq\frontend\public\assets\external\hero-light-splash.png" 1920 1080
Resize-Image "f:\iraq\frontend\public\assets\external\hero-dark-splash.png" 1920 1080

# USDT Coin (2.9MB) -> Target 800x800 PNG (keep transparency if needed)
Resize-Image "f:\iraq\frontend\public\assets\external\usdt-coin.png" 800 800
