const express = require("express");
const userController = require("../Controllers/User.controller");

const authMiddleware = require("../Middleware/Auth.middleware");
const router = express.Router();
router.get("/", (req, res) => {
  // View logged in user profile
  console.log("me");
  res.status(200).send("req.user");
});

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/verify", userController.verify);

// any routes below this middleware will require authentication
router.use(authMiddleware);

// protected routes
// router.get('/users/me', (req, res) => {
//   // View logged in user profile
//   res.send(req.user);
// });

// add more routes as needed

module.exports = router;
