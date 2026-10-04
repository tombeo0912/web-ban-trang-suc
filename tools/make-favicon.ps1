# Tạo favicon PNG, Apple touch icon và favicon.ico từ logo hiện có.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$dir = Join-Path $root 'assets\logo'
$source = Join-Path $dir 'logo-mark-on-light.png'
$mark = [System.Drawing.Image]::FromFile($source)
try {
  foreach ($size in @(32, 180)) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.Clear([System.Drawing.Color]::FromArgb(250, 249, 247))
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $scale = [Math]::Min(($size * 0.78) / $mark.Width, ($size * 0.78) / $mark.Height)
        $width = [int][Math]::Round($mark.Width * $scale)
        $height = [int][Math]::Round($mark.Height * $scale)
        $graphics.DrawImage($mark, [int](($size - $width) / 2), [int](($size - $height) / 2), $width, $height)
      } finally { $graphics.Dispose() }
      $bitmap.Save((Join-Path $dir "favicon-$size.png"), [System.Drawing.Imaging.ImageFormat]::Png)
      if ($size -eq 32) {
        $handle = $bitmap.GetHicon()
        try {
          $icon = [System.Drawing.Icon]::FromHandle($handle)
          $stream = [System.IO.File]::Create((Join-Path $dir 'favicon.ico'))
          try { $icon.Save($stream) } finally { $stream.Dispose() }
        } finally {
          Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class IconHandle { [DllImport("user32.dll")] public static extern bool DestroyIcon(IntPtr handle); }' -ErrorAction SilentlyContinue
          [IconHandle]::DestroyIcon($handle) | Out-Null
        }
      }
    } finally { $bitmap.Dispose() }
  }
} finally { $mark.Dispose() }
