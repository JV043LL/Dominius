//Inicializacion del editor de Tiny
tinymce.init({
  selector: "textarea",
  plugins: [
    "anchor",
    "autolink",
    "charmap",
    "lists",
    "searchreplace",
    "visualblocks",
  ],
  toolbar:
    "undo redo | blocks fontsize | bold italic | align lineheight | numlist bullist indent outdent",
  branding: false, // Desabilitar logo
  statusbar: false, // Desabilitar parte inferior
  onboarding: false, // No mostrar "Explore trial"
  menubar: false,
});

async function guardarNota() {
  const keywords = tinymce.get("editor-keywords").getContent();
  const notas = tinymce.get("editor-notas").getContent();
  const resumen = tinymce.get("editor-resumen").getContent();
  const uea = document.querySelector(".uea").textContent.trim();

  const contenido = {
    uea,
    ideas_clave: keywords,
    notas_principales: notas,
    resumen,
  };

  try {
    const response = await fetch("/api/nota-cornell", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contenido),
    });

    if (!response.ok) throw new Error("Error al guardar la nota");
    alert("Nota guardada correctamente");
  } catch (err) {
    alert("Ocurrió un error al guardar: " + err.message);
  }
}

async function exportarPDF() {
  const keywords = tinymce.get("editor-keywords").getContent();
  const notas = tinymce.get("editor-notas").getContent();
  const resumen = tinymce.get("editor-resumen").getContent();

  const contenido = {
    keywords,
    notas,
    resumen,
  };

  try {
    const response = await fetch("/api/exportar-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contenido),
    });

    if (!response.ok) throw new Error("Error al generar el PDF");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "nota_cornell.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Ocurrió un error al exportar: " + err.message);
  }
}
