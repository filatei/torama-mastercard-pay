const createError = require('http-errors');
const mongoose = require('mongoose');

const Chatgpt = require('../Models/Chatgpt.model');

module.exports = {
  getAllPrompts: async (req, res, next) => {
    try {
      const results = await Chatgpt.find({}, { __v: 0 }).sort({createdAt: -1});
      res.status(200).send(results);
    } catch (error) {
      console.log(error.message);
    }
  },

  createNewChatgpt: async (req, res, next) => {
    try {
      const chatgpt = new Chatgpt(req.body);
      const result = await chatgpt.save();
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }

  },

  findChatgptById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const chatgpt = await Chatgpt.findById(id);
      // const product = await Product.findOne({ _id: id });
      if (!chatgpt) {
        throw createError(404, 'chatgpt does not exist.');
      }
      res.status(200).send(chatgpt);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid chatgpt id'));
        return;
      }
      next(error);
    }
  },

  updateAChatgpt: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };

      const result = await Chatgpt.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, 'Chatgpt does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, 'Invalid Product Id'));
      }

      next(error);
    }
  },

  deleteAChatgpt: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Chatgpt.findByIdAndDelete(id);
      // console.log(result);
      if (!result) {
        throw createError(404, 'chatgpt does not exist.');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Chatgpt id'));
        return;
      }
      next(error);
    }
  }
};