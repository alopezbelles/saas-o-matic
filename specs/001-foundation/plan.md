# Plan 001 — Base del proyecto y controles

## Revisión editorial del registro

Base documental de referencia: 3f3265a. Revisión de los once archivos acordados de 001 para explicar necesidades, decisiones, dirección de la IA y verificación. Mantener la secuencia real (inicialización anterior a la spec formal), procedencia retrospectiva, identificadores de requisitos/casos y resultados históricos. No cambiar código ni atribuir instrucciones posteriores como prompts originales. La comprobación actual se limita a documentos/anclas y formato, separada de la validación de infraestructura.

## Estrategia de cierre de la infraestructura

Reutilizar el monorepo pnpm ya disponible y su lockfile, con Node 22, TypeScript estricto y ESM. Primero contrastar spec/tareas con archivos y scripts; después corregir solo las discrepancias y controles pendientes. Esta secuencia explica la conciliación con la base existente, no un plan íntegramente anterior al scaffolding.

| Decisión                               | Necesidad que resuelve                                                        | Directriz para la implementación                                              |
| -------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Mantener stack y workspaces            | Evitar rehacer infraestructura válida por una plantilla incompatible          | Conciliar documentación con pnpm/Node 22; sin migración o dependencias nuevas |
| Separar createApp y listen             | Probar HTTP sin ocupar el puerto de desarrollo o arrancar procesos personales | Factoría de aplicación y arranque/configuración independientes                |
| Usar node:test y fetch                 | Verificar la base con herramientas disponibles                                | Peticiones HTTP reales, códigos de salida y puertos efímeros                  |
| Probar fallos de los controles         | Comprobar que una ejecución correcta no oculta un gate ineficaz               | Fixtures negativos temporales y limpieza en finally                           |
| Preparar shared sin negocio anticipado | Mantener una ubicación futura de contratos sin inventar requisitos            | No añadir dominio, ORM, modelos o capas vacías                                |

Motivos, alternativas documentadas y consecuencias en [ADR-001](../../ai-workspace/decisions/ADR-001-monorepo.md).

## Responsabilidades y límites de los módulos

| Ubicación                           | Responsabilidad en 001                               | Límite                                                     |
| ----------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| Raíz                                | Workspaces, scripts/calidad, lockfile y README       | Instalación/ejecución coordinadas, no lógica de producto   |
| apps/api/src/app.ts                 | Crear Express y exponer health                       | Sin apertura del puerto del proceso                        |
| apps/api/src/index.ts               | Configurar PORT y arrancar servidor                  | Validación de arranque y cierre de recursos                |
| apps/api/test                       | Comprobar contrato HTTP y arranque                   | Puertos propios y resultados observables                   |
| apps/web/test                       | Comprobar artefactos del build mediante Vite preview | Smoke HTTP, no interacción de navegador                    |
| packages/shared                     | Punto de extensión del workspace                     | Sin contratos de negocio implementados en esta entrega     |
| test                                | Controles negativos y verificación documental        | No sustituir cobertura por scripts vacíos                  |
| docs, MEMORY, AGENTS y ai-workspace | Contexto, restricciones, decisiones y evidencia      | Distinguir estado técnico, procedencia y aceptación humana |

## Secuencia y controles de decisión

1. **Diagnóstico:** contrastar requisitos/stack con lo existente y separar cobertura de huecos. No implementar durante la fase de análisis.
2. **Conciliación:** conservar workspaces y scripts válidos; corregir discrepancias de documentación y separar aplicación/servidor donde lo exijan las pruebas.
3. **Comprobación:** añadir API-01/WEB-01/GATE-01 sin negocio o dependencias anticipadas. Registrar incidencias y repetir los casos afectados tras corregirlas.
4. **Contexto:** integrar spec activa, límites e índice; DOC-01 verifica enlaces y comandos.
5. **Cierre:** ejecutar instalación, calidad y arranque; relacionar requisito→caso→resultado y declarar límites de entorno/evidencia.

## Correspondencia de verificación

| Caso    | Comportamiento comprobado                                    | RF / tarea        |
| ------- | ------------------------------------------------------------ | ----------------- |
| ENV-01  | Instalación congelada, build, arranque conjunto y health     | RF1 / T01–T02     |
| API-01  | Health JSON 200, 404 esperados y errores de PORT             | RF1/RF2 / T02–T03 |
| WEB-01  | HTML compilado y bundle disponibles por HTTP                 | RF2 / T03         |
| GATE-01 | Errores deliberados de tipos, lint y tests devuelven no cero | RF2 / T03         |
| DOC-01  | Enlaces, contexto activo y scripts existentes                | RF3/RF4 / T04     |
| Cierre  | Comandos, incidencias y límites trazados                     | RF1–RF4 / T05     |

El contrato mínimo se resume en [spec](spec.md); comandos y resultados de aquella ejecución están en [validación](validation.md). Las pruebas de ruta con espacios, runtime Node alternativo, instalación en otro equipo o navegador se consideran únicamente si existe ejecución registrada, sin deducirlas de los controles anteriores.
