import jwt from "jsonwebtoken";
import User from "../../models/Users.js";
import createError from "http-errors";

export async function loginJWT(req, res, next) {
  try {
    const { email, password } = req.body;

    // buscar el usuario en BD
    const user = await User.findOne({ email: email });

    // si no se encuentra, o la contrasepa no coincide --> error
    if (!user || !(await user.comparePassword(password))) {
      next(createError(401, "Invalid Crdentials"));
      return;
    }

    // si el usuario existe y la contraseña coincide --> generar JWT y devolverlo
    jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
      (err, tokenJWT) => {
        if (err) {
          next(err);
          return;
        }
        res.json({ tokenJWT });
      }
    );
  } catch (error) {
    next(error);
  }
}
