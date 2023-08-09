const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String },
    name: { type: String, trim: true, index: true },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String},
    image: { type: String },
    site: { type: String },
    otp: { type: String },
    phone: { type: String },
    lastSeen: { type: Date },
    roles: [],
    role: {
      type: String,
      enum: [
        "ADMIN",
        "MANAGER",
        "GENERAL MANAGER",
        "HR",
        "SNR ACCOUNTANT",
        "ACCOUNTANT",
        "SUPERVISOR",
        "QAQC",
        "SNR SECRETARY",
        "SECRETARY",
        "STOREKEEPER",
        "BAGGER",
        "SECURITY",
        "LOADER",
        "OFFICEKEEPER",
        "POS OFFICER",
        "POLICE",
        "CONSULTANT",
        "OFFICER",
        "BUYER",
        "OTHER",
      ],
    },
    nin: { type: String, maxLength: 11, minLength: 11, trim: true },
    verify: { type: String },
    isVerified: { type: Boolean },
    resetLink: { type: String, default: "" },
    signupMethod: { type: String, enum: ["EMAIL", "GOOGLE", "FACEBOOK"] },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// UserSchema.pre("save", async function (next) {
//   // Hash the password before saving the user model
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });
  console.log(email, 'email', user, "user in findcredentials", password);
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  bcrypt
    .compare(password, user.password)
    .then((isMatch) => {
      if (isMatch) {
        console.log(isMatch, "isMatch");
        return user;
      } else {
        console.log(" not isMatch");
      }
    })
    .catch((err) => {
      console.error(err);
    });
  // console.log(isPasswordMatch, "isPasswordMatch");
  // if (!isPasswordMatch) {
  //   throw new Error({ error: 'Invalid login credentials' });
  // }
  // console.log(user, "user final findcredentials");
  // return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
