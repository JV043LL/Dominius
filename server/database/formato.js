function formatUser(dbUser) {
  return {
    id: dbUser.id,
    displayName: dbUser.nombre,
    email: dbUser.correo,
    createdAt: dbUser.fecha_registro,
  };
}

module.exports = formatUser;
