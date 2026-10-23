# Cómo funciona SIGECOIM (vista de negocio)

Este documento explica el sistema pantalla por pantalla, en términos de qué hace y por qué, sin entrar en detalles técnicos. Está pensado para cualquier persona del equipo (no solo desarrolladores) que necesite entender el comportamiento esperado de la aplicación.

---

## 1. Login

Pantalla única de acceso con correo y contraseña propios del sistema (ya no depende de un proveedor externo). Solo el personal con cuenta activa puede entrar. Si la cuenta está desactivada o la contraseña es incorrecta, el acceso se rechaza con un mensaje genérico (no revela cuál de los dos datos falló).

Hay dos roles de staff:
- **Analista de Bienes**: acceso total, incluida la administración de usuarios.
- **Coordinador**: acceso a todo excepto a la gestión de cuentas de usuario.

---

## 2. Estudiantes

Censo de alumnos que pueden recibir instrumentos en préstamo.

- Cada estudiante tiene cédula, nombre, fecha de nacimiento, teléfono y dirección.
- **Si el estudiante es menor de edad** (calculado automáticamente a partir de la fecha de nacimiento), el sistema exige los datos de un **representante legal** (madre, padre o tutor). Si ese representante ya existe en la base de datos (se busca por cédula), se reutiliza en vez de duplicarlo.
- **Si el estudiante es mayor de edad**, no se pide representante: firma bajo su propia responsabilidad.
- No se puede eliminar a un estudiante que ya tiene comodatos (préstamos) registrados, para no perder el historial.
- Se puede buscar por nombre, apellido o cédula.

---

## 3. Instrumentos

Inventario físico de todos los instrumentos musicales de la institución.

**Datos de cada instrumento:** código de inventario (único), nombre, marca, modelo, número de serie (único), medida (ej. 4/4, 3/4 para instrumentos de cuerda), color, accesorios incluidos, **tipo** (clasificación como Violín, Flauta traversa, etc., elegida de una lista fija) y **ubicación física** (dónde está guardado, ej. "Depósito A, Estante 3").

**Dos estados independientes por instrumento:**
- **Estado de conservación**: Nuevo / Bueno / Regular / Malo — la condición física del bien.
- **Estado de disponibilidad**: Disponible / Prestado / En mantenimiento — si se puede prestar ahora mismo.

**Reglas de negocio:**
- No se puede eliminar un instrumento que está actualmente prestado.
- No se puede registrar dos instrumentos con el mismo código de inventario o el mismo número de serie.
- Un instrumento en estado de conservación **"Malo"** (requiere reparación) **no puede ser asignado** a un nuevo comodato, aunque figure como "Disponible" — queda bloqueado hasta que se repare y se le cambie el estado.

**Funciones adicionales de esta vista:**
- **Historial de ubicación**: cada vez que se cambia dónde está guardado un instrumento, el sistema deja constancia (ubicación anterior → nueva, fecha, quién lo hizo). Se puede consultar ese historial por instrumento.
- **Filtro por ubicación**: para localizar rápidamente los instrumentos guardados en un área específica.
- **Stock por tipo**: un panel resumen que muestra, para cada tipo de instrumento (Violín, Flauta, etc.), cuántos hay en cada estado de disponibilidad. Útil para saber de un vistazo "cuántos violines tenemos disponibles ahora".

> **Sobre la captura "Familia / Subfamilia"**: en el formulario de alta aparece un selector de familia (Cuerdas, Viento-Madera, Viento-Metal, Percusión) y subfamilia. Esto es solo una **ayuda visual** para elegir rápido el nombre correcto del instrumento desde una lista típica — no se guarda como dato propio, el dato que sí queda guardado es el **tipo**.

---

## 4. Comodatos (préstamos)

El corazón del sistema: gestiona el préstamo de un instrumento a un estudiante.

### Al registrar un préstamo nuevo
1. Se elige el estudiante. Si es menor de edad, el sistema muestra automáticamente los datos de su representante legal como aviso informativo.
2. Se elige el instrumento. **Solo aparecen en la lista los instrumentos disponibles y que no estén en estado "Malo"** (reparación) — el sistema no permite siquiera intentar asignar uno bloqueado.
3. Se define la fecha de inicio y la fecha prevista de devolución.
4. Se registra la **condición inicial** del instrumento (se precompleta con el estado de conservación actual, pero puede ajustarse) y observaciones sobre esa condición — esto sirve de respaldo si luego hay una disputa sobre el estado en que se entregó.
5. Al guardar, el instrumento pasa automáticamente a estado **"Prestado"**.

