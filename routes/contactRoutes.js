const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateLoginTokenHandler");

const {getContacts, createContact, getContact, deleteContact, updateContact} = require("../controller/contactController");

router.route("/").get(validateToken, getContacts).post(validateToken, createContact);

router.route("/:id").get(validateToken, getContact).put(validateToken,updateContact).delete(validateToken, deleteContact);

module.exports = router;