# Plataforma de Gestión Judicial "PROCURAR"

## Descripción

Este proyecto busca crear una plataforma integral de gestión judicial, inicialmente enfocada en la integración con el Poder Judicial de la Nación (PJN) de Argentina mediante web scraping. La plataforma tiene como objetivo mejorar la eficiencia en el manejo de expedientes y documentación legal, proporcionando una interfaz más amigable y funcionalidades adicionales que el sistema oficial actualmente no ofrece.

### Características

- Web scraping para obtener y sincronizar información de expedientes relacionados.
- Sistema de gestión de expedientes y documentación.
- Interfaz de usuario amigable construida con Vue.js.
- Capacidad para auto-alojar la plataforma en servidores internos de estudios jurídicos.
- Visualizador de expedientes en formato de libro digital con funcionalidades para tomar notas y marcar fojas.

### Futuras Integraciones

Planeamos expandir la plataforma para que pueda integrarse con otros sistemas judiciales y plataformas relacionadas, tanto a nivel nacional como internacional.

## Tecnologías Utilizadas

- Vue.js
- MySQL
- Puppeteer
- Node.js

## Roadmap

### Web Scraping de PJN
- [x] Obtener lista de expedientes relacionados por primera vez
- [ ] Sincronización automática o manual para detectar nuevos expedientes
- [ ] Ingresar a cada expediente para sincronizar todos los movimientos y archivos

### Base de Datos
- [ ] Diseño de base de datos para almacenar información de expedientes
- [ ] Implementar funcionalidades CRUD (Create, Read, Update, Delete)

### Interfaz de Usuario
- [ ] Diseñar e implementar la UI utilizando Vue.js
- [ ] Implementar sistema de autenticación de usuarios

### Plataforma
- [ ] Implementar funcionalidades para que la plataforma sea auto-alojable
- [ ] Visualizador de expedientes como un libro digital
- [ ] Funcionalidad para tomar notas y marcar fojas en expedientes

### Otros
- [ ] Documentación
- [ ] Pruebas
- [ ] Despliegue
