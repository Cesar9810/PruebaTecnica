param(
  [int[]]$Levels = @(100,250,400,550,700,850,1000),
  [string]$ResultsRoot = "..\results",
  [string]$CsvOut = "..\results\summary.csv",
  [string]$MdOut  = "..\results\summary.md"
)

$ErrorActionPreference = "Stop"

function Read-Jtl($path) {
  if (-not (Test-Path $path)) { return @() }
  $first = Get-Content $path -First 1
  if ($first -match 'timeStamp' -and $first -match 'elapsed' -and $first -match 'label') {
    return Import-Csv $path
  } else {
    $headers = @(
      'timeStamp','elapsed','label','responseCode','responseMessage','threadName',
      'dataType','success','failureMessage','bytes','sentBytes','grpThreads',
      'allThreads','URL','Latency','IdleTime','Connect'
    )
    return Import-Csv $path -Header $headers
  }
}

function Percentile($arr, $p) {
  if ($arr.Count -eq 0) { return 0 }
  $sorted = $arr | Sort-Object
  $idx = [math]::Ceiling(($p/100.0) * $sorted.Count) - 1
  if ($idx -lt 0) { $idx = 0 }
  if ($idx -ge $sorted.Count) { $idx = $sorted.Count - 1 }
  [math]::Round([double]$sorted[$idx],0)
}

function Metrics($subset, $durationSec) {
  if ($subset.Count -eq 0) {
    return [pscustomobject]@{ cnt=0; avg=0; p90=0; p95=0; p99=0; thr=0; errPct=0 }
  }
  $cnt  = $subset.Count
  $avg  = [math]::Round((($subset | Measure-Object rt -Average).Average),0)
  $p90  = Percentile ($subset | Select-Object -Expand rt) 90
  $p95  = Percentile ($subset | Select-Object -Expand rt) 95
  $p99  = Percentile ($subset | Select-Object -Expand rt) 99
  $thr  = [math]::Round($cnt / [math]::Max(1,$durationSec), 2)
  $err  = ($subset | Where-Object { -not $_.ok }).Count
  $errPct = if ($cnt -gt 0) { [math]::Round(100.0 * $err / $cnt, 2) } else { 0 }
  [pscustomobject]@{ cnt=$cnt; avg=$avg; p90=$p90; p95=$p95; p99=$p99; thr=$thr; errPct=$errPct }
}

$rows = @()

foreach ($u in $Levels) {
  $jtl = Join-Path $ResultsRoot "step_$u.jtl"
  $raw = Read-Jtl $jtl
  if ($raw.Count -eq 0) { Write-Warning "No encontré $jtl"; continue }

  # normaliza
  $samples = $raw | ForEach-Object {
    [pscustomobject]@{
      ts    = [double]$_.timeStamp
      rt    = [double]$_.elapsed
      label = "$($_.label)"
      ok    = (("$($_.success)".ToLower() -eq 'true') -or ($_.success -eq '1'))
    }
  }

  $t0 = ($samples | Measure-Object ts -Minimum).Minimum
  $t1 = ($samples | Measure-Object ts -Maximum).Maximum
  $durationSec = ($t1 - $t0) / 1000.0

  $getSet  = $samples | Where-Object { $_.label -match 'GET'  -and $_.label -match '/products' }
  $postSet = $samples | Where-Object { $_.label -match 'POST' -and $_.label -match '/products' }

  $getM  = Metrics $getSet  $durationSec
  $postM = Metrics $postSet $durationSec
  $totM  = Metrics $samples $durationSec

  $rows += [pscustomobject]@{
    Users                 = $u
    GET_Avg_ms            = $getM.avg
    GET_p95_ms            = $getM.p95
    POST_Avg_ms           = $postM.avg
    POST_p95_ms           = $postM.p95
    TOTAL_Throughput_rps  = $totM.thr
    TOTAL_Error_pct       = $totM.errPct
  }
}

# CSV (para Excel/Sheets)
$rows | Sort-Object Users | Export-Csv -Path $CsvOut -NoTypeInformation -Encoding UTF8

# Markdown "bonito"
$rows = $rows | Sort-Object Users
$md = @()
$md += "# Resumen Punto 6  Escalado 100 a 1000 usuarios"
$md += ""
$md += "| **Users** | **GET p95 (ms)** | **POST p95 (ms)** | **Throughput (req/s)** | **Error % Total** |"
$md += "|:---------:|-----------------:|------------------:|-----------------------:|------------------:|"
foreach ($r in $rows) {
  $thr = "{0:N2}" -f $r.TOTAL_Throughput_rps
  $err = "{0:N2}%" -f $r.TOTAL_Error_pct
  $md += "| $($r.Users) | $($r.GET_p95_ms) | $($r.POST_p95_ms) | $thr | $err |"
}
Set-Content -Path $MdOut -Value ($md -join "`r`n") -Encoding UTF8

Write-Host "Generado:"
Write-Host " - $CsvOut"
Write-Host " - $MdOut"
