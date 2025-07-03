#!/bin/bash

echo "🔧 Iniciando el servidor DOMINIUS..."

cd /var/www/dominius/server || { echo "❌ Carpeta 'server' no encontrada."; exit 1; }

# Solo crea package.json si no existe
if [ ! -f package.json ]; then
  echo "📦 Creando package.json..."
  npm init -y
fi

echo "📦 Instalando dependencias (express, tinymce, ejs)..."
npm install express tinymce ejs express-session passport passport-google-oauth20

# Modificar package.json
echo "📝 Modificando package.json..."
node -e "
let f='package.json';
let d=require('./'+f);
d.author='Jose Vicente Lopez Lopez';
d.keywords=['dominius','uam','cornell','notas','calendario','TF-IDF','Cornell'];
d.description='Plataforma web para la toma estructurada de apuntes y análisis de dominio académico desarrollada como proyecto de integración de la Licenciatura en Ingeniería en Computación (UAM-Azc)';
require('fs').writeFileSync(f, JSON.stringify(d, null, 2));
"

echo "⌛ Esperando 3 segundos..."
sleep 3

echo "🚀 Iniciando el servidor..."
node index.js
