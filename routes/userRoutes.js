const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateLoginTokenHandler");

const { registerUser, loginUser, currentUser } = require("../controller/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);


// router.post("/current",(req, res)=>{
//     res.json({message:"current user"});
// });

module.exports = router;
