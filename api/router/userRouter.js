const router = require("express").Router();
const userController = require('../controller/userController')


router.post("/login", versionMiddeleware("1.0.0"), (req, res) => {
    userController.singInUser
});

router.post("/logout", versionMiddeleware("1.0.0"), (req, res) => {
    userController.logOutUser
});

router.put("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    userController.updateUserById
});

router.delete("/:id", versionMiddeleware("1.0.0"), (req, res) => {
    userController.deleteUserById
});

router.post("/", versionMiddeleware("1.0.0"), (req, res) => {
    userController.AddNewUser
});


module.exports = router