# Aclaraciones 007

Las decisiones siguientes fueron confirmadas expresamente por Alex antes de adaptar la spec. Se registran aquí por autorización documental; sin implementación ni registro en ai-workspace.

| ID            | Decisión confirmada                                      | Consecuencia                                                                                                                                         |
| ------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 007-C01 / D07 | Navegación superior, sin sidebar                         | Cabecera y breadcrumbs; coincide con las cuatro pantallas del PDF revisado.                                                                          |
| 007-C02       | CSS Modules + tokens.css global + global.css pequeño     | Estilos locales, variables semánticas compartidas; sin Tailwind.                                                                                     |
| 007-C03       | PDF como referencia, tema claro y fuente del sistema     | Fondo claro, tarjetas blancas, azul de acciones; adaptar móvil/accesibilidad, sin fuente descargada ni tema oscuro.                                  |
| 007-C04       | Historial paginado EUR dentro de ficha                   | Usar snapshots/importes de 005; omitir «Nueva simulación» y «Ver detalle».                                                                           |
| 007-C05       | Omitir «Última simulación» del listado                   | Sin ampliar contrato backend ni una petición adicional por cliente.                                                                                  |
| 007-C06       | Selector de países desde configuración vigente           | Actual ES/FR/DE/GB; obtener códigos de ratesByCountry, no de una lista de tarifas duplicada.                                                         |
| 007-C07       | Planes existentes con etiquetas demo                     | DEMO_BASIC «Básico (demo)»; DEMO_PRO «Profesional (demo)». Sin prestaciones ni diferencia tarifaria inventadas.                                      |
| 007-C08       | React Router autorizado                                  | Dependencia de navegación para rutas, enlaces directos y atrás/adelante; instalar solo en tarea autorizada.                                          |
| 007-C09       | /api con proxy Vite en desarrollo                        | Reenviar a http://127.0.0.1:3000 quitando /api; no añadir CORS a Express. Producción deberá resolver ese prefijo por su propia configuración futura. |
| 007-C10       | Vitest, React Testing Library y Playwright autorizados   | Dependencias de desarrollo, con utilidades de interacción/DOM; sin tocar datos existentes.                                                           |
| 007-C11       | Páginas de 20, debounce 250 ms y estado en URL           | Reiniciar página al buscar; restaurar listado al regresar desde ficha/alta.                                                                          |
| 007-C12       | Formato compartido, fiscal backend y recuperación segura | Conservar campos con 422/409/503, bloquear doble envío, no reenviar POST incierto automáticamente; cancelar vuelve al listado contextual.            |

## Fuentes y D12

interfaces.pdf se revisó visualmente en sus cuatro páginas desde `C:/Users/alope/Desktop/roams/interfaces.pdf`. Está fuera del repositorio; no se ha copiado. D12 queda resuelta para la disponibilidad/revisión de esta referencia visual, no para la revisión de todo el material oficial de la prueba técnica. No afirmar que se ha comparado un Word o enunciado no consultado.

El PDF contiene planes distintos del modelo real, una columna sin soporte de API y acciones de simulación aún inexistentes. Las adaptaciones C04/C05/C07 prevalecen sobre esos ejemplos. La cuarta pantalla sirve de contexto, no amplía 007 al simulador.

## Arquitectura existente que se conserva

Los planes se obtienen de shared, no de GET /billing-config. El backend conserva validación fiscal y autoridad de datos; las simulaciones históricas no se recalculan ni convierten. Sin nuevos endpoints, migraciones, tarifas, dependencias UI o servicios externos en 007.

## Estado y autorización

No quedan decisiones funcionales imprescindibles abiertas para este alcance. En cada implementación comprobar compatibilidad real de versiones, respetar dependencias autorizadas y consultar cualquier ampliación fuera de estas decisiones. Las versiones concretas y configuración de herramientas se verificarán antes de instalar, no se presentan como ya instaladas.

Alex autoriza ahora consolidar solo los cinco documentos de 007. T01–T05 requieren indicación posterior; sin commits/pushes, datos reales, despliegue, aceptación humana final ni registros ai-workspace. Contexto global se actualizará al iniciar implementación autorizada, sin modificarlo en esta preparación.
