# SIGECOIM 🎻🎺
### Sistema de Información para la Gestión Administrativa del Comodato de Instrumentos Musicales
*Desarrollado para el Núcleo de la Sinfónica Infantil*

---

## 📋 Descripción General del Proyecto

**SIGECOIM** es una plataforma web integral diseñada para digitalizar, organizar y controlar el inventario de instrumentos musicales y el registro de contratos de comodato (préstamos gratuitos) otorgados a los integrantes de la institución musical. 

El sistema reemplaza las hojas de cálculo tradicionales y los registros físicos en papel por un panel administrativo ágil, previniendo la pérdida de activos de la institución y garantizando la trazabilidad de cada instrumento entregado a un niño, niña o adolescente bajo la responsabilidad de su representante legal (comodatario).

---

## 🚀 Guía de Inicio Rápido (Cómo arrancar el proyecto)

Sigue estos sencillos pasos para instalar y ejecutar el sistema en cualquier computadora:

### Prerrequisitos:
1. Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
2. Tener instalado [XAMPP](https://www.apachefriends.org/) (para el servidor de base de datos MySQL).
3. Instalar el gestor de paquetes **pnpm** de forma global (ejecuta en tu terminal: `npm install -g pnpm`).

---

### Paso 1: Configurar la Base de Datos (XAMPP)
1. Abre el panel de control de **XAMPP** e inicia los servicios de **Apache** y **MySQL**.
2. Entra a [http://localhost/phpmyadmin](http://localhost/phpmyadmin) en tu navegador.
3. Crea una nueva base de datos llamada `sigecoim_db` (con cotejamiento por defecto, ej: `utf8mb4_general_ci`).

---

### Paso 2: Configurar y Arrancar el Backend (Servidor)
1. Abre una terminal en la carpeta raíz del proyecto (`SIGECOIM`).
2. Asegúrate de tener configurado tu archivo `.env` en la raíz (puedes crear uno basado en la siguiente configuración):
   ```env
   PORT=3003
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=sigecoim_db
   JWT_SECRET=tu_clave_secreta_jwt
   ```
3. Instala las dependencias del servidor:
   ```bash
   pnpm install
   ```
4. **Inicializar la estructura de datos** (ejecuta este comando una sola vez para crear las tablas y sembrar datos de prueba):
   ```bash
   node src/models/sync.js
   ```
5. Enciende el servidor en modo desarrollo:
   ```bash
   pnpm dev
   ```
   *(El servidor estará corriendo en `http://localhost:3003`)*

---

### Paso 3: Configurar y Arrancar el Frontend (Cliente)
1. Abre una **nueva terminal** e ingresa a la carpeta del cliente:
   ```bash
   cd client
   ```
2. Instala las dependencias del frontend:
   ```bash
   pnpm install
   ```
3. Inicia la aplicación en modo desarrollo:
   ```bash
   pnpm dev
   ```
   *(La aplicación web estará disponible en `http://localhost:5173`)*

---

### 🔑 Credenciales de Acceso por Defecto:
*   **Usuario:** `admin@sigecoim.com`
*   **Contraseña:** `admin123`

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
| **Ver / Administrar Estudiantes** | Sí | Sí |
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

### 3. Gestión de Estudiantes (Censo)
*   **Propósito:** Administrar el listado de alumnos inscritos en el núcleo que pueden ser beneficiarios de préstamos.
*   **Funcionalidades:**
    *   **CRUD de Estudiantes:** Registro, edición, tabla y eliminación.
    *   **Cédula Requerida:** Campo de identificación obligatorio del estudiante.
    *   **Lógica Inteligente de Edad:** Al registrar su fecha de nacimiento mediante el calendario institucional `Calendario.jsx` (SEMI), el sistema calcula su edad en tiempo real.
    *   **Representantes Dinámicos:** Si el alumno es **menor de edad** (< 18 años), se despliega de forma obligatoria el formulario para registrar/asociar a su Representante Legal. El sistema busca por Cédula si dicho representante ya existe en base de datos para no duplicarlo, enlazándolo de forma transparente. Si el estudiante es **mayor de edad**, el representante no es requerido y el estudiante firma bajo su propia responsabilidad.

### 4. Gestión de Comodatos (Préstamos)
*   **Propósito:** Control de los contratos activos de préstamo de instrumentos.
*   **Funcionalidades:**
    *   **Registro de Comodato:** Vincula a un estudiante con un instrumento disponible y define una fecha prevista de devolución.
    *   **Caja de Confirmación en Tiempo Real:** Al seleccionar el estudiante beneficiario, el formulario calcula su edad en el momento y despliega los datos del representante legal encargado (si es menor) o confirma que es mayor de edad.
    *   **Bloqueo Preventivo:** El formulario solo despliega la lista de instrumentos que se encuentran actualmente en estado `Disponible`.
    *   **Edición Dinámica:** Permite modificar fechas, estudiantes o instrumentos asignados en caso de cambios de cátedra.
    *   **Borrado Lógico y Físico:** Si se elimina un comodato que estaba activo, el sistema libera automáticamente el instrumento asociado volviendo su estado a `Disponible`.

### 5. Retorno de Instrumentos (Devoluciones)
*   **Propósito:** Registrar el reingreso de los bienes a la institución.
*   **Funcionalidades:**
    *   Al hacer clic en "Devolución" en un préstamo activo, se abre un formulario para registrar el estado físico de retorno del instrumento.
    *   Al confirmar la entrega, el comodato pasa a estado `DEVUELTO` y el instrumento musical se reincorpora automáticamente al inventario en estado `Disponible` con la nueva condición física reportada.

### 6. Administración de Usuarios (Exclusivo para el Analista de Bienes)
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
    *   Al ingresar a la URL del túnel del frontend (ej: `https://g27frlv5-5173.use2.devtunnels.ms`), el sistema enrutará las peticiones a la API del túnel del backend (`https://g27frlv5-3003.use2.devtunnels.ms/api`) sin generar bloqueos de seguridad.

---

## 📁 Estructura del Código y Carpetas

A continuación se detalla la organización de los directorios tanto en el servidor (Backend) como en la aplicación del cliente (Frontend):

### 1. Servidor (Backend)
En la carpeta raíz del proyecto, el código se agrupa dentro del directorio `src/`:
*   `src/config/`: Contiene la configuración de conexión a la base de datos MySQL mediante Sequelize ORM (`db.js`).
*   `src/middleware/`: Middlewares globales de Express. Destaca `auth.js` que se encarga de descifrar y validar los tokens JWT enviados desde el frontend para proteger las rutas privadas.
*   `src/models/`: Definición de los modelos de base de datos relacionales con Sequelize:
    *   `Usuario.js`: Credenciales y roles.
    *   `Representante.js`: Datos del representante comodatario.
    *   `Estudiante.js`: Datos del estudiante beneficiario.
    *   `Instrumento.js`: Inventario y disponibilidad de instrumentos.
    *   `Comodato.js`: Contratos de préstamo activos e históricos.
    *   `Devolucion.js`: Control del retorno físico de instrumentos.
    *   `index.js`: Define y exporta todas las asociaciones de base de datos (uno a muchos, uno a uno).
    *   `sync.js`: Script ejecutable independiente para inicializar tablas y sembrar datos de prueba.
*   `src/controllers/`: Contiene la lógica del negocio que interactúa con la base de datos y resuelve las peticiones HTTP de los endpoints (e.g., `comodatoController.js`, `estudianteController.js`).
*   `src/routes/`: Enrutadores de Express que exponen los endpoints y los vinculan a sus respectivos controladores (e.g., `estudianteRoutes.js`).
*   `server.js`: El archivo de arranque principal en la raíz que inicializa Express, configura los middlewares de seguridad CORS y las cabeceras, y enciende el listener del servidor.

### 2. Cliente (Frontend)
El código de la aplicación de React se encuentra agrupado en la carpeta `client/src/`:
*   `client/src/assets/`: Contiene recursos multimedia, logos e imágenes estáticas del sistema (`Logo1.jpeg`, `Logo2.jpeg`).
*   `client/src/components/`: Componentes modulares y reutilizables de React:
    *   `Calendario.jsx` (SEMI): Calendario interactivo personalizado utilizado como selector de fechas en formularios.
    *   `Topbar.jsx`: Barra superior con el perfil del usuario y el botón de cierre de sesión.
    *   `Sidebar.jsx`: Menú lateral interactivo con acceso a las vistas de acuerdo a los roles de usuario.
    *   `DrawPanel.jsx`: Contenedor flotante lateral que desliza los formularios de creación/edición.
    *   `ConfirmDialog.jsx`: Ventanas modales para confirmar acciones críticas de borrado.
    *   `ComodatoForm.jsx`, `EstudianteForm.jsx`, `InstrumentoDialog.jsx`, `UsuarioForm.jsx`: Formularios especializados de entrada de datos.
    *   `ComodatoTable.jsx`, `EstudianteTable.jsx`, `InstrumentoTable.jsx`, `UsuarioTable.jsx`: Tablas interactivas que renderizan y ordenan la información de la base de datos.
*   `client/src/pages/`: Páginas completas del sistema que orquestan los componentes y consumen la API (e.g., `Login.jsx`, `Estudiantes.jsx`, `Comodatos.jsx`).
*   `client/src/services/`: Configuración del cliente HTTP Axios (`api.js`) encargado de establecer la URL base y adjuntar de forma dinámica los headers de autorización JWT para las llamadas al backend.
*   `client/src/theme/`: Configuración del tema visual de Material UI (colores corporativos de la Sinfónica, tipografías y estilos generales).
*   `client/src/App.jsx`: Componente principal que orquesta el enrutamiento interno de las páginas del panel y la validación de la sesión activa del usuario.
