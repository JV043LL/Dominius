const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Para el desarrollo utilizar nodemon 

// Servir estáticos
app.use('/css', express.static(path.join(__dirname, '..', 'client', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'client', 'js')));
app.use('/ico', express.static(path.join(__dirname, '..', 'client', 'ico')));
app.use('/public', express.static(path.join(__dirname, '..', 'client', 'public')));
app.use('/tinymce', express.static(path.join(__dirname, '..', 'client', 'public', 'tinymce')));



// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Ruta plantilla de notas cornell
app.get('/NotasCornell', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/client/public', 'NotaCornell.html'));
});

// Ruta subir material de UEA
app.get('/subir', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/client/public', 'profesor.html'));
});


app.get('/metricas', (req, res) => res.render('metricas'));
app.get('/calendario', (req, res) => res.render('calendario'));

// Rutas para components
app.get('/components/header.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/client/components', 'header.html'));
});
app.get('/components/footer.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/client/components', 'footer.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
