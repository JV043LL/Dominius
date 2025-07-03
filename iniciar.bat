@echo off
echo Iniciando el servidor DOMINIUS...
cd server

:: Solo inicializa si no existe package.json
if not exist package.json (
  echo Creando package.json...
  call npm init -y >nul 2>&1
)

echo Instalando dependencias...
call npm install express tinymce express-session passport passport-google-oauth20 ejs >nul 2>&1

:: Modificar package.json con Node.js
node -e "let f='package.json', d=require('./'+f); d.author='Jose Vicente Lopez Lopez'; d.keywords=['dominius','uam','cornell','notas','calendario','TF-IDF','Cornell']; d.description='Plataforma web para la toma estructurada de apuntes y análisis de dominio académico desarrollada como proyecto de integración de la Licenciatura en Ingeniería en Computación (UAM-Azc)'; require('fs').writeFileSync(f, JSON.stringify(d, null, 2))"

echo Esperando servidor para iniciar...
timeout /t 3 >nul

start http://localhost:3000
node index.js

pause
