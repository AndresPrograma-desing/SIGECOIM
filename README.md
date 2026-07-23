# SIGECOIM 🎻🎺
### Sistema de Información para la Gestión Administrativa del Comodato de Instrumentos Musicales
*Desarrollado para el Núcleo de la Sinfónica Infantil*

---

## 📋 Descripción General del Proyecto

**SIGECOIM** es una plataforma web integral diseñada para digitalizar, organizar y controlar el inventario de instrumentos musicales y el registro de contratos de comodato (préstamos gratuitos) otorgados a los integrantes de la institución musical. 

El sistema reemplaza las hojas de cálculo tradicionales y los registros físicos en papel por un panel administrativo ágil, previniendo la pérdida de activos de la institución y garantizando la trazabilidad de cada instrumento entregado a un niño, niña o adolescente bajo la responsabilidad de su representante legal (comodatario).

---

## 🔑 Conceptos Clave del Sistema

*   **Comodato (Préstamo):** Contrato legal mediante el cual la institución entrega un instrumento musical a un estudiante en calidad de préstamo de uso gratuito.
*   **Correlativo de Contrato (anteriormente Folio):** Código alfanumérico único (ej: `COM-2026-001`) asignado a cada contrato físico firmado. Sirve para archivar y auditar los documentos.
*   **Código de Inventario:** Identificador único y físico de la institución grabado en cada instrumento (ej: un código de control interno de bienes nacionales).
*   **Comodatario:** El representante legal (madre, padre o tutor mayor de edad) quien firma el comodato y asume la responsabilidad civil por la conservación del instrumento.

---

## 👥 Roles de Acceso y Permisos

El sistema implementa un control de acceso basado en roles para delimitar las acciones administrativas de acuerdo con la responsabilidad del personal:

| Módulo / Acción | Analista de Bienes (Administrador) | Coordinador (Operador) |
| :--- | :---: | :---: |
| **Inicio de Sesión** | Sí | Sí |
| **Ver Inventario de Instrumentos** | Sí | Sí |
| **Registrar / Editar Instrumento** | Sí | Sí |
| **Eliminar Instrumento del Inventario** | Sí | Sí |
| **Ver Historial de Comodatos (Préstamos)** | Sí | Sí |
| **Registrar / Editar Comodatos Activos** | Sí | Sí |
| **Procesar Devolución (Liberar Instrumento)** | Sí | Sí |
| **Eliminar Comodato del Historial** | Sí | Sí |
| **Administración de Usuarios (CRUD)** | **Sí** | **No** |

---

## 📦 Módulos Principales del Sistema

### 1. Control de Acceso (Login)
*   **Propósito:** Garantizar que únicamente el personal autorizado tenga acceso al inventario y los comodatos.
*   **Funcionalidades:**
    *   Formulario estético con el logotipo oficial de la institución.
    *   Doble factor visual en la contraseña: un botón de ojo interactivo que permite alternar la visibilidad de la clave (ver/ocultar) para evitar errores de escritura.
    *   Persistencia de sesión segura mediante tokens JWT.

### 2. Inventario de Instrumentos
*   **Propósito:** Catálogo en tiempo real de todos los bienes instrumentales de la institución.
*   **Campos de Registro:**
    *   Nombre del instrumento (Violín, Violonchelo, Flauta, etc.).
    *   Marca y Modelo.
    *   **Medida:** Esencial para instrumentos de cuerdas (ej: 4/4, 3/4, 1/2) que varían según el tamaño del niño.
    *   **Color:** Representación visual mediante una paleta inteligente y Tooltip dinámico.
    *   Número de Serie físico del fabricante.
    *   Código de Inventario institucional (Bienes Nacionales).
    *   **Accesorios incluidos:** Registro de estuches, arcos, boquillas, etc.
    *   **Estado de Conservación:** Calificación física del activo (`Excelente`, `Bueno`, `Regular`, `Malo`).
    *   **Disponibilidad:** Estado operativo (`Disponible` para préstamo, `Prestado` en comodato, `En Mantenimiento` en luthería).
