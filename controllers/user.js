const UserModel = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");



// GET USERS
exports.getUsers = asyncHandler(async (req, res) => {

  const users = await UserModel.find()
    .populate("companyId")
    .select("-password")
    .sort({ createdAt: -1 });



  res.status(200).json({
    success: true,
    users
  });

});


// CREATE USER
exports.createUsers = asyncHandler(async (req, res) => {

  let {
    firstName,
    lastName,
    gender,
    mobile,
    email,
    password,
    role,
    department,
    designation,
    address,
    dateOfBirth,
    education,
    salary,
    joiningDate,
    lastPromotionDate,
    workLocation,
    status,
    skills,
    companyId
  } = req.body;

 
  


  // TRIM STRING VALUES
  firstName = firstName?.trim();
  lastName = lastName?.trim();
  mobile = mobile?.trim();
  email = email?.trim();
  role = role?.trim();
  department = department?.trim();
  designation = designation?.trim();
  address = address?.trim();
  education = education?.trim();
  workLocation = workLocation?.trim();
  status = status?.trim();


  // REQUIRED VALIDATION
  if (!firstName || !mobile || !email || !password || !companyId) {
    return res.status(400).json({
      success: false,
      message: "firstName, mobile, email, company id and password are required"
    });
  }


  // EMAIL EXISTS
  const emailExists = await UserModel.findOne({ email });

  if (emailExists) {
    return res.status(400).json({
      success: false,
      message: "Email already exists"
    });
  }


  // MOBILE EXISTS
  const mobileExists = await UserModel.findOne({ mobile });

  if (mobileExists) {
    return res.status(400).json({
      success: false,
      message: "Mobile already exists"
    });
  }

  


  // HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  // CREATE USER
  const user = new UserModel({
    firstName,
    lastName,
    gender,
    mobile,
    email,
    password: hashedPassword,
    role,
    department,
    designation,
    address,
    dateOfBirth,
    education,
    salary,
    joiningDate,
    lastPromotionDate,
    workLocation,
    status,
    skills: skills || [],
    companyId
  });

  

  const savedUser = await user.save();
  


  res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: savedUser
  });

});


// UPDATE USER
exports.updateUsers = asyncHandler(async (req, res) => {

  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  let updateData = { ...req.body };


  // TRIM STRING FIELDS
  const trimFields = [
    "firstName",
    "lastName",
    "mobile",
    "email",
    "role",
    "department",
    "designation",
    "address",
    "education",
    "workLocation",
    "status"
  ];

  trimFields.forEach(field => {
    if (updateData[field]) {
      updateData[field] = updateData[field].trim();
    }
  });


  // CONVERT NAME → FIRST + LAST
  if (req.body.name) {
    const parts = req.body.name.trim().split(" ");
    updateData.firstName = parts[0];
    updateData.lastName = parts.slice(1).join(" ");
    delete updateData.name;
  }


  const updatedUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).select("-password");


  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: updatedUser
  });

});


// DELETE USER
exports.deleteUsers = asyncHandler(async (req, res) => {

  const user = await UserModel.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Employee deleted permanently"
  });

});



// ✅ ADD THIS FULL FUNCTION
exports.getUserProfile = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid employee ID"
    });
  }

  const user = await UserModel.findById(id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Employee not found"
    });
  }

  const profileData = {
    _id: user._id,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    designation: user.designation,
    department: user.department,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    about: user.about || "",
    education: user.education || "",
    experience: user.experience || "",
    skills: user.skills || [],
    image: user.image || "",
     totalProjects: user.totalProjects || 0,
  completedProjects: user.completedProjects || 0,
  rating: user.rating || 0
  };

  res.status(200).json({
    success: true,
    data: profileData
  });

});