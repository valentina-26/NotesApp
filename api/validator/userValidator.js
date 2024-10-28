const { body } = require("express-validator");

exports.AddNewUser = () => {
 [
    body("name")
      .optional()
      .isString().withMessage("El nombre debe ser texto.")
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres."),

    body("nickName")
      .notEmpty().withMessage("El nickname es un campo obligatorio.")
      .isString().withMessage("El nickname debe ser texto.")
      .trim()
      .isLength({ min: 3, max: 50 }).withMessage("El nickname debe tener entre 3 y 50 caracteres."),
  
    
    body("email")
      .notEmpty().withMessage("El email es un campo obligatorio.")
      .isEmail().withMessage("Debe proporcionar un email válido.")
      .trim()
      .normalizeEmail(),
    
    body("password")
      .notEmpty().withMessage("La contraseña es un campo obligatorio.")
      .isString().withMessage("La contraseña debe ser texto.")
      .isLength({ min: 3, max: 100 }).withMessage("La contraseña debe tener entre 3 y 100 caracteres.")

  ];
};