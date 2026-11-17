# 010 Delivery — Prompts consolidados

## 1. Preparar una entrada clara y una demo segura

**Contexto y objetivo.** La aplicación está implementada. Permite al evaluador comprender decisiones y ejecutarla sin depender de la conversación.

**Instrucciones.** Reorganiza el README con contexto, necesidades, arquitectura, recorrido SDD y procedencia de las herramientas IA. Documenta instrucciones reales y capturas con datos ficticios. Prepara una demo completa en una base nueva explícita reutilizando migraciones, validadores y servicios; conserva el seed histórico y rechaza destinos existentes.

**Criterio de aceptación.** Comprueba datos, importes y protección de rutas con pruebas aisladas. No presentes la preparación del README y la demo como un ensayo limpio ya realizado ni inventes sesiones de diseño.

## 2. Organizar evidencia con procedencia verificable

**Contexto y objetivo.** Los registros están repartidos y contienen estados históricos. Prepara un recorrido comprensible sin reescribir el proceso.

**Instrucciones.** Enlaza instrucciones canónicas y resultados conservados, distinguiendo retrospectivas, evidencia contemporánea y comprobaciones actuales. Respeta mensajes excluidos y declara artefactos efímeros o ausentes. Resuelve afirmaciones operativas obsoletas sin convertir síntesis posteriores en prompts originales.

**Criterio de aceptación.** Cada afirmación relevante debe tener fuente y alcance. No repitas suites de producto por una edición documental ni atribuyas aceptación humana.

## 3. Ensayar desde una copia aislada identificada

**Contexto y objetivo.** Comprueba que las instrucciones permiten instalar y ejecutar el proyecto sin dependencias o datos heredados.

**Instrucciones.** Exporta una versión identificada a un destino temporal nuevo, conservando configuración necesaria y excluyendo Git, dependencias, cachés y bases previas. Instala herramientas locales de la copia y sigue el README para demo, arranque, flujo y controles. Registra red, entorno compartido y fallos; cierra únicamente recursos propios y comprueba preservación del original.

**Criterio de aceptación.** Acredita instalación, guardado e historial con resultados reales. Distingue exportación local de clon remoto o máquina limpia y conserva incidencias de cleanup aunque las aserciones funcionales pasen.

## 4. Preparar entrega externa y cerrar con límites

**Contexto y objetivo.** Deja contenido y riesgos revisables sin publicar ni elegir hosting.

**Instrucciones.** Inventaría archivos y exclusiones, revisa patrones de credenciales sin exponer valores y documenta límites del escaneo. Identifica condiciones SPA/API/SQLite y decisiones pendientes. Mantén README y ai-workspace como recorrido, respetando la eliminación de la guía separada. Consolida requisitos y resultados por versión sin presentar pruebas anteriores como ejecuciones nuevas.

**Criterio de aceptación.** Separa preparación completada, verificación ejecutada, aceptación humana y publicación. No cambies remotos, compartas el repositorio o despliegues; deja visibles las comprobaciones externas pendientes.
