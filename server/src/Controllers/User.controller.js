const User = require("../Models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require('joi'); // for input validation
const sendMail = require('../../mailer'); 


const { io, userSocketMap } = require("../Socket"); // import io instance and user-socket map

exports.login = async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Authentication failed. User not found" });
    }

    // Check if email is verified
    if (user.verify) {
      return res.status(401).json({ message: "Your Email not Verified. Check your inbox" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Authentication failed. Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign({
      email: user.email,
      userId: user._id,
      name: user.name,
      role: user.role ? user.role : null,
      site: user.site ? user.site : null
    }, process.env.JWT_KEY, { expiresIn: "1000h" });

    // Send response
    res.status(200).json({
      token: token,
      expiresIn: 360000,
      userId: user._id,
      email: user.email,
      name: user.name,
      site: user.site,
      role: user.role,
      image: user.image
    });
  } catch (error) {
    res.status(500).json({ message: "Authentication failed due to server error" });
  }
};

exports.signup = async (req, res, next) => {
  const { email, password, name, phone, signupMethod } = req.body;


  try {
    // handle signupMethod enum with switch
    switch (signupMethod) {
      
      case "EMAIL":
        console.log(req.body, "req.body", req.body.email, "req.body.email");
        const exist = await User.findOne({ email: req.body.email });
        if (exist) {
          return res.status(400).json({
            message: "Email already exist",
          });
        }
        const verifyToken = jwt.sign(
          {
            email,
            name,
          },
          process.env.JWT_KEY,
          { expiresIn: 2000 * 600 } // 20 mins
        );
    
        const a = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        const b = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        const c = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        const d = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        const otp = `${a}${b}${c}${d}`;
    
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);
        console.log(otp, "otp");
    
        const user = new User({
          name: name,
          email: email,
          phone: phone,
          password: password,
          verify: verifyToken,
          otp: otpHash,
          signupMethod: signupMethod,
        });
        await user.save();

        // Hiding password and otp for response
        user.password = undefined;
        user.otp = undefined;

        res.status(201).json({
          message: "User created!",
          result: user,
        });
      case "GOOGLE":
        // use firebase to verify token
        // const { token } = req.body;
        // const ticket = await client.verifyIdToken({
        //   idToken: token,
        //   audience: process.env.GOOGLE_CLIENT_ID,
        // });
        // const payload = ticket.getPayload();
        // // const { email_verified, name, email } = payload;
        // const email_verified = payload.email_verified;
        // const pname = payload.name;
        // const pemail = payload.email;
        // if (email_verified) {
        //   // check if user exist and save user
        //   const uExist = User.findOne({ email: pemail });
        //   if (uExist) {
        //     return res.status(400).json({
        //       message: "Email already exist",
        //     });
        //   } else {
        //     const user = new User({
        //       name: pname,
        //       email: pemail,
        //       signupMethod: signupMethod,
        //     });
        //     await user.save();
        //     res.status(201).json({
        //       message: "User created!",
        //       result: user,
        //     });
        //   }

        // }

      case "FACEBOOK":

      default:
        return res.status(400).json({
          message: "Invalid signup method",
        });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in Signup! " + error,
    });
  }
};


exports.verify = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(500).json({
        message: "token is not defined",
      });
    }

    let vUser = await User.findOne({ verify: token });
    console.log("vUser from db ", vUser);

    if (!vUser) {
      return res.status(400).json({
        message: "No such user",
      });
    }

    // verify otp
    const otp = req.body.otp + "";

    const vOtp = await bcrypt.compare(otp, vUser.otp);
    // continue only if vOtp is valid
    console.log("vOtp", vOtp);

    if (!vOtp) {
      return res.status(500).json({
        message: "Wrong Entry!",
      });
    }
    // vUser = { ...vUser._doc };
    // console.log("vUser ", vUser);

    // const saved = await vUser.save();
    const saved = await User.updateOne(
      { _id: vUser._id },
      { $set: { verify: "", isVerified: true, otp: "" } }
    );

    if (!saved) {
      return res.status(500).json({
        message: "Confirmation Update Not successful",
      });
    }
    console.log("saved ", saved);

    return res.status(200).json({
      message: "Confirmation  successful",
      result: saved,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error in main block " + err,
    });
  }
};

exports.changePassword = async (req, res) => {
  // Define validation schema
  const schema = Joi.object({
    userId: Joi.string().required(),
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required()
  });

  // Validate request body against schema
  const { error, value } = schema.validate(req.body);
  
  if (error) {
    // If validation fails, return an error
    return res.status(400).json({ message: 'Invalid request data', error: error.details });
  }

  // Get user ID, old password and new password from request body
  const { userId, oldPassword, newPassword } = value;

  try {
    // Retrieve user from database
    const user = await User.findById(userId);

    // If user doesn't exist, return error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if old password matches the current one
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in the database
    user.password = hashedPassword;
    await user.save();

    // Return success message
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    // If there's an error, return a 500 status
    res.status(500).json({ message: 'Error occurred while changing the password' });
  }
};


exports.forgotPassword = async (req, res) => {
  // ...
  // generate resetToken and resetExpires...
  // ...

  const mailOptions = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
      http://${req.headers.host}/reset/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  try {
    await sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link has been sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while sending the email' });
  }
};

