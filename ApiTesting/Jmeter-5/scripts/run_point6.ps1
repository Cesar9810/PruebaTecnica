param(
  [int[]]$Levels = @(100,250,400,550,700,850,1000),
  [int]$Ramp = 30,
  [int]$Duration = 60,
  [string]$Jmx = ".\TestPlan_Scaling.jmx",
  [string]$JMeterBat = ".\apache-jmeter-5.6.3\bin\jmeter.bat",
  [string]$OutDir = ".\results"
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot\..   # nos ubicamos en ApiTesting/jmeter/

New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

foreach ($u in $Levels) {
  $report = Join-Path $OutDir "report_$u"
  if (Test-Path $report) { Remove-Item -Recurse -Force $report }
  $jtl = Join-Path $OutDir "step_$u.jtl"

  Write-Host "=== Ejecutando $u usuarios ==="
  & $JMeterBat -n -t $Jmx -Jusers=$u -Jramp=$Ramp -Jduration=$Duration -l $jtl -e -o $report -f
}
Write-Host "OK. Dashboards en $OutDir\report_<USERS>"
