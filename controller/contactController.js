const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Contact = require("../models/contactModel");

// Finds a contact that belongs to the logged-in user, or sends a 404.
// Other users' contacts also get a 404, so nobody can tell whether an id exists.
const findContactOr404 = async (id, req, res) => {
    const contact = mongoose.isValidObjectId(id)
        ? await Contact.findOne({ _id: id, user_id: req.user.id })
        : null;
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    return contact;
};

//@desc Get all contacts of the logged-in user
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

//@desc Create new contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body || {};
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    // The owner comes from the token, never from the request body
    const contact = await Contact.create({ name, email, phone, user_id: req.user.id });
    res.status(201).json({ status: 1, message: "Contact created successfully!", contact });
});

//@desc Get one contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await findContactOr404(req.params.id, req, res);
    res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await findContactOr404(req.params.id, req, res);
    // Only these fields can be changed (so user_id can't be moved to another user)
    const { name, email, phone } = req.body || {};
    const updates = Object.fromEntries(
        Object.entries({ name, email, phone }).filter(([, value]) => value !== undefined)
    );
    const updatedContact = await Contact.findByIdAndUpdate(contact._id, updates, {
        returnDocument: "after",
        runValidators: true,
    });
    res.status(200).json(updatedContact);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await findContactOr404(req.params.id, req, res);
    await Contact.deleteOne({ _id: contact._id });
    res.status(200).json(contact);
});

module.exports = { getContacts, createContact, getContact, deleteContact, updateContact };
