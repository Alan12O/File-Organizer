# File Organizer 📁
**Has descargado muchos archivos y no sabes dónde ponerlos?**
**No mantienes orden y cuando quieres hacerlo te parece imposible?**
TE PRESENTAMOS:
**File Organizer** es una aplicación de escritorio rápida y moderna construida con **Electron**, **React**, **TypeScript** y **Vite**. Su propósito es ayudarte a mantener tus carpetas limpias y ordenadas estructurando tus archivos de forma automática según su extensión o reglas de nombre.

## Características ✨

- **Organización Automática:** Mueve archivos rápidamente a subcarpetas categóricas como "Imágenes", "Documentos PDF", "Archivos Comprimidos", entre otras.
- **Reglas Personalizables:** Decide qué extensiones van a qué carpetas. Activa o desactiva las reglas a tu gusto.
- **Patrones de Nombres:** ¿Tienes capturas de pantalla, archivos descargados de WhatsApp o imágenes de IA? Configura comodines (por ejemplo, `WhatsApp*` o `Captura*`) para organizarlos de manera más eficiente que la simple extensión.
- **Historial y Deshacer:** Todo movimiento se guarda en el historial. Si accidentalmente organizas una carpeta, puedes restaurar los archivos a su lugar original con un solo clic.
- **Prevención de Sobrescritura Inteligente:** Si en la carpeta de destino ya existe un archivo con el mismo nombre, la aplicación añade automáticamente un sufijo numérico para no perder ningún dato.
- **Vista Previa antes de Organizar:** Revisa qué archivos irán a dónde antes de ejecutar la organización.

## Tecnologías Utilizadas 🚀

- [Electron](https://www.electronjs.org/) - Ejecución de escritorio y acceso al sistema de archivos local.
- [React](https://react.dev/) + [Vite](https://vitejs.dev/) - La interfaz de usuario es reactiva, veloz e impulsada por una experiencia de desarrollo súper rápida.
- [TypeScript](https://www.typescriptlang.org/) - Tipado estricto para un código más confiable y seguro.
- [Lucide Icons](https://lucide.dev/) - Íconos elegantes para la UI.

## Instalación y Ejecución 🛠️

1. Clona el repositorio a tu máquina local:
   ```bash
   git clone https://github.com/Alan12O/File-Organizer.git
   cd File-Organizer
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```

4. Para compilar la versión de producción (empaquetar la app):
   ```bash
   npm run build
   ```

## Estructura del Código 📂

- `src/` - Contiene todo el código de React:
  - `pages/Dashboard.tsx` - Vista principal de organización y vista previa.
  - `pages/RulesEditor.tsx` - Editor de las reglas y extensiones.
  - `pages/History.tsx` - Registro de sesiones de organización.
- `electron/` - Código del proceso principal de Node/Electron (`main.cjs` y `preload.cjs`). IPC handlers de sistema de archivos.

## Contribuciones 🤝

¡Las contribuciones son siempre bienvenidas! Si quieres añadir más reglas predeterminadas, mejoras de interfaz u optimizaciones en la manipulación de archivos, siéntete libre de abrir un Pull Request o Issue en el repositorio.
