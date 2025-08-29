$JMeterBat = "..\apache-jmeter-5.6.3\bin\jmeter.bat"
$Results   = "..\results"

Write-Host "=== Ejecutando Punto 5 (150 usuarios, 2 min) ==="
& $JMeterBat -n -t "..\TestPlan_150users.jmx" `
  -Jusers=150 -Jramp=30 -Jduration=120 `
  -l "$Results\150users.jtl" `
  -e -o "$Results\report_150users" -f

Write-Host "=== Ejecutando Punto 6 (Escalado 100->1000) ==="
.\run_point6.ps1

#Resumen
Write-Host "=== Generando resumen Punto 6 ==="
.\summarize_from_jtl.ps1