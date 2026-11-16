# 007-T04 — Ficha e historial persistido

16 de noviembre de 2026. Base 010a716; Git inicial limpio. [Instrucción previa](../prompts/007-customers-ui.md#t04--instrucción-previa-de-implementación), [validación canónica](../../specs/007-customers-ui/validation.md#t04--ficha-e-historial-persistido).

## Controles ejecutados

Node 22.19.0/pnpm 10.33.4; Path de Node y herramientas locales habilitado. Comandos desde raíz:

| Comando                                             | Resultado real                                                                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| pnpm.cmd lint                                       | Código 0, sin errores/advertencias                                                                                                   |
| pnpm.cmd typecheck                                  | Código 0 tras corregir harness con pathname posiblemente undefined                                                                   |
| pnpm.cmd build                                      | Código 0, ambas aplicaciones                                                                                                         |
| pnpm.cmd --filter @saas-o-matic/web test:components | Primera ampliación 85 correctas/1 fallo del harness; repetición 86/86                                                                |
| pnpm.cmd test                                       | Código 0: 36 shared + 12 API unitarias + 49 integración + 22 node web + 86 componentes/transporte + 1 gates + 2 docs = 208 correctas |

[Salida global real](007-customers-ui-t04.txt), [primera ejecución de componentes](007-customers-ui-t04-components-initial.txt). Gates secuencial sin otros controles de código concurrentes. No sumar ejecuciones parciales al total global. Primer fallo: referencia a nav desmontado en carga; corregido el test consultando el nav vigente. Typecheck detectó undefined en pathname del harness; URL proporciona el tipo string y la repetición pasa. Sin atribuir éxito a esas ejecuciones iniciales.

## Casos y oráculos

WEB-DETAIL-API-01: ID antes de fetch, identidad de DTO/cliente, endpoints correctos, paginación, 19 variantes de filas inválidas, duplicados, snapshots/versiones históricas conservados y orden de API. Validación de coherencia aritmética de valores guardados; no se aplica política vigente. El fixture histórico 2468+123=2591 céntimos tiene versión/país/precios distintos de configuración actual. Formato EUR verifica 25,91 €, cero y máximo entero seguro sin perder céntimos.

WEB-DETAIL-01/WEB-STATE-01: tarjetas y país fuera de selector, ID inválido sin requests, 404, 503/reintento de cliente antes de historial, carga/fallo/reintento de historial sin borrar ficha, vacío/fuera de rango/query inválida, URL/páginas/atrás/retorno, respuesta tardía de cliente/página ignorada y aborto al desmontar. Los tests previos de búsqueda/alta siguen pasando tras compartir gestión GET y validación de páginas.

## Navegador real

Diagnóstico .cache/007-t04-browser.mjs con Chromium en .cache/playwright. API/Vite en puertos efímeros, DB de createTestContext con migración explícita y fixtures mediante repositorios existentes. Se comprueba ficha de cliente PT y 21 simulaciones históricas EUR, páginas 20/1, orden/recarga, fallo 503 independiente/reintento conservando tarjetas, retorno contextual, query inválida/restablecimiento, ID inválido/404 y creación→ficha completa/historial vacío.

Cuatro anchos 320/390/768/1440: scrollWidth igual al viewport y cero errores de página. [Salida real](007-customers-ui-t04-browser.txt), [capturas inspeccionadas](../visuals/007-customers-ui-t04.md). Temporales cerrados/limpiados con comprobación previa de ruta; no se abrió DB existente.

## Auditoría y límites

Cierre documental real: pnpm.cmd test:docs (2 pruebas), pnpm.cmd format:check y git diff --check correctos, código 0.

git diff --exit-code -- apps/api packages/shared/src pnpm-lock.yaml devuelve 0. .cache/002-tests vacío tras pruebas. Sin instalaciones, cambios de esquema, SQL nuevo, datos existentes o commits/pushes.

T05 conserva runner E2E mantenido, zoom 200%, contraste/teclado exhaustivos y revisión global. No afirmar aceptación humana, lector de pantalla o despliegue verificados por este smoke.
