# Manual de Identidad y Sistema de Diseño — RUVAR Bienes Raíces

Documento de referencia oficial y especificaciones de diseño para la plataforma web y panel de administración de **RUVAR Bienes Raíces**. Este documento define los estándares visuales, componentes de interfaz, paleta cromática, tipografía y lineamientos de experiencia de usuario para garantizar absoluta coherencia con la marca.

---

## 1. Identidad de Marca y Concepto

### 1.1 Propósito y Posicionamiento
**RUVAR Bienes Raíces** es una firma inmobiliaria de prestigio especializada en la comercialización, administración y desarrollo de propiedades de lujo, residencias exclusivas y proyectos de inversión inmobiliaria de alto nivel.

La identidad visual comunica:
- **Exclusividad y Distinción:** Estética sobria, arquitectura contemporánea y acabados impecables.
- **Solidez y Confianza:** Tonos azul marino profundo y pizarras arquitectónicas que transmiten autoridad y seguridad jurídica/financiera.
- **Claridad y Eficiencia:** Interfaces operativas limpias con navegación intuitiva, alto contraste de lectura y jerarquías inequívocas.

### 1.2 Logotipo y Monograma
El identificador de marca se compone de:
1. **Monograma Arquitectónico:** Representación geométrica de la letra **R** fusionada con la silueta de edificios y rascacielos contemporáneos:
   - **Torre izquierda:** Pilar vertical con remate angular a 45° que evoca visión y crecimiento vertical.
   - **Faceta interior:** Bloque biselado en gris pizarra que añade volumen tridimensional.
   - **Letra R:** Trazo principal con pierna diagonal y detalle angular en el vértice inferior derecho.
2. **Logotipo Tipográfico:** Denominación **RUVAR** en tipografía sans-serif geométrica extendida y personalizada.
3. **Submarca:** `— B I E N E S   R A I C E S —` con espaciado entre caracteres extendido (*letter-spacing* amplio) y filetes de delimitación simétricos.

#### Variantes de Aplicación del Logo:
- **Versión Fondo Claro (`/images/logo-transparent.png`):**
  - Aplicable en páginas públicas, documentos, encabezados claros y pantallas de inicio de sesión.
  - Colores: Azul marino corporativo (`#0B1A30`) y Gris pizarra arquitectónico (`#64748B`).
- **Versión Invertida / Fondo Oscuro (`/images/logo-white.png`):**
  - Aplicable en el lateral de navegación (*App Sidebar* oscuro), menús nocturnos y fondos oscuros.
  - Color: Blanco puro (`#FFFFFF`) con transparencia alfa preservada.

---

## 2. Paleta Cromática y Tokens de Color

El sistema utiliza una arquitectura de color de dos polos: **Superficies laterales oscuras** (*Dark Sidebar*) combinadas con **Lienzo principal claro** (*Light Content Canvas*), tal como se especifica en los requisitos del panel.

### 2.1 Colores Primarios y de Marca

| Token / Nombre | Valor HEX | OKLCH / RGB | Aplicación Principal |
| :--- | :--- | :--- | :--- |
| **Navy Midnight (Sidebar BG)** | `#070E1C` | `rgb(7, 14, 28)` | Fondo del menú lateral (*App Sidebar*). |
| **Navy Deep (Brand Primary)** | `#0B1A30` | `rgb(11, 26, 48)` | Botones de acción principal (+ Nueva Propiedad), títulos de secciones, logo. |
| **Navy Accent (Active State)** | `#131F37` | `rgb(19, 31, 55)` | Contenedor de elemento activo en el menú lateral (*Propiedades*). |
| **Navy Hover** | `#182643` | `rgb(24, 38, 67)` | Hover en elementos del sidebar y botones secundarios oscuros. |
| **Slate Gray (Brand Accent)** | `#64748B` | `rgb(100, 116, 139)` | Subtítulos de gestión, iconos inactivos, faceta arquitectónica del logo. |

### 2.2 Colores del Lienzo de Contenido (*Content Canvas*)

| Token / Nombre | Valor HEX | Aplicación Principal |
| :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` | Fondo general del área de trabajo del dashboard. |
| **Card / Surface White** | `#FFFFFF` | Contenedores de métricas (KPIs), tarjetas de filtros y tabla de datos. |
| **Border Neutral** | `#E2E8F0` | Líneas divisorias, bordes de tarjetas y campos de formulario. |
| **Border Dark Subtíl** | `rgba(255, 255, 255, 0.08)` | Separadores y divisores en el sidebar oscuro. |
| **Text Dark (Primary)** | `#0F172A` | Títulos principales, valores numéricos de KPIs, precios. |
| **Text Muted (Secondary)** | `#64748B` | Subtítulos en mayúsculas, etiquetas de estado, direcciones. |
| **Text Light (Sidebar)** | `#94A3B8` | Enlaces inactivos en el menú lateral. |
| **Text Active (Sidebar)** | `#FFFFFF` | Enlace activo en el menú lateral. |

