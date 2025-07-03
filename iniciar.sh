#!/bin/bash

# Script para inicializar Dominius en sistemas tipo Unix

set -e

echo "🔧 Iniciando el servidor DOMINIUS..."

# Ubicarse en la carpeta del servidor
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/server" || { echo "❌ Carpeta 'server' no encontrada."; exit 1; }

# Crear package.json si no existe
if [ ! -f package.json ]; then
  echo "📦 Creando package.json..."
  npm init -y >/dev/null 2>&1
fi

# Instalar dependencias necesarias
echo "📦 Instalando dependencias (express, tinymce, ejs)..."
npm install express tinymce ejs express-session passport passport-google-oauth20 >/dev/null 2>&1

# Modificar package.json con la información del proyecto
echo "📝 Modificando package.json..."
node <<'NODE'
const fs = require('fs');
const f = 'package.json';
const d = JSON.parse(fs.readFileSync(f, 'utf8'));
d.author = 'Jose Vicente Lopez Lopez';
d.keywords = ['dominius','uam','cornell','notas','calendario','TF-IDF','Cornell'];
d.description = 'Plataforma web para la toma estructurada de apuntes y análisis de dominio académico desarrollada como proyecto de integración de la Licenciatura en Ingeniería en Computación (UAM-Azc)';
fs.writeFileSync(f, JSON.stringify(d, null, 2));
NODE

# Esperar unos segundos antes de arrancar
echo "⌛ Esperando 3 segundos..."
sleep 3

echo "🚀 Iniciando el servidor..."
node index.js