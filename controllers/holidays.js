const Holiday = require("../models/Holidays");
const asyncHandler = require("express-async-handler");


// Get all holidays
exports.getHolidays = asyncHandler(async (req, res) => {

  const holidays = await Holiday.find({ isActive: true })
    .sort({ date: 1 });

  res.status(200).json({
    success: true,
    data: holidays
  });

});


// Get holiday by id
exports.getHolidayById = asyncHandler(async (req, res) => {

  const holiday = await Holiday.findById(req.params.id);

  if (!holiday || !holiday.isActive) {
    return res.status(404).json({
      success: false,
      message: "Holiday not found"
    });
  }

  res.status(200).json({
    success: true,
    data: holiday
  });

});


// Create holiday
exports.createHoliday = asyncHandler(async (req, res) => {

  let {
    holidayName,
    date,
    location,
    shift,
    details,
    holidayType,
    createdBy
  } = req.body;

  // TRIM STRING VALUES
  holidayName = holidayName?.trim();
  location = location?.trim();
  shift = shift?.trim();
  details = details?.trim();
  holidayType = holidayType?.trim();
  createdBy = createdBy?.trim();


  // Required validation
  if (!holidayName || !date) {
    return res.status(400).json({
      success: false,
      message: "Holiday name and date are required"
    });
  }


  // Enum validation
  const validShifts = ["All Shifts", "Day Shifts", "Night Shifts"];
  const validTypes = ["National", "Religious", "Cultural", "Awareness", "Environmental", "Health"];


  if (shift && !validShifts.includes(shift)) {
    return res.status(400).json({
      success: false,
      message: "Invalid shift value"
    });
  }


  if (holidayType && !validTypes.includes(holidayType)) {
    return res.status(400).json({
      success: false,
      message: "Invalid holiday type"
    });
  }


  const holiday = await Holiday.create({
    holidayName,
    date,
    location,
    shift,
    details,
    holidayType,
    createdBy
  });


  res.status(201).json({
    success: true,
    message: "Holiday created successfully",
    data: holiday
  });

});


// Update holiday
exports.updateHoliday = asyncHandler(async (req, res) => {

  const holiday = await Holiday.findById(req.params.id);

  if (!holiday) {
    return res.status(404).json({
      success: false,
      message: "Holiday not found"
    });
  }


  // TRIM UPDATE VALUES
  if (req.body.holidayName) req.body.holidayName = req.body.holidayName.trim();
  if (req.body.location) req.body.location = req.body.location.trim();
  if (req.body.shift) req.body.shift = req.body.shift.trim();
  if (req.body.details) req.body.details = req.body.details.trim();
  if (req.body.holidayType) req.body.holidayType = req.body.holidayType.trim();
  if (req.body.createdBy) req.body.createdBy = req.body.createdBy.trim();


  const validShifts = ["All Shifts", "Day Shifts", "Night Shifts"];
  const validTypes = ["National", "Religious", "Cultural", "Awareness", "Environmental", "Health"];


  if (req.body.shift && !validShifts.includes(req.body.shift)) {
    return res.status(400).json({
      success: false,
      message: "Invalid shift value"
    });
  }


  if (req.body.holidayType && !validTypes.includes(req.body.holidayType)) {
    return res.status(400).json({
      success: false,
      message: "Invalid holiday type"
    });
  }


  const updatedHoliday = await Holiday.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );


  res.status(200).json({
    success: true,
    message: "Holiday updated successfully",
    data: updatedHoliday
  });

});


// Delete holiday (soft delete)
exports.deleteHoliday = asyncHandler(async (req, res) => {

  const holiday = await Holiday.findById(req.params.id);

  if (!holiday) {
    return res.status(404).json({
      success: false,
      message: "Holiday not found"
    });
  }

  holiday.isActive = false;

  await holiday.save();

  res.status(200).json({
    success: true,
    message: "Holiday deleted successfully"
  });

});