### 2.3 Colores Semánticos y Funcionales

| Estado / Tipo | Color de Acento | Color de Fondo Suave | Uso en Dashboard |
| :--- | :--- | :--- | :--- |
| **En Venta / Crecimiento** | `#059669` (Esmeralda) | `#ECFDF5` | KPI "EN VENTA" (icono de tendencia), insignia de estado de venta. |
| **En Alquiler / Etiqueta** | `#2563EB` (Azul) | `#EFF6FF` | KPI "EN ALQUILER" (icono de etiqueta), insignia de alquiler. |
| **Obra Nueva / Promoción** | `#475569` (Pizarra) | `#F1F5F9` | KPI "OBRA NUEVA", insignias neutras. |
| **Alerta / Notificación** | `#F43F5E` (Rosa Intenso) | `#FFF1F2` | Punto indicador de notificaciones no leídas, alertas. |
| **Acción Destructiva** | `#DC2626` (Rojo) | `#FEF2F2` | Botón y confirmación de eliminación de propiedades. |

---

## 3. Tipografía y Jerarquía Visual

La familia tipográfica base del sistema es **Instrument Sans** (con degradación a fuentes sans-serif de sistema: Apple Color Emoji, Segoe UI, Roboto).

### 3.1 Escala Tipográfica y Usos

```
[30px - 36px] H1 Pantallas Públicas / Hero (Black 900, Mayúsculas)
    └── "RUVAR BIENES RAÍCES"

[24px - 28px] Título Principal de Sección (Black 900, Mayúsculas, Tracking -0.02em)
    └── "GESTIÓN DE PROPIEDADES"

[24px] Valores de Métricas / KPIs (Black 900)
    └── "6", "4", "2", "3"

[16px] Precios en Listados (Black 900 / ExtraBold 800)
    └── "€ 4.800.000", "€ 7500 / mes"

[14px] Nombre de Propiedad / Textos de Navegación (Bold 700 / Medium 500)
    └── "Villa Almara", "Refugio Cumbre", "Propiedades"

[12px] Subtítulos de Cabecera y Badges (SemiBold 600, Mayúsculas, Tracking +0.05em)
    └── "ADMINISTRA LOS LISTADOS DE VENTA Y ALQUILER DE BIENES RAÍCES PREMIUM"

[11px] Metadatos, Zonas Geográficas y Encabezados de Tabla (Bold 700, Mayúsculas, Tracking +0.08em)
    └── "COSTA MEDITERRÁNEA, MÁLAGA", "TOTAL PROPIEDADES", "IMAGEN", "PRECIO"
```

---

## 4. Estructura y Arquitectura del Layout

### 4.1 Principio Rector: Contraste Bipolar (Dark Sidebar + Light Canvas)
El diseño sigue estrictamente el patrón mostrado en la referencia visual:
1. **Sidebar Izquierdo (Fondo Oscuro `#070E1C`):**
   - Altura completa de la ventana (100vh), fijo a la izquierda.
   - Ancho estándar: `16rem` (256px), colapsable en modo icono `3.5rem` (56px).
   - Zona Superior: Logo de Ruvar en color blanco centrado con respiro superior/inferior.
   - Zona Media: Menú de navegación jerárquico. El elemento activo cuenta con contenedor redondeado `rounded-xl`, fondo `#131F37`, borde `#23334D` y texto blanco.
   - Grupo Desplegable "Usuarios": Submenú sangrado con enlaces a "Lista de Usuarios" y "Roles de Usuarios".
   - Zona Inferior:
     - Ficha de usuario: Avatar circular con iniciales del administrador (`CR` o `RV`), nombre completo y rol `ADMINISTRADOR` en mayúsculas pequeñas.
     - Botón de cierre de sesión: `[-> SALIR DEL PANEL` con icono de desconexión y método HTTP POST seguro.
2. **Barra Superior (*Header Bar*, Fondo Blanco `#FFFFFF`):**
   - Altura: `4rem` (64px), delimitada por borde inferior `#E2E8F0`.
   - Lado izquierdo: Botón disparador del sidebar (*SidebarTrigger*) + migas de pan (*Breadcrumbs*): `Escritorio / PROPIEDADES`.
   - Lado derecho:
     - Buscador global con bordes redondeados completos (*pill input*): "Buscar propiedades, clientes...".
     - Icono de notificaciones (*Bell*) con punto indicador rojo.
     - Icono de configuración (*Settings*).
     - Badge compacto de usuario con avatar de iniciales y nombre.
