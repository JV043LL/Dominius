async function loadLayout() {
  const header = await fetch('/components/header.html').then(res => res.text());
  const footer = await fetch('/components/footer.html').then(res => res.text());

  document.getElementById('header').innerHTML = header;
  document.getElementById('footer').innerHTML = footer;
}

window.addEventListener('DOMContentLoaded', loadLayout);
