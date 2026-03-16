const User = require("../models/User");

// GET users
exports.getUsers = async (req, res) => {
  try {
    console.log("GET /users called");

    const users = await User.find();
    res.json(users);

  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// CREATE user
exports.createUser = async (req, res) => {
  try {

    console.log("POST /users body:", req.body);   // 👈 IMPORTANT DEBUG

    const user = new User(req.body);
    const savedUser = await user.save();

    console.log("User saved:", savedUser);

    res.status(201).json(savedUser);

  } catch (error) {

    console.error("CREATE ERROR:", error);

    res.status(500).json({ message: error.message });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  try {

    console.log("UPDATE ID:", req.params.id);
    console.log("UPDATE BODY:", req.body);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(user);

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {

    console.log("DELETE ID:", req.params.id);

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};