3. **Lienzo de Contenido (*Main Content Canvas*, Fondo `#F8FAFC`):**
   - Contenedor con padding amplio (`p-6 md:p-8`).
   - Cabecera con título de gestión y botón primario "+ Nueva Propiedad".
   - Fila de 4 tarjetas de resumen de métricas clave.
   - Barra de búsqueda y filtros combinados.
   - Tabla de datos premium.

---

## 5. Especificaciones de Componentes

### 5.1 Tarjetas de Métricas (KPI Cards)
- **Estructura:** Contenedor blanco con borde suave `border-slate-200/90`, radio `rounded-2xl` y sombra tenue `shadow-xs`.
- **Composición:**
  - Icono a la izquierda: Contenedor cuadrado `size-12 rounded-xl` con fondo temático suave (esmeralda, azul o pizarra).
  - Bloque textual a la derecha: Etiqueta superior en mayúsculas `text-[11px] font-bold tracking-wider text-slate-500` y cifra inferior en `text-2xl font-black text-slate-900`.

### 5.2 Barra de Filtros
- **Campo de Búsqueda:** Input con icono `Search` a la izquierda, borde `border-slate-200`, fondo `bg-slate-50` que cambia a `bg-white` en foco.
- **Selectores Desplegables:** Selects compactos estilizados con etiquetas superiores o laterales en mayúsculas (`TIPO:`, `PRESUPUESTO:`).

### 5.3 Tabla de Gestión de Propiedades
- **Contenedor:** Tarjeta blanca `rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs`.
- **Encabezado:** Fondo tenue `bg-slate-50/60`, texto en mayúsculas de 11px con tracking espaciado.
- **Filas:**
  - **IMAGEN:** Miniatura de 56x56px (`size-14`) con radio `rounded-xl`, borde sutil y efecto hover de ampliación (*zoom-in* suave).
  - **NOMBRE:** Nombre en negrita (`font-bold text-slate-900`) y subtítulo de zona geográfica en mayúsculas (`text-[11px] font-semibold text-slate-400`).
  - **PRECIO:** Cifra destacada en negro (`font-black text-slate-900`).
  - **TIPO:** Insignia pill redondeada (`rounded-lg px-3 py-1 text-xs font-semibold`). Gris pizarra para venta y azul para alquiler.
  - **DIRECCIÓN:** Icono `MapPin` gris seguido de la dirección física con truncamiento responsivo.
  - **ACCIONES:** Botones compactos con iconos `Eye` (detalles), `Pencil` (edición) y `Trash2` (eliminación) con feedback interactivo.

### 5.4 Formulario de Inicio de Sesión (*Login Page*)
- **Fondo:** Fondo claro `#F8FAFC` (o `#070E1C` en modo oscuro).
- **Tarjeta Central:** Contenedor `rounded-2xl border border-slate-200 bg-white p-8 shadow-sm max-w-sm`.
- **Logo:** Logotipo original de Ruvar centrado en cabecera de formulario.
- **Botón de Envío:** Azul marino sólido `#0B1A30` con texto "Iniciar Sesión en el Panel".
- **Sin Registro Público:** Los enlaces de registro y autoservicio están desactivados para mantener el panel exclusivamente accesible para el equipo autorizado.
- **Credenciales Sembradas:** Muestra clara de la cuenta administrativa predeterminada para auditoría y validación: `ricardo.valladares.triminio@gmail.com` / `12345678`.

---

## 6. Convenciones de Código y Clases CSS

Para mantener la consistencia en el desarrollo futuro, se deben aplicar las siguientes clases de utilidad Tailwind:

```tsx
// Botón Primario Corporativo
className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1a30] px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-xs transition-all hover:bg-[#15233c] focus:outline-none"

// Elemento Activo en Sidebar
className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-[#131f37] px-3.5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-[#182643]"

// Elemento Inactivo en Sidebar
className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"

// Tarjeta Estándar de Contenido
className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0d1627]"

// Título de Sección
className="text-2xl font-black tracking-tight text-[#0b1a30] dark:text-white uppercase"

// Subtítulo Acompañante
className="text-xs font-semibold tracking-wider text-slate-500 uppercase"
```

---

## 7. Buenas Prácticas de Marca

1. **Uso Exclusivo del Logo Oficial:** Emplear únicamente los archivos vectoriales o PNG con transparencia provistos en `public/images/`. No deformar la relación de aspecto bajo ninguna circunstancia.
2. **Jerarquía Bicolor Permanente:** Nunca transformar el fondo del sidebar a blanco en la vista de escritorio del panel administrativo; la distinción visual de Ruvar radica en su panel lateral oscuro en contraste con el lienzo claro de datos.
3. **Control de Acceso Estricto:** La creación de nuevos usuarios debe realizarse exclusivamente por el Administrador mediante el panel interno (`UserSeeder` o administración futura), manteniendo la directiva de no permitir registro libre al público.