*   **Lógica de Negocio:** Un instrumento en estado `Prestado` no puede ser asignado a un nuevo comodato hasta que se registre su devolución.

### 3. Gestión de Comodatos (Préstamos)
*   **Propósito:** Control de los contratos activos de préstamo de instrumentos.
*   **Funcionalidades:**
    *   **Registro de Comodato:** Vincula a un estudiante (y su representante comodatario) con un instrumento disponible y define una fecha prevista de devolución.
    *   **Bloqueo Preventivo:** El formulario solo despliega la lista de instrumentos que se encuentran actualmente en estado `Disponible`.
    *   **Edición Dinámica:** Permite modificar fechas, estudiantes o instrumentos asignados en caso de cambios de cátedra.
    *   **Borrado Lógico y Físico:** Si se elimina un comodato que estaba activo, el sistema libera automáticamente el instrumento asociado volviendo su estado a `Disponible`.

### 4. Retorno de Instrumentos (Devoluciones)
*   **Propósito:** Registrar el reingreso de los bienes a la institución.
*   **Funcionalidades:**
    *   Al hacer clic en "Devolución" en un préstamo activo, se abre un formulario para registrar el estado físico de retorno del instrumento.
    *   Al confirmar la entrega, el comodato pasa a estado `DEVUELTO` y el instrumento musical se reincorporpora automáticamente al inventario en estado `Disponible` con la nueva condición física reportada.

### 5. Administración de Usuarios (Exclusivo para el Analista de Bienes)
*   **Propósito:** Crear y gestionar las credenciales de acceso para los analistas y coordinadores.
*   **Funcionalidades:**
    *   Creación, edición y deshabilitación de cuentas de usuario.
    *   Seguridad integrada: la contraseña al editar a un usuario es opcional (solo se actualiza si se escribe una nueva).
    *   Protección del sistema: impide la eliminación accidental de la cuenta de administrador principal.

---

## 🛠️ Arquitectura Tecnológica y Seguridad

*   **Backend (Servidor):**
    *   Desarrollado en **Node.js** con el framework **Express**.
    *   Base de datos relacional **MySQL** (administrada localmente vía XAMPP).
    *   Mapeo objeto-relacional mediante **Sequelize ORM** con sincronización automática (`alter: true`) para autogestionar la base de datos sin necesidad de scripts de migración manuales.
    *   Autenticación basada en **JSON Web Tokens (JWT)** y contraseñas encriptadas con **bcryptjs**.
*   **Frontend (Cliente):**
    *   Desarrollado con **React 19** y empaquetado ultra-rápido mediante **Vite**.
    *   Diseño visual premium implementado con **Material UI (MUI)**.
    *   Iconografía moderna mediante **Lucide Icons**.
    *   Cliente HTTP **Axios** con interceptores dinámicos de red.

---

## 📱 Guía de Pruebas Móviles y Red Local

El sistema incorpora un resolvedor dinámico en `api.js` y un middleware de CORS flexible en el backend para permitirte probar la aplicación en tu celular sin modificar el código:

1.  **Por Red Wi-Fi Local:**
    *   Conecta tu computadora y tu celular al mismo Wi-Fi.
    *   Abre el navegador de tu celular e ingresa a la IP local de tu PC en el puerto 5173 (ej: `http://192.168.1.15:5173`).
    *   El frontend autodetectará la IP y redirigirá las consultas de la API automáticamente al backend en `http://192.168.1.15:3003/api`.
2.  **Por Túneles de Desarrollo (Dev Tunnels):**
    *   Si utilizas Dev Tunnels, debes exponer tanto el puerto del frontend (`5173`) como el del backend (`3003`) en modo público.
    *   Al ingresar a la URL del túnel del frontend (ej: `https://g27frlv5-5173.use2.devtunnels.ms`), el sistema enrutará las pticiones a la API del túnel del backend (`https://g27frlv5-3003.use2.devtunnels.ms/api`) sin generar bloqueos de seguridad.
