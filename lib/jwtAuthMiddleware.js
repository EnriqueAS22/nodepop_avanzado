import jwt from "jsonwebtoken";
import createError from "http-errors";

export function guard(req, res, next) {
  // sacar el tokenJWT de: cabecera, body o query-string
  const tokenJWT = req.get("Authorization") || req.body.jwt || req.query.jwt;

  // si no me han mandado token --> error
  if (!tokenJWT) {
    next(createError(401, "No Token Provided"));
    return;
  }

  // si hay token --> compruebo si es valido
  jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      next(createError(401, "Invalid Token"));
      return;
    }

    // apuntamos el id del usuario logado en el request
    // para que en los proximos middleware puedan leerlo facilmente
    req.apiUserId = payload.user_id;

    next();
  });
}
