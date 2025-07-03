const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

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
    (accessToken, refreshToken, profile, cb) => cb(null, profile)
  )
);
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

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
app.get("/subir", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/client/public", "profesor.html"));
});

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

app.get("/api/user", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "No autenticado" });
  res.json({ displayName: req.user.displayName, id: req.user.id });
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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
