[Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null

$images = @(
    @{ Path = 'f:\iraq\frontend\public\assets\external\hero-airplane.png'; Width = 800; Height = 500 },
    @{ Path = 'f:\iraq\frontend\public\assets\external\hero-card-hand.png'; Width = 800; Height = 600 }
)

foreach ($item in $images) {
    if (Test-Path $item.Path) {
        $img = [System.Drawing.Image]::FromFile($item.Path)
        $newImg = new-object System.Drawing.Bitmap($item.Width, $item.Height)
        $g = [System.Drawing.Graphics]::FromImage($newImg)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $item.Width, $item.Height)
        $outPath = $item.Path + ".tmp"
        $newImg.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $img.Dispose()
        $newImg.Dispose()
        $g.Dispose()
        Move-Item -Path $outPath -Destination $item.Path -Force
    }
}
