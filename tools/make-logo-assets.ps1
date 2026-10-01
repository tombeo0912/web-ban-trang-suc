<#
  make-logo-assets.ps1
  Sinh bộ logo asset cho website Bạc Hải Yến từ file logo gốc (nền đen, mark bạc + wordmark).

  Nguồn:  assets/logo/logo-primary-black.png   (959x959, nền đen #000000)
  Đích  :  assets/logo/

  Nguyên lý tách nền: ảnh gốc là hình bạc vẽ trên nền đen, nên độ sáng (luminance)
  của từng pixel chính là độ đục (alpha). Giữ alpha = luminance rồi đổi màu pixel:
    - Bản dùng trên nền tối  -> pixel màu trắng  (giống hệt ảnh gốc)
    - Bản dùng trên nền sáng -> pixel màu #1A1A1A (mark đen ánh kim trên nền sáng)

  Chạy lại:  powershell -ExecutionPolicy Bypass -File tools\make-logo-assets.ps1
#>

param(
  [string]$Source = (Join-Path $PSScriptRoot '..\assets\logo\logo-primary-black.png'),
  [string]$OutDir = (Join-Path $PSScriptRoot '..\assets\logo')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $Source)) { throw "Khong tim thay file logo goc: $Source" }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public class LogoAssets
{
    private int W, H;
    private byte[] lum;

    public LogoAssets(string path)
    {
        using (Bitmap src = new Bitmap(path))
        {
            W = src.Width; H = src.Height;
            lum = new byte[W * H];
            BitmapData d = src.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
            int stride = d.Stride;
            byte[] buf = new byte[stride * H];
            Marshal.Copy(d.Scan0, buf, 0, buf.Length);
            src.UnlockBits(d);
            for (int y = 0; y < H; y++)
                for (int x = 0; x < W; x++)
                {
                    int i = y * stride + x * 3;
                    int b = buf[i], g = buf[i + 1], r = buf[i + 2];
                    lum[y * W + x] = (byte)((r * 299 + g * 587 + b * 114) / 1000);
                }
        }
    }

    public int Width  { get { return W; } }
    public int Height { get { return H; } }

    // Vung bao cua phan tu sang trong mot khu vuc cho truoc
    public Rectangle BBox(int rx, int ry, int rw, int rh, int thresh)
    {
        int x0 = rx + rw, y0 = ry + rh, x1 = rx - 1, y1 = ry - 1;
        for (int y = ry; y < ry + rh; y++)
            for (int x = rx; x < rx + rw; x++)
                if (lum[y * W + x] >= thresh)
                {
                    if (x < x0) x0 = x;
                    if (x > x1) x1 = x;
                    if (y < y0) y0 = y;
                    if (y > y1) y1 = y;
                }
        if (x1 < x0 || y1 < y0) return Rectangle.Empty;
        return Rectangle.FromLTRB(x0, y0, x1 + 1, y1 + 1);
    }

    // mode 0 = pixel trang (dung tren nen toi) | mode 1 = pixel mau dam (dung tren nen sang)
    public Bitmap Extract(Rectangle r, int mode, Color darkColor)
    {
        Bitmap bmp = new Bitmap(r.Width, r.Height, PixelFormat.Format32bppArgb);
        BitmapData d = bmp.LockBits(new Rectangle(0, 0, r.Width, r.Height), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
        int stride = d.Stride;
        byte[] buf = new byte[stride * r.Height];
        byte R = mode == 0 ? (byte)255 : darkColor.R;
        byte G = mode == 0 ? (byte)255 : darkColor.G;
        byte B = mode == 0 ? (byte)255 : darkColor.B;
        for (int y = 0; y < r.Height; y++)
            for (int x = 0; x < r.Width; x++)
            {
                byte a = lum[(y + r.Top) * W + (x + r.Left)];
                int i = y * stride + x * 4;
                buf[i] = B; buf[i + 1] = G; buf[i + 2] = R; buf[i + 3] = a;
            }
        Marshal.Copy(buf, 0, d.Scan0, buf.Length);
        bmp.UnlockBits(d);
        return bmp;
    }

    public void SaveOnBlack(Rectangle r, string path, int outW, int outH, double fill, Color bg)
    {
        using (Bitmap bmp = new Bitmap(outW, outH, PixelFormat.Format32bppArgb))
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.Clear(bg);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.SmoothingMode = SmoothingMode.HighQuality;
            using (Bitmap art = Extract(r, 0, Color.Black))
            {
                double scale = Math.Min((double)outW * fill / art.Width, (double)outH * fill / art.Height);
                int w = (int)Math.Round(art.Width * scale), h = (int)Math.Round(art.Height * scale);
                g.DrawImage(art, new Rectangle((outW - w) / 2, (outH - h) / 2, w, h));
            }
            bmp.Save(path, ImageFormat.Png);
        }
    }

    public void SaveOnBlackMulti(Rectangle[] regions, string path, int outW, int outH, double fill, Color bg, double gapRatio)
    {
        using (Bitmap bmp = new Bitmap(outW, outH, PixelFormat.Format32bppArgb))
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.Clear(bg);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.SmoothingMode = SmoothingMode.HighQuality;

            int totalH = 0, maxW = 0;
            Rectangle[] rs = new Rectangle[regions.Length];
            for (int i = 0; i < regions.Length; i++)
            {
                rs[i] = regions[i];
                totalH += rs[i].Height;
                if (rs[i].Width > maxW) maxW = rs[i].Width;
            }
            int gap = (int)Math.Round(maxW * gapRatio);
            totalH += gap * (regions.Length - 1);

            double scale = Math.Min((double)outW * fill / maxW, (double)outH * fill / totalH);
            int curY = (int)Math.Round((outH - totalH * scale) / 2);
            for (int i = 0; i < rs.Length; i++)
            {
                using (Bitmap art = Extract(rs[i], 0, Color.Black))
                {
                    int w = (int)Math.Round(art.Width * scale), h = (int)Math.Round(art.Height * scale);
                    g.DrawImage(art, new Rectangle((outW - w) / 2, curY, w, h));
                    curY += h + (int)Math.Round(gap * scale);
                }
            }
            bmp.Save(path, ImageFormat.Png);
        }
    }
}
'@

