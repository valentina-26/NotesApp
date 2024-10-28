const { body } = require("express-validator");

exports.saveUserValidation = () => {
  return [
    body("nickName")
      .notEmpty().withMessage("El nickname es un campo obligatorio.")
      .isString().withMessage("El nickname debe ser texto.")
      .trim()
      .isLength({ min: 3, max: 50 }).withMessage("El nickname debe tener entre 3 y 50 caracteres.")
      .matches(/^[a-zA-Z0-9_-]+$/).withMessage("El nickname solo puede contener letras, números, guiones y guiones bajos."),
    
    body("email")
      .notEmpty().withMessage("El email es un campo obligatorio.")
      .isEmail().withMessage("Debe proporcionar un email válido.")
      .trim()
      .normalizeEmail(),
    
    body("password")
      .notEmpty().withMessage("La contraseña es un campo obligatorio.")
      .isString().withMessage("La contraseña debe ser texto.")
      .isLength({ min: 8, max: 100 }).withMessage("La contraseña debe tener entre 8 y 100 caracteres.")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage("La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial."),

    body("name")
      .optional()
      .isString().withMessage("El nombre debe ser texto.")
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres."),
    
    body("lastName")
      .optional()
      .isString().withMessage("El apellido debe ser texto.")
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage("El apellido debe tener entre 2 y 100 caracteres."),
    
    body("age")
      .optional()
      .isInt({ min: 13, max: 120 }).withMessage("La edad debe ser un número entre 13 y 120 años."),
    
    body("phoneNumber")
      .optional()
      .matches(/^\+?[\d\s-]+$/).withMessage("El número de teléfono debe tener un formato válido.")
      .isLength({ min: 10, max: 15 }).withMessage("El número de teléfono debe tener entre 10 y 15 caracteres.")
  ];
};