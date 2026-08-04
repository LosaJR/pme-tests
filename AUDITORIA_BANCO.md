# Auditoría del banco de preguntas PME 2026

**Fecha de inicio:** 4 de agosto de 2026  
**Fecha de cierre de la versión:** 4 de agosto de 2026  
**Versión publicada:** `2026.08.04`

## Resultado

Se ha sustituido el banco inicial por un banco trazable formado por:

- **250 conceptos base revisados.**
- **1.000 formulaciones de pregunta.**
- **100 conceptos de parte común** y **150 de parte específica**.
- Cinco temas comunes y diez temas específicos, respetando la estructura de las bases.
- Cuatro alternativas por pregunta y una sola respuesta marcada como correcta.
- Explicación breve, comentario específico sobre las alternativas incorrectas, fuente oficial, referencia concreta y fecha de revisión.

**Huella SHA-256 del banco:** `00753e0039c015e59c7fb89d214d23f405817ff2494d084381c7b3e10181ee7d`

## Bloques completados

### Parte común

- [x] Tema 1. Constitución Española de 1978 — 20 conceptos
- [x] Tema 2. Gobierno y Administración — 20 conceptos
- [x] Tema 3. Régimen jurídico del personal público — 20 conceptos
- [x] Tema 4. Contrato de trabajo en la Administración — 20 conceptos
- [x] Tema 5. Igualdad, violencia de género, discapacidad, dependencia y no discriminación LGTBI — 20 conceptos

### Parte específica

- [x] Tema 1. Conductor, permisos, infracciones y sanciones — 15 conceptos
- [x] Tema 2. Vehículo, documentación, carga y personas — 15 conceptos
- [x] Tema 3. Seguridad activa y pasiva — 15 conceptos
- [x] Tema 4. La vía y su utilización — 15 conceptos
- [x] Tema 5. Velocidad y distancias — 15 conceptos
- [x] Tema 6. Maniobras — 15 conceptos
- [x] Tema 7. Conducción nocturna y condiciones adversas — 15 conceptos
- [x] Tema 8. Señalización — 15 conceptos
- [x] Tema 9. Accidentes, delitos, alcohol y drogas — 15 conceptos
- [x] Tema 10. Elementos y funcionamiento del vehículo — 15 conceptos

## Controles aplicados

- Encaje de cada concepto con un epígrafe de las bases oficiales.
- Consulta prioritaria de BOE, DGT, INSST y otros organismos públicos competentes.
- Referencia a artículo, anexo o apartado cuando la fuente lo permite.
- Revisión de las cuatro alternativas para reducir respuestas dobles o ambiguas.
- Exclusión del modo examen de cualquier registro sin estado `verificada`.
- Validaciones automáticas de estructura, identificadores, temas, cuatro opciones, única correcta, fuente, explicación y duplicados.
- Comprobación de que cada simulacro contiene exactamente 40 preguntas comunes y 60 específicas.
- Pruebas funcionales de puntuación, temporizador, histórico, corrección, estadísticas, repaso, cuaderno de errores y diseño móvil/escritorio.

## Funciones incorporadas

- Corrección razonada con respuesta elegida, respuesta correcta, explicación y fuente.
- Comentario de por qué la alternativa fallada no es válida.
- Modo examen oficial y modo estudio.
- Repaso de falladas y preguntas en blanco.
- Entrenamiento automático de puntos débiles.
- Estadísticas por tema y evolución de resultados.
- Marcado de respuesta segura, dudosa o desconocida.
- Cuaderno de errores con criterio de dominio tras tres aciertos posteriores.
- Tiempo empleado por pregunta.
- Botón de reporte con identificador único de la pregunta.
- Control de versión, fecha de revisión y huella del banco.

## Seguridad y mantenimiento

La versión anterior se conserva en la rama `backup-pre-audit-2026-08-04`. La web publicada comprueba la integridad del paquete antes de abrirlo. Cualquier corrección futura se realizará manteniendo la misma dirección web y aumentando la versión del banco.

La revisión y trazabilidad reducen de forma importante el riesgo de errores, pero no constituyen una garantía jurídica absoluta. Ante una modificación normativa posterior, prevalecen siempre las bases, el BOE y la publicación oficial vigente.