$proc = New-Object LogoAssets($Source)
Write-Host "Anh goc: $($proc.Width) x $($proc.Height)"

# --- 1. Tach vung mark va vung wordmark bang nguong sang ---
$markBox = $proc.BBox(0, 0, $proc.Width, [int]($proc.Height * 0.70), 40)
$wordBox = $proc.BBox(0, [int]($proc.Height * 0.70), $proc.Width, [int]($proc.Height * 0.30), 40)

if ($markBox.IsEmpty) { throw "Khong nhan dien duoc vung mark" }
if ($wordBox.IsEmpty) { throw "Khong nhan dien duoc vung wordmark" }

Write-Host "Mark    : x $($markBox.X)..$($markBox.Right)  y $($markBox.Y)..$($markBox.Bottom)  ($($markBox.Width)x$($markBox.Height))"
Write-Host "Wordmark: x $($wordBox.X)..$($wordBox.Right)  y $($wordBox.Y)..$($wordBox.Bottom)  ($($wordBox.Width)x$($wordBox.Height))"

# Padding quanh vung cat de khong bi sat vien
$mp = 6
$markCrop = [System.Drawing.Rectangle]::FromLTRB($markBox.X - $mp, $markBox.Y - $mp, $markBox.Right + $mp, $markBox.Bottom + $mp)
$lockupCrop = [System.Drawing.Rectangle]::FromLTRB(
  [Math]::Min($markBox.X, $wordBox.X) - $mp,
  $markBox.Y - $mp,
  [Math]::Max($markBox.Right, $wordBox.Right) + $mp,
  $wordBox.Bottom + $mp)

# --- 2. Xuat cac bien the ---
$darkInk = [System.Drawing.Color]::FromArgb(26, 26, 26)   # #1A1A1A
$paper   = [System.Drawing.Color]::FromArgb(250, 248, 245) # #FAF8F5

$created = @()

# Lockup dung tren nen sang (header) - mark + wordmark mau dam, nen trong suot
$bmp = $proc.Extract($lockupCrop, 1, $darkInk)
$bmp.Save((Join-Path $OutDir 'logo-lockup-on-light.png'), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
$created += 'logo-lockup-on-light.png'

# Mark dung tren nen sang (header thu gon, favicon nen sang)
$bmp = $proc.Extract($markCrop, 1, $darkInk)
$bmp.Save((Join-Path $OutDir 'logo-mark-on-light.png'), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
$created += 'logo-mark-on-light.png'

# Lockup dung tren nen toi (footer)
$bmp = $proc.Extract($lockupCrop, 0, [System.Drawing.Color]::Black)
$bmp.Save((Join-Path $OutDir 'logo-lockup-on-dark.png'), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
$created += 'logo-lockup-on-dark.png'

# Mark dung tren nen toi
$bmp = $proc.Extract($markCrop, 0, [System.Drawing.Color]::Black)
$bmp.Save((Join-Path $OutDir 'logo-mark-on-dark.png'), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
$created += 'logo-mark-on-dark.png'

# Favicon / apple-touch-icon: mark bac tren nen den, vien trong
$proc.SaveOnBlack($markCrop, (Join-Path $OutDir 'favicon-32.png'), 32, 32, 0.80, [System.Drawing.Color]::FromArgb(0,0,0)); $created += 'favicon-32.png'
$proc.SaveOnBlack($markCrop, (Join-Path $OutDir 'favicon-48.png'), 48, 48, 0.80, [System.Drawing.Color]::FromArgb(0,0,0)); $created += 'favicon-48.png'
$proc.SaveOnBlack($markCrop, (Join-Path $OutDir 'favicon-180.png'), 180, 180, 0.74, [System.Drawing.Color]::FromArgb(0,0,0)); $created += 'favicon-180.png'

# Anh chia se mang xa hoi 1200x630
$proc.SaveOnBlackMulti(@($markCrop, $wordBox), (Join-Path $OutDir 'og-image-1200x630.png'), 1200, 630, 0.72, [System.Drawing.Color]::FromArgb(8,8,8), 0.22); $created += 'og-image-1200x630.png'

Write-Host ""
Write-Host "Da tao $($created.Count) file trong $OutDir :"
$created | ForEach-Object { Write-Host "  - $_" }
