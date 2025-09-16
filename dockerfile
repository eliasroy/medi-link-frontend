# Imagen base con Node
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código del proyecto
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Forzar que Vite escuche en 0.0.0.0 (no solo dentro del contenedor)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
