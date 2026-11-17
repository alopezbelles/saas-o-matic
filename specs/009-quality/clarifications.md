# Aclaraciones 009

Preparación adaptada al estado posterior a 008. La instrucción actual autoriza el análisis y los cinco documentos. La ejecución será incremental por tarea.

## Decisiones heredadas

| Tema               | Resolución vigente y fuente                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Diseño/navegación  | Navegación superior, breadcrumbs, CSS Modules/tokens, fuente del sistema y referencia PDF adaptada, confirmados en 007–008 |
| Flujos             | Listado/alta/ficha/historial y ruta /customers/:id/simulations/new existentes                                              |
| Dinero/histórico   | Motor compartido, servidor autoritativo, céntimos EUR persistidos, versiones/snapshots y FX solo de total                  |
| Errores y guardado | Contratos 003/005/007/008, conservación de campos, envío único y comprobación ante resultado incierto                      |
| Pruebas            | node:test, Vitest/RTL y Playwright/Chromium instalados, con DB/puertos temporales y proveedor FX controlado                |
| Evidencias         | Cierre técnico separado de aceptación humana, sin resultados inventados                                                    |

Fuentes canónicas, [decisiones](../../docs/decisions.md), [007](../007-customers-ui/clarifications.md), [008](../008-simulator-ui/clarifications.md) y [testing](../../docs/testing.md).

D07 de la plantilla se retira como duda abierta. La elección de navegación y estilos ya se confirmó y se implementó. 009 revisa ese diseño.

## Fuentes y límites

D12 recogía la ausencia del enunciado completo. Alex lo ha aportado y se ha consultado Prueba Devs con IA.pdf en C:/Users/alope/Desktop/roams/Prueba Devs con IA.pdf. La fuente está disponible para el cotejo. docs/requirements.md sigue recogiendo infraestructura y no contiene R15/R17/N06/N07. La matriz identificará apartados y requisitos reales del PDF.

interfaces.pdf fue aportado por Alex y usado como referencia visual en 007–008. No se infiere de ese PDF una autorización para funcionalidades descartadas, nuevos menús o «Ver detalle».

El cotejo del PDF confirma el alcance funcional de 001–008. La matriz técnica de 009 distinguirá sus comprobaciones de los entregables que se cerrarán en 010.

## Decisiones confirmadas de 009

| ID      | Decisión                                                                                                                            | Estado                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 009-C01 | Revisión básica de seguridad sobre entradas, SQL parametrizado, límites de peticiones, errores/logs, secretos y datos enviados a FX | Confirmada por Alex                        |
| 009-C02 | Chromium, anchos 320/390/768/1440, teclado, foco, contraste y ampliación, con límites de comprobación explícitos                    | Confirmada por Alex                        |
| 009-C03 | Comprobación puntual del simulador con proveedor FX real y CORS, además de la suite automatizada con fixtures                       | Confirmada por Alex                        |
| 009-C04 | Calidad y matriz técnica en 009. README definitivo, índice de auditoría, checkout limpio y preparación de publicación en 010        | Confirmada por Alex al separar ambas specs |

La comprobación de checkout limpio propuesta inicialmente queda asignada a 010-T03. En 009 se conserva la revisión de seguridad básica y se reportarán los resultados reales del proveedor, incluidas limitaciones externas. Una ampliación de navegadores o un cambio de proveedor/proxy requerirá decisión específica si surge esa necesidad.

## Confirmaciones antes de implementar

No se identifican nuevas decisiones imprescindibles de tecnología, navegación, precios, contratos o herramientas para el alcance adaptado.

Alex indicará la tarea que quiere ejecutar. Si durante la auditoría aparece una corrección que necesita nuevas reglas, dependencias, servicios o cambios de arquitectura, se presentará esa decisión concreta antes del trabajo dependiente. No se deduce autorización de implementación de esta preparación.

La aceptación humana final sigue pendiente hasta revisión expresa de Alex. La instrucción de mantener ai-workspace excluido continúa vigente.
