const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
require("./DB/db");
const Port = process.env.PORT || 5000;
const { User } = require("./Models/UserSchema");

app.use(express.json());

app.get("/", () => {
  // console.log(UserSchema);
});

app.post("/users/register", async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    //search if there a user with this email
    const isExist = await User.findOne({ email });

    if (isExist) {
      res.status(404).json({
        error: true,
        registred: false,
        message: "This email is alerady exist",
      });
    }
    //=> not existe
    //Hash the password

    //const salt = await process.env.SALT;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log(hashPassword);

    //// create a new user with those data

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    console.log(newUser);

    if (!newUser) {
      res.status(400).json({
        error: true,
        message: "registration faild!!",
      });
    }

    res.status(200).json({
      registred: true,
      message: "You're registered successfully",
    });
  } catch (error) {
    res.json({
      error: true,
      error,
    });
  }
});

app.listen(Port, () => {
  console.log("Server Running at Port:" + Port);
});
