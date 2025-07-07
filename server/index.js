const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const db = require("./database/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const {
  pool,
  findOrCreateUser,
  findOrCreateUea,
  findOrCreateUsuarioUea,
  addNotaCornell,
  getUserById,
} = require("./database/db");

// Sessions y Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "changeme",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        `http://localhost:${PORT}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const correo = profile.emails && profile.emails[0].value;
        const user = await findOrCreateUser(profile.displayName, correo);
        cb(null, user);
      } catch (err) {
        cb(err);
      }
    }
  )
);
passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await getUserById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

// Para el desarrollo utilizar nodemon

// Servir estáticos
app.use("/css", express.static(path.join(__dirname, "..", "client", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "client", "js")));
app.use("/ico", express.static(path.join(__dirname, "..", "client", "ico")));
app.use(
  "/public",
  express.static(path.join(__dirname, "..", "client", "public"))
);
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "..", "client", "public", "tinymce"))
);

// Ruta principal
app.get("/", (req, res) => {
  if (!req.user) return res.redirect("/login");
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// Ruta plantilla de notas cornell
app.get("/NotasCornell", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "/client/public", "NotaCornell.html")
  );
});

// Ruta subir material de UEA
app.get("/material-curso", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/client/public", "profesor.html"));
});

// ────────────────────────────────
// 🟦 Login: Autenticación de usuario
// ────────────────────────────────

//Ruta login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/client/public", "login.html"));
});

// OAuth Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => (err ? next(err) : res.redirect("/login")));
});

// ────────────────────────────────
// 🟨 API: Rutas y controladores
// ────────────────────────────────

app.get("/api/user", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "No autenticado" });
  res.json({ displayName: req.user.displayName, id: req.user.id });
});

app.post("/api/nota-cornell", async (req, res) => {
  try {
    const { uea, ideas_clave, notas_principales, resumen } = req.body;
    const ueaRow = await findOrCreateUea(uea || "UEA");
    const rel = await findOrCreateUsuarioUea(req.user.id, ueaRow.id);
    await addNotaCornell(rel.id, ideas_clave, notas_principales, resumen);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar" });
  }
});

app.post("/api/exportar-pdf", (req, res) => {
  const { keywords, notas, resumen } = req.body;
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=nota_cornell.pdf");
  doc.pipe(res);
  doc.fontSize(20).text("Nota Cornell", { align: "center" });
  doc.moveDown();
  doc.fontSize(16).text("Keywords", { underline: true });
  doc.fontSize(12).text(keywords || "");
  doc.moveDown();
  doc.fontSize(16).text("Notas", { underline: true });
  doc.fontSize(12).text(notas || "");
  doc.moveDown();
  doc.fontSize(16).text("Resumen", { underline: true });
  doc.fontSize(12).text(resumen || "");
  doc.end();
});

app.get("/metricas", (req, res) => res.render("metricas"));
app.get("/calendario", (req, res) => res.render("calendario"));

// Rutas para components
app.get("/components/header.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/client/components", "header.html"));
});
app.get("/components/footer.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/client/components", "footer.html"));
});

pool
  .query("SELECT 1")
  .then(() => console.log("✅ Conexión exitosa a MySQL en el puerto 8080"))
  .catch((err) => console.error("❌ Error al conectar:", err.message));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//Prueba de base de datos:

async function obtenerUsuarios() {
  try {
    const [rows] = await db.query("SELECT * FROM uea");
    console.log(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
}

obtenerUsuarios();
