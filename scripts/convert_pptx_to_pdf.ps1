param(
    [string]$pptxPath = "D:\LandInvest_Presentation\test.pptx",
    [string]$pdfPath = "D:\LandInvest_Presentation\test.pdf"
)

try {
    Write-Host "Opening PowerPoint to convert $pptxPath to $pdfPath..."
    $ppt = New-Object -ComObject PowerPoint.Application
    # MsoTriState: msoTrue = -1, msoFalse = 0
    # Open(filename, ReadOnly, Untitled, WithWindow)
    $pres = $ppt.Presentations.Open($pptxPath, -1, 0, 0)
    # 32 = ppSaveAsPDF
    $pres.SaveAs($pdfPath, 32)
    $pres.Close()
    $ppt.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
    Write-Host "PDF created successfully at $pdfPath!"
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
