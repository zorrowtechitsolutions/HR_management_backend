const DepartmentPerformance = require("../models/DepartmentPerformance");
const Department = require("../models/Department");
const asyncHandler = require("express-async-handler");



//CREATE PERFORMANCE


exports.createPerformance = asyncHandler(async (req, res) => {

 let {
  departmentId,
  overallRating,
  projectCompletion,
  employeeSatisfaction,
  year,
  status,
  comments
 } = req.body;

 status = status?.trim();
 comments = comments?.trim();


 if(
  !departmentId ||
  overallRating === undefined ||
  projectCompletion === undefined ||
  employeeSatisfaction === undefined ||
  !year ||
  !status
 ){
  return res.status(400).json({
   success:false,
   message:"All fields are required"
  });
 }


 const department = await Department.findById(departmentId);

 if(!department){
  return res.status(404).json({
   success:false,
   message:"Department not found"
  });
 }


 if(overallRating < 1 || overallRating > 5){
  return res.status(400).json({
   success:false,
   message:"Overall rating must be between 1 and 5"
  });
 }

 if(employeeSatisfaction < 1 || employeeSatisfaction > 5){
  return res.status(400).json({
   success:false,
   message:"Employee satisfaction must be between 1 and 5"
  });
 }

 if(projectCompletion < 0 || projectCompletion > 100){
  return res.status(400).json({
   success:false,
   message:"Project completion must be between 0 and 100"
  });
 }


 const duplicate = await DepartmentPerformance.findOne({
  departmentId,
  year,
  isActive:true
 });

 if(duplicate){
  return res.status(400).json({
   success:false,
   message:"Performance already exists for this department and year"
  });
 }


 const performance = new DepartmentPerformance({
  departmentId,
  overallRating,
  projectCompletion,
  employeeSatisfaction,
  year,
  status,
  comments
 });


 const saved = await performance.save();


 res.status(201).json({
  success:true,
  message:"Performance created successfully",
  data:saved
 });

});


//GET ALL PERFORMANCE


exports.getPerformances = asyncHandler(async(req,res)=>{

 const data = await DepartmentPerformance.find({isActive:true})
 .populate("departmentId","departmentName")
 .sort({createdAt:-1});


 const formatted = data.map(item=>({
  _id:item._id,
  department:item.departmentId?.departmentName,
  rating:item.overallRating,
  projectCompletion:item.projectCompletion,
  employeeSatisfaction:item.employeeSatisfaction,
  year:item.year,
  status:item.status
 }));


 res.status(200).json({
  success:true,
  data:formatted
 });

});


//GET PERFORMANCE BY ID


exports.getPerformanceById = asyncHandler(async(req,res)=>{

 const performance = await DepartmentPerformance.findById(req.params.id)
 .populate("departmentId","departmentName");


 if(!performance){
  return res.status(404).json({
   success:false,
   message:"Performance not found"
  });
 }


 res.status(200).json({
  success:true,
  data:performance
 });

});


//UPDATE PERFORMANCE


exports.updatePerformance = asyncHandler(async(req,res)=>{

 let {
  overallRating,
  projectCompletion,
  employeeSatisfaction,
  status,
  comments
 } = req.body;


 status = status?.trim();
 comments = comments?.trim();


 if(overallRating && (overallRating <1 || overallRating >5)){
  return res.status(400).json({
   success:false,
   message:"Overall rating must be between 1 and 5"
  });
 }

 if(employeeSatisfaction && (employeeSatisfaction <1 || employeeSatisfaction >5)){
  return res.status(400).json({
   success:false,
   message:"Employee satisfaction must be between 1 and 5"
  });
 }

 if(projectCompletion && (projectCompletion <0 || projectCompletion >100)){
  return res.status(400).json({
   success:false,
   message:"Project completion must be between 0 and 100"
  });
 }


 const updated = await DepartmentPerformance.findByIdAndUpdate(
  req.params.id,
  {...req.body, status, comments},
  {new:true}
 );


 res.status(200).json({
  success:true,
  message:"Performance updated successfully",
  data:updated
 });

});



//DELETE PERFORMANCE


exports.deletePerformance = asyncHandler(async(req,res)=>{

 const performance = await DepartmentPerformance.findById(req.params.id);

 if(!performance){
  return res.status(404).json({
   success:false,
   message:"Performance not found"
  });
 }

 performance.isActive=false;

 await performance.save();


 res.status(200).json({
  success:true,
  message:"Performance deleted successfully"
 });

});