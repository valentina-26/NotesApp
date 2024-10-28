const router = require("express").Router();
const userController = require('../controller/userController')
const versionMiddeleware = require('../middleware/versionate');
const limit = require('../limit/userLimit');
const validator = require('../validator/userValidator');



router.post("/login", limit.login,versionMiddeleware("1.0.0"), (req, res) => {
    userController.signInUser(req, res);
});

router.post("/logout", versionMiddeleware("1.0.0"), (req, res) => {
    userController.logOutUser(req, res);
});

router.put("/:id",limit.put, versionMiddeleware("1.0.0"), (req, res) => {
     userController.updateUserById(req, res);
});

router.delete("/:id",limit.delete, versionMiddeleware("1.0.0"), (req, res) => {
    userController.deleteUserById(req, res);
});

router.post("/", limit.post,versionMiddeleware("1.0.0"), (req, res) => {
    userController.AddNewUser(req, res);
});


module.exports = router