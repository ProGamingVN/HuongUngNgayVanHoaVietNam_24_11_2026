# Nen anh trong docs\media cho web nhe hon (khong can cai them gi).
# - Giu nguyen ten file, dinh dang va ti le anh -> khong can sua HTML.
# - Thu nho canh dai toi da $max px (chi thu nho, khong phong to).
# - Tu sao luu anh goc vao thu muc "media_goc" (nam ngoai docs).

Add-Type -AssemblyName System.Drawing

$max    = 1600
$media  = (Resolve-Path (Join-Path $PSScriptRoot '..\media')).Path
$backup = Join-Path $PSScriptRoot '..\..\media_goc'

if (-not (Test-Path $backup)) {
    Copy-Item $media $backup -Recurse
    Write-Host "Da sao luu anh goc vao: $backup"
}

$before = 0; $after = 0
Get-ChildItem $media -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' } | ForEach-Object {
    $file = $_
    $sizeBefore = $file.Length
    $before += $sizeBefore

    $src = [System.Drawing.Image]::FromFile($file.FullName)
    $w = $src.Width; $h = $src.Height
    $scale = [Math]::Min(1.0, $max / [Math]::Max($w, $h))
    $nw = [int][Math]::Round($w * $scale); $nh = [int][Math]::Round($h * $scale)

    $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $nw, $nh)
    $g.Dispose(); $src.Dispose()

    $tmp = $file.FullName + '.tmp'
    if ($file.Extension -ieq '.png') {
        $bmp.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
    } else {
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)
        $bmp.Save($tmp, $codec, $ep)
    }
    $bmp.Dispose()

    $sizeAfter = (Get-Item $tmp).Length
    if ($sizeAfter -lt $sizeBefore) {
        Move-Item $tmp $file.FullName -Force
    } else {
        Remove-Item $tmp
        $sizeAfter = $sizeBefore
    }
    $after += $sizeAfter
    "{0,-14} {1,7:N0} KB -> {2,7:N0} KB" -f $file.Name, ($sizeBefore / 1KB), ($sizeAfter / 1KB)
}

"`nTong: {0:N1} MB -> {1:N1} MB" -f ($before / 1MB), ($after / 1MB)
