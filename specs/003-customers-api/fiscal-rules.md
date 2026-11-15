# D03 — Tabla de control adoptada

Contraste realizado antes del código fiscal, 14 de noviembre de 2026.

| Familia               | Formato                    | Control                                                  |
| --------------------- | -------------------------- | -------------------------------------------------------- |
| DNI                   | 8 dígitos y letra          | Resto módulo 23, tabla de Interior                       |
| NIE                   | X/Y/Z, 7 dígitos y letra   | Sustituir X/Y/Z por 0/1/2 y aplicar módulo 23            |
| K/L/M                 | Prefijo, 7 dígitos y letra | Módulo 23 sobre los siete dígitos, sin convertir prefijo |
| Entidades ABCDEFGHJUV | Prefijo y 7 dígitos        | Dígito                                                   |
| Entidades NPQRSW      | Prefijo y 7 dígitos        | Letra                                                    |

Fuentes primarias:

- [Interior](https://www.interior.gob.es/opencms/es/servicios-al-ciudadano/tramites-y-gestiones/dni/calculo-del-digito-de-control-del-nif-nie/): DNI y sustitución NIE.
- [Nota AEAT DIT, copia institucional CAIB](https://www.caib.es/sites/civitasmanualsisuport/f/41519), pp.4–6 y 9–10: clasificación de entidades, K/L/M y base numérica. Documento histórico de 2008, no servicio censal.
- [AEAT, entidades](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/guia-practica-cumplimentacion-modelo-censal-036/anexos/anexo-01-solicitud-nif-documentacion-aportar/informacion-sobre-numero-identificacion-fiscal/composicion-nif/personas-juridicas-entidades.html): composición actual.
- [Eustat, Fusión de registros, pp.24–25](https://es.eustat.eus/documentos/datos/CT_fusion_cas.pdf): para entidades, sumar dígitos pares y cifras de impares duplicados; complemento módulo 10; letras JABCDEFGHI. Se consultó texto indexado y se descargó PDF a caché.

Discrepancia: Eustat aplica control de entidades a K/L/M; se prioriza la nota del organismo emisor AEAT, que indica módulo 23 de personas físicas.
La descripción normativa de siete caracteres alfanuméricos es más amplia; este validador cubre la forma numérica verificable de la nota técnica, no promete soporte de formatos no documentados algorítmicamente.
No aceptar ambos controles de entidades por defecto, ni introducir reglas históricas de provincias.
Fuera: censo/identidad, VAT con prefijo ES y NIE antiguo de 10 caracteres; se exige forma canónica de 9 caracteres. Esas limitaciones se comunican expresamente.

Fixtures sintéticos de control: 12345678Z, 00000008P, X1234567L/Y1234567X/Z1234567R, K/L/M1234567L; entidades 1234567 con dígito 4 o letra D según familia.
Esperados fijados de forma independiente de la función productiva; no acreditan asignación real.
