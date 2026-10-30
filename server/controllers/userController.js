const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    const exist = await User.findOne({
      email,
    });

    if (exist) {
      return res.status(400).json({
        msg: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.json({
      msg: "User created",
      user,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(user);
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      msg: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};