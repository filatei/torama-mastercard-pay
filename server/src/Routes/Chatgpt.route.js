const express = require('express');
const router = express.Router();

const ChatgptController = require('../Controllers/Chatgpt.controller');

//Get a list of all Chatgpts
router.get('/', ChatgptController.getAllPrompts);

//Create a new Chatgpt
router.post('/', ChatgptController.createNewChatgpt);

//Get a Chatgpt by id
router.get('/:id', ChatgptController.findChatgptById);

//Update a Chatgpt by id
router.patch('/:id', ChatgptController.updateAChatgpt);

//Delete a Chatgpt by id
router.delete('/:id', ChatgptController.deleteAChatgpt);

module.exports = router;