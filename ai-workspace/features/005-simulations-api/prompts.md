# 005 Simulations API — Prompts consolidados

## 1. Adaptar el contrato a las piezas existentes

**Contexto y objetivo.** Persistencia, clientes y cálculo ya están disponibles. Prepara la integración sin reconstruir esas piezas.

**Instrucciones.** Contrasta la propuesta con el monorepo, elimina referencias obsoletas y confirma las decisiones abiertas antes de implementar. Define contratos sin ORM y parsers estrictos reutilizando UUID, consumos y paginación. Mantén la semántica de clientes al extraer helpers compartidos.

**Criterio de aceptación.** Rechaza campos adicionales, coerciones y consultas inválidas con pruebas de fronteras y regresión. Distingue contratos preparados de endpoints disponibles.

## 2. Calcular y guardar de forma coherente

**Contexto y objetivo.** Integra el motor autoritativo con el guardado y los snapshots existentes.

**Instrucciones.** Obtén el país del cliente y aplica la política interna del servidor. Coordina lectura, cálculo, inserción y mapping bajo una transacción corta en el repositorio; reutiliza la inserción existente y verifica sus savepoints. Mantén el servicio sin SQL y el dominio sin infraestructura. No aceptes importes calculados por el consumidor.

**Criterio de aceptación.** Comprueba rollback real, reapertura, coherencia de snapshots y conservación de registros anteriores en SQLite temporal. No modifiques esquema, dependencias ni datos existentes.

## 3. Exponer el alta con errores consistentes

**Contexto y objetivo.** Publica el guardado mediante HTTP reutilizando el servicio probado.

**Instrucciones.** Valida antes de abrir DB, comparte el protocolo JSON de clientes y responde después del commit. Distingue errores de entrada, ausencia de cliente, indisponibilidad y fallos internos; conserva respuestas y logs sanitizados. No añadas reintentos automáticos ni prometas idempotencia.

**Criterio de aceptación.** Verifica respuestas, ausencia de escrituras parciales y privacidad. Conserva las regresiones de clientes y salud, sin anunciar un recurso de detalle inexistente.

## 4. Leer el histórico y verificar la integración

**Contexto y objetivo.** Completa las lecturas y comprueba la entrega integrada.

**Instrucciones.** Pagina en SQL y devuelve snapshots e importes guardados sin recalcular. Publica configuración desde las fuentes reales, mediante copias y sin DB. Prueba conservación ante cambios de cliente o política, vacío frente a cliente ausente y configuración independiente de la conexión. Ejecuta los controles globales secuencialmente y conserva fallos y correcciones.

**Criterio de aceptación.** Respalda el cierre con resultados reales y límites explícitos. No incorpores UI, FX, endpoints administrativos o aceptación humana anticipada.
