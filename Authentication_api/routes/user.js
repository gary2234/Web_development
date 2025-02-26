const express = require("express");
const userCtrol= require("../controller/user");
const isAuthenticate= require("../middlewares/isAuth");

const router = express.Router();

//!Register
router.post("/api/users/register",userCtrol.register);
router.post("/api/users/login",userCtrol.login);
router.post("/api/users/profile", isAuthenticate,userCtrol.profile);
module.exports=router;