//Inicializacion del editor de Tiny
tinymce.init({
  selector: "textarea",
  plugins: [
    "anchor",
    "autolink",
    "charmap",
    "lists",
    "searchreplace",
    "visualblocks"
  ],
  toolbar:
    "undo redo | blocks fontsize | bold italic | align lineheight | numlist bullist indent outdent",
  branding: false, // Desabilitar logo
  statusbar: false, // Desabilitar parte inferior
  onboarding: false, // No mostrar "Explore trial"
  menubar: false
});

function guardarTodo() {
  // Se crea el objeto JSON con todas las secciones
  const quillTodo = {
    keywords: quillKeywords.getContents(),
    notas: quillNotas.getContents(),
    resumen: quillResumen.getContents(),
  };

  // Solo para mostrar el resultado
  document.getElementById("resultado").textContent = JSON.stringify(
    quillTodo,
    null,
    2
  );

  // Prueba de guardadok
  // console.log(quillTodo);
}