### Límite de préstamos por estudiante
**Un mismo estudiante solo puede tener 1 instrumento en comodato activo a la vez.** Si ya tiene un préstamo activo e intenta pedir otro, el sistema lo rechaza con un mensaje explicando que alcanzó el límite. Debe devolver el instrumento actual antes de poder solicitar uno nuevo. (Este límite es un valor fijo configurado en el sistema, no es ajustable desde la pantalla.)

### Vencimiento automático
Cada vez que se consulta la lista de comodatos, el sistema revisa: si un préstamo sigue "Activo" pero ya pasó su fecha de devolución prevista, lo marca automáticamente como **"Vencido"**. No hace falta ningún proceso manual para esto — ocurre solo, en el momento de consultar.

### Devolución
Al procesar la devolución de un préstamo activo:
- Se registra el estado físico en que vuelve el instrumento (Nuevo/Bueno/Regular/Malo) y observaciones.
- El comodato pasa a **"Finalizado"**.
- El instrumento vuelve a estado **"Disponible"**, actualizando su conservación real según lo que se reportó al recibirlo.

### Eliminar un comodato
Si se elimina un comodato que estaba activo, el instrumento asociado se libera automáticamente y vuelve a estar "Disponible".

### Filtros avanzados
Además del buscador rápido (por correlativo, estudiante o instrumento), hay un panel de filtros que permite acotar la lista por estudiante específico, instrumento específico, rango de fechas de devolución prevista, y estado (Activo/Finalizado/Vencido). Esto sirve para auditorías puntuales, por ejemplo "mostrame todos los vencidos entre tal y tal fecha".

### Exportar e imprimir
- **"Exportar PDF"**: genera un reporte tabular en PDF con todo el listado de comodatos que se está viendo en pantalla (respeta los filtros aplicados).
- **"Imprimir contrato"** (en cada fila): genera el contrato/acta individual de ese comodato en PDF, con los datos del instrumento, del estudiante, del representante legal (si aplica), las fechas y la condición inicial — listo para imprimir y firmar.

---

## 5. Alertas y Reportes (Dashboard)

Vista pensada para supervisión general (rol de Director de la Orquesta / gerencial), con dos bloques:

### Comodatos vencidos o por vencer
Lista los préstamos que ya vencieron o que vencen dentro de los próximos 30 días, mostrando: correlativo, estudiante, instrumento, **representante y su teléfono** (para poder contactarlo y recordarle la devolución), y la fecha prevista. Se distingue visualmente entre "Vencidos" (ya pasaron la fecha) y "Por vencer" (todavía a tiempo).

Esto no envía notificaciones automáticas (ni correo ni SMS) — es un listado de consulta que el personal revisa y usa para gestionar el contacto manualmente.

### Stock por tipo de instrumento
El mismo resumen agregado que se puede ver desde Instrumentos, mostrado aquí también para tener una vista consolidada sin tener que entrar a la pantalla de inventario.

---

## 6. Usuarios (solo Analista de Bienes)

Administración de las cuentas de acceso del personal:
- Crear, editar y desactivar cuentas.
- Al editar, la contraseña es opcional — si se deja en blanco, no cambia.
- No se puede eliminar la cuenta del administrador principal del sistema, como protección contra errores.
- Un usuario desactivado no puede iniciar sesión aunque conozca su contraseña.

---

## Resumen de reglas de negocio clave

| Regla | Dónde aplica |
|---|---|
| Un estudiante menor de edad necesita representante legal | Estudiantes, Comodatos |
| No se puede prestar un instrumento ya prestado | Comodatos |
| No se puede prestar un instrumento en estado "Malo" (requiere reparación) | Comodatos |
| Un estudiante solo puede tener **1** préstamo activo a la vez | Comodatos |
| Un préstamo vencido se detecta y marca solo, sin intervención manual | Comodatos |
| No se puede eliminar un instrumento prestado | Instrumentos |
| No se puede eliminar un estudiante con historial de comodatos | Estudiantes |
| No se puede eliminar la cuenta del administrador principal | Usuarios |
