param(
  [string]$JMeterBat = "..\apache-jmeter-5.6.3\bin\jmeter.bat",
  [string]$Jmx       = "..\TestPlan_150users.jmx",
  [string]$OutDir    = "..\results"
)

$ErrorActionPreference = "Stop"

# Crear carpeta results si no existe
if (-not (Test-Path $OutDir)) {
  New-Item -ItemType Directory -Path $OutDir | Out-Null
}

Write-Host "=== Ejecutando Punto 5 (150 usuarios, 2 min) ==="

& $JMeterBat -n -t $Jmx `
  -Jusers=150 -Jramp=30 -Jduration=120 `
  -l "$OutDir\150users.jtl" `
  -e -o "$OutDir\report_150users" -f

Write-Host "Prueba terminada. Dashboard generado en $OutDir\report_150users"
