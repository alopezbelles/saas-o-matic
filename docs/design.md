# Diseño funcional y visual

## Tokens

| Token                                                                                                                                                                                                                                                                                                                                                           | Valor propuesto | Uso                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------- |
| color.text.strong                                                                                                                                                                                                                                                                                                                                               | #172B4D         | Títulos                          |
| color.primary                                                                                                                                                                                                                                                                                                                                                   | #2463EB         | CTA, foco                        |
| color.canvas                                                                                                                                                                                                                                                                                                                                                    | #F5F7FA         | Fondo                            |
| color.surface                                                                                                                                                                                                                                                                                                                                                   | #FFFFFF         | Panel                            |
| color.success                                                                                                                                                                                                                                                                                                                                                   | #16856A         | Confirmación acompañada de texto |
| color.border                                                                                                                                                                                                                                                                                                                                                    | #DDE3EC         | Divisores                        |
| color.danger                                                                                                                                                                                                                                                                                                                                                    | #B42318         | Propuesta añadida para errores   |
| Inter 400/500/600/700; fallback system-ui. Verificar licencia/distribución de fuente antes de incorporarla; autoalojar al incorporarla. Tamaños 14–16 cuerpo, 28–32 título, 32–40 precio, cifras tabulares. Espaciado 4/8/12/16/24/32; radio panel 12, controles 8; altura controles 44. Contraste comprobar en pares reales, no asumir que token garantiza AA. |

## Análisis de referencias y decisiones

| Vista     | Estructura/contenido observado en extracción                        | Aplicación y corrección                                           |
| --------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Panel     | Clientes, buscador, contador, empresa/fiscal/país/plan/fecha/acción | Tabla desktop y cards móvil; CTA alta. No estadísticas inventadas |
| Alta      | Datos empresa, fiscal con error, email, país, plan, cancelar/crear  | Una página con secciones; errores junto a campos, no wizard       |
| Detalle   | Empresa, país/plan, cards corporativo/contacto e historial          | Cards responsive y tabla/lista; corregir datos inconsistentes     |
| Simulador | Slider, storage/API, moneda, desglose/resumen, volver/guardar       | Dos columnas desktop, una móvil; explicación metadatos sin coste  |

## Rutas propuestas

/customers; /customers/new; /customers/:id; /customers/:id/simulations/new. / redirige a /customers. 404 de frontend con enlace a clientes. Detalle de simulación individual y dashboard global de simulaciones no son necesarios; expandir fila de desglose es mejora opcional.

## Componentes

AppHeader, Breadcrumbs, PageContainer; Button, Field, Select, Alert, EmptyState, LoadingState; CustomerSearch, CustomerList, CustomerCard, CustomerForm; CustomerSummary, SimulationHistory, ConsumptionInputs, UserSlider, PricingBreakdown, CurrencySelector, SimulationSummary.
Crear abstracción solo al reutilizar; no “Design System” publicable. Semántica HTML nativa, input type=range accesible, label persistente e input numérico sincronizado.

## Estados y flujo

| Elemento        | Loading                                       | Empty                                                | Error                                 | Success                            |
| --------------- | --------------------------------------------- | ---------------------------------------------------- | ------------------------------------- | ---------------------------------- |
| Lista           | Esqueleto/aria-busy                           | Sin clientes o sin coincidencias, mensajes distintos | Reintentar sin perder q               | Resultados y contador              |
| Formulario      | Desactivar solo envío, “Creando…”             | Campos con etiquetas, no errores prematuros          | Inline + resumen enfocado             | Redirigir ficha y anuncio          |
| Ficha/historial | Cards de carga                                | Primera simulación CTA                               | 404 distinto de fallo red             | Historial por fecha/id descendente |
| Simulador       | Esperar cliente/config; EUR disponible sin FX | 0 usuarios válido                                    | Preservar inputs, explicar bloqueador | Guardado + nueva fila              |
| FX              | “Cargando cambio…”                            | Moneda no soportada explícita                        | EUR + aviso + reintentar              | Fecha/tasa y atribución            |

Debounce buscador 250ms propuesto con AbortController; ignorar respuestas anteriores. Preview local inmediato; aria-live polite solo resumen con moderación, no anuncio por cada tick de slider. Si backend devuelve precio distinto del preview, mostrar valor guardado y mensaje, no ocultarlo.
Doble clic no dispara otro POST mientras pending. Tras fallo de red incierto, no reintentar a ciegas; consultar historial antes de nuevo guardado.

## Responsive y accesibilidad

1440: dos columnas simulador, cards horizontales, contenido centrado. 768: reorganizar grid, tabla con scroll acotado y cabeceras. 390 y 320: una columna, cards/lista y CTA en flujo normal, sin desbordar página. No ocultar impuestos para ahorrar espacio.
Objetivo WCAG 2.2 AA: foco visible/no oculto, labels, errores con aria-describedby, teclado completo, zoom 200%, contraste 4.5:1 texto normal, 3:1 elementos no textuales relevantes. No depender de color ni hover. Iconos decorativos ocultos al lector; botones icon-only con nombre accesible. Sin modal innecesario.
Verificación prevista mediante teclado, RTL y Playwright, capturas reales cuando exista frontend; no hay capturas generadas ahora.
