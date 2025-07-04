#!/bin/bash

echo "🔍 Verificando estado del repositorio..."
git fetch origin main

# Detecta conflictos pendientes
if ! git diff --quiet --name-only --diff-filter=U; then
  echo "❌ Hay conflictos sin resolver. Por favor, resuélvelos antes de continuar."
  git status
  exit 1
fi

# Stashea si hay cambios locales no confirmados
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "💾 Guardando temporalmente tus cambios locales (stash)..."
  git stash -u
fi

echo "⬇️ Haciendo git pull..."
git pull origin main || { echo "❌ Error durante git pull"; exit 1; }

# Restaurar cambios si hubo stash
if git stash list | grep -q "stash@{0}"; then
  echo "🔁 Restaurando cambios locales guardados..."
  git stash pop
fi

echo "📦 Instalando dependencias..."
cd server || exit 1
npm install

echo "🚀 Reiniciando servidor con PM2..."
pm2 restart dominius

echo "✅ Despliegue completo y servidor reiniciado."
