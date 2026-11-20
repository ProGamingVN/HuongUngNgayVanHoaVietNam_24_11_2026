# Chuyen anh PNG -> JPG (nhe hon nhieu) va cap nhat duong dan trong cac file HTML.
# - Lay anh goc tu thu muc "media_goc" (neu co) de giu chat luong tot nhat.
# - Canh dai toi da $max px, JPG chat luong $quality.
# - Anh co nen trong suot se duoc dat len nen trang.
# - Chay lai nhieu lan van an toan.

Add-Type -AssemblyName System.Drawing

$max     = 1600
$quality = 82

$docs   = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$media  = Join-Path $docs 'media'
$backup = Join-Path $docs '..\media_goc'

if (-not (Test-Path $backup)) {
    Copy-Item $media $backup -Recurse
    Write-Host "Da sao luu anh goc vao: $backup"
}
$backup = (Resolve-Path $backup).Path

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)

$before = 0; $after = 0
Get-ChildItem $backup -File | Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' } | ForEach-Object {
    $file = $_
    $before += $file.Length
    $name = [IO.Path]::GetFileNameWithoutExtension($file.Name)
    $outPath = Join-Path $media ($name + '.jpg')

    $src = [System.Drawing.Image]::FromFile($file.FullName)
    $hasAlpha = [System.Drawing.Image]::IsAlphaPixelFormat($src.PixelFormat)
    $w = $src.Width; $h = $src.Height
    $scale = [Math]::Min(1.0, $max / [Math]::Max($w, $h))
    $nw = [int][Math]::Round($w * $scale); $nh = [int][Math]::Round($h * $scale)

    $bmp = New-Object System.Drawing.Bitmap($nw, $nh, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::White)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $nw, $nh)
    $g.Dispose(); $src.Dispose()

    $bmp.Save($outPath, $codec, $ep)
    $bmp.Dispose()

    # Xoa ban PNG cu trong docs\media (ban goc van con trong media_goc)
    $oldPng = Join-Path $media ($name + '.png')
    if (Test-Path $oldPng) { Remove-Item $oldPng -Force }

    $sz = (Get-Item $outPath).Length
    $after += $sz
    $note = ''
    if ($hasAlpha) { $note = '  (co nen trong suot, da dat len nen trang)' }
    "{0,-14} {1,7:N0} KB -> {2,7:N0} KB  [{3}x{4}]{5}" -f $file.Name, ($file.Length / 1KB), ($sz / 1KB), $nw, $nh, $note
}

# Cap nhat duong dan .png -> .jpg trong cac file HTML
$utf8 = New-Object System.Text.UTF8Encoding($false)
Get-ChildItem $docs -Filter *.html | ForEach-Object {
    $text = [IO.File]::ReadAllText($_.FullName, [Text.Encoding]::UTF8)
    $new  = [regex]::Replace($text, 'media/(image\d+)\.png', 'media/$1.jpg')
    if ($new -ne $text) {
        [IO.File]::WriteAllText($_.FullName, $new, $utf8)
        Write-Host ("Da cap nhat duong dan anh trong " + $_.Name)
    }
}

"`nTong: {0:N1} MB -> {1:N1} MB" -f ($before / 1MB), ($after / 1MB)
