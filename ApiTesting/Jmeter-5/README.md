API Testing – JMeter

Este módulo contiene las pruebas de API realizadas con Apache JMeter 5.6.3 sobre la FakeStore API
.

Se validan tanto aspectos funcionales (GET, POST, PUT) como pruebas de carga y estrés, con reportes automatizados en HTML y resúmenes en Markdown/CSV.

Estructura
ApiTesting/
├─ Postman/                      
├─ data/
│   └─ create_products.csv       # Datos de prueba para POST /products
├─ results/
│   ├─ report_150users/          # Dashboard HTML – Punto 5
│   ├─ report_100/ … report_1000 # Dashboards HTML – Punto 6 (escalado)
│   ├─ 150users.jtl              # Log JMeter Punto 5
│   ├─ step_100.jtl … step_1000.jtl
│   ├─ summary.md                # Resumen bonito en Markdown
│   └─ summary.csv               # Resumen en CSV (para Excel/Sheets)
├─ scripts/
│   ├─ run_point5.ps1            # Ejecuta punto 5 (150 usuarios / 2min)
│   ├─ run_point6.ps1            # Ejecuta punto 6 (escalado 100→1000)
│   ├─ run_all.ps1               # Corre ambos puntos y genera resúmenes
│   └─ summarize_from_jtl.ps1    # Convierte .jtl en summary.md + summary.csv
├─ TestPlan_150users.jmx         # Plan JMeter Punto 5
└─ TestPlan_Scaling.jmx          # Plan JMeter Punto 6

Requisitos

Java 21 (OpenJDK recomendado) → https://adoptium.net/

Apache JMeter 5.6 → https://jmeter.apache.org/download_jmeter.cgi

No incluido en este repo, debes descargarlo aparte y ajustar la ruta en los scripts.

Casos de prueba

Funcional

GET /products/category/electronics

GET /products/{id}

POST /products

PUT /products/{id} (actualizar imagen)

Carga y Estrés

Punto 5: 150 usuarios concurrentes, 2 minutos, con 50% GET y 50% POST.

Punto 6: Escalado de 100 → 1000 usuarios en intervalos de 150, 60s cada escalón.

Ejecución
1) Clonar el repositorio
git clone https://github.com/<tu-usuario>/PruebaTecnica.git
cd PruebaTecnica/ApiTesting

2) Ejecutar pruebas

Abre PowerShell en ApiTesting/scripts/ y habilita scripts si es necesario:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Punto 5 – 150 usuarios (2 minutos)
.\run_point5.ps1 `
  -JMeterBat "..\apache-jmeter-5.6.3\bin\jmeter.bat" `
  -Jmx "..\TestPlan_150users.jmx" `
  -OutDir "..\results"


Genera:

results\150users.jtl

results\report_150users\index.html

Punto 6 – Escalado 100 → 1000 usuarios
.\run_point6.ps1 `
  -JMeterBat "..\apache-jmeter-5.6.3\bin\jmeter.bat" `
  -Jmx "..\TestPlan_Scaling.jmx" `
  -OutDir "..\results"


Genera:

Un .jtl y un report_xxx/ por cada nivel de usuarios (100, 250, …, 1000).

Generar resumen consolidado
.\summarize_from_jtl.ps1


Genera:

results\summary.md (tabla Markdown con métricas p95, throughput y errores).

results\summary.csv (datos para Excel/Sheets).

Correr todo junto (Punto 5 + Punto 6 + Resumen)
.\run_all.ps1

Resultados de ejemplo
Users	GET p95 (ms)	POST p95 (ms)	Throughput (req/s)	Error % Total
100	317	272	210.37	49.85%
250	329	292	209.97	49.84%
400	322	280	210.44	49.84%
550	315	272	210.04	49.85%
700	321	279	210.80	49.85%
850	314	274	211.53	49.85%
1000	316	272	211.20	49.86%

Notas

FakeStore API está protegida con Cloudflare → bajo alta concurrencia los POST /products generan ~50% de errores (challenge 403).

Esto se refleja en el Error % ≈ 50% en los reportes.

GET /products se mantiene estable y rápido.