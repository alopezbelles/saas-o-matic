# 007 Customers UI — Iteraciones del trabajo con IA

## Referencia visual y base de componentes

La preparación contrastó el PDF con los contratos disponibles. Se acordó omitir la última simulación del listado, conservar planes demo y diferir acciones de simulación. Codex creó shell, rutas, tokens y estilos locales; comprobó compatibilidad y fijó versiones de herramientas compatibles con Node existente, en lugar de instalar latest sin verificar.

La revisión detectó un breadcrumb incorrecto con barra final y añadió regresiones. Después, la dirección del proyecto pidió alinear «+ Nuevo cliente» con el título y retirar el contorno azul del encabezado al cargar. Se ajustó el layout y la presentación del foco programático, conservando el foco lógico y los indicadores de teclado de enlaces y controles. El [registro T01](../../testing/007-customers-ui-t01.md) conserva los controles de esa fase.

## Listado y alta conectados con la API

Codex incorporó adaptadores, proxy, búsqueda y paginación contextual, protegiendo el estado frente a respuestas antiguas. Una prueba inicial seleccionaba también un status del harness; se corrigió el selector y se repitió correctamente, sin alterar el comportamiento productivo por ese fallo.

El alta se separó en presentación, estado, países y transporte. Reutilizó contratos y mantuvo el control fiscal en backend. Las pruebas comprobaron conservación de campos, duplicidad y resultado incierto sin reenvío automático; el smoke real cubrió error fiscal, corrección y creación persistida. Las evidencias de [listado](../../testing/007-customers-ui-t02.md) y [alta](../../testing/007-customers-ui-t03.md) conservan los resultados.

## Ficha e historial con estados independientes

La ficha incorporó tarjetas e historial paginado sin recalcular el pasado. La extracción de gestión GET y validación de páginas evitó duplicación entre pantallas. Un test retenía un nav desmontado durante carga; se corrigió la consulta del elemento vigente. También se ajustó el harness de navegación tras un error de tipos.

Las pruebas posteriores verificaron historial fallido sin perder ficha, recuperación y retorno contextual con API/SQLite temporal. El [registro T04](../../testing/007-customers-ui-t04.md) conserva el alcance comprobado.

## Revisión final y correcciones de accesibilidad

La primera revisión ampliada encontró una expectativa incorrecta de foco del harness y contraste insuficiente en bordes de campos. Se corrigió la navegación de prueba y se separó el token de borde de control del decorativo. La repetición detectó un fallo real de foco al paginar historial: se añadió gestión compartida para enfocar el encabezado sin desplazar una selección posterior del usuario, con regresión específica.

Los controles globales y E2E finales pasaron. La [evidencia T05](../../testing/007-customers-ui-t05.md) y la [revisión](../../reviews/007-customers-ui-t05.md) distinguen los controles de cuatro anchos, contraste y reflujo equivalente al zoom de una auditoría exhaustiva. Los antiguos registros visuales ya no están disponibles; no se sustituyen por imágenes presentadas como evidencia histórica. No consta aceptación humana final y las funcionalidades posteriores del simulador no se atribuyen a 007.
