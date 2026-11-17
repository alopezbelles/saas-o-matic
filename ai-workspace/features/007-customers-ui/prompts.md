# 007 Customers UI — Prompts consolidados

## 1. Traducir la referencia visual a una base reutilizable

**Contexto y objetivo.** La API existe; prepara navegación y estilos para las pantallas de clientes antes de integrar sus operaciones.

**Instrucciones.** Aplica navegación superior, breadcrumbs, tema claro y fuente del sistema. Centraliza variables semánticas en tokens, limita los estilos globales y usa CSS Modules. Adapta el PDF a los datos y acciones aprobados, sin inventar planes o funcionalidades. Comprueba compatibilidad antes de instalar las herramientas autorizadas.

**Criterio de aceptación.** Verifica rutas directas, teclado, foco y reflujo móvil. Distingue el shell preparado de las pantallas todavía sin operaciones reales.

## 2. Conectar listado, búsqueda y navegación contextual

**Contexto y objetivo.** Sustituye estados provisionales por datos reales sin mezclar transporte y presentación.

**Instrucciones.** Valida respuestas en adaptadores y configura el proxy de desarrollo acordado. Integra búsqueda con debounce y páginas en URL, conservando el contexto al entrar y volver. Cancela consultas obsoletas e impide que respuestas tardías alteren el resultado vigente. Distingue carga, vacío, búsqueda sin coincidencias y error recuperable.

**Criterio de aceptación.** Prueba cambios rápidos, atrás/adelante, recarga y recuperación. No amplíes el backend para completar columnas de la maqueta.

## 3. Implementar alta y ficha con datos autoritativos

**Contexto y objetivo.** Completa el recorrido de registro y consulta con los contratos existentes.

**Instrucciones.** Reutiliza formato compartido, planes reales y países de configuración. Conserva campos ante errores, bloquea doble envío y explica resultados inciertos sin repetir POST automáticamente. Navega a la ficha usando la respuesta validada. Carga cliente e historial de forma independiente y presenta los importes EUR guardados sin recalcular ni convertirlos.

**Criterio de aceptación.** Cubre validación fiscal devuelta por backend, duplicados, indisponibilidad, historial vacío y fallido, y retorno contextual. Separa formulario, estado y adaptadores; extrae componentes solo cuando tengan responsabilidad real.

## 4. Revisar interacción, responsive y accesibilidad

**Contexto y objetivo.** Comprueba el recorrido completo y corrige problemas observables de uso y presentación.

**Instrucciones.** Ejecuta pruebas de componentes y E2E contra recursos temporales propios. Revisa cuatro anchos, reflujo ampliado, teclado, foco y contraste renderizado. Aplica los ajustes visuales solicitados sin eliminar indicadores de teclado en controles. Registra fallos iniciales y repeticiones, separando defectos de producto de errores del harness.

**Criterio de aceptación.** Respalda las correcciones con regresiones y controles globales. Declara los límites de zoom y accesibilidad comprobados; no atribuyas aceptación humana ni incorpores el simulador de otra spec.
