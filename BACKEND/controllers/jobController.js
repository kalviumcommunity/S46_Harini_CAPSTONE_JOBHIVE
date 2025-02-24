import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const myJobs = await Job.find();
  res.status(200).json({
    success: true,
    myJobs,
  });
});


// ✅ Post a new job
export const postJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(new ErrorHandler("Please provide a salary range or fixed salary.", 400));
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(new ErrorHandler("Cannot enter both fixed and ranged salary.", 400));
  }

  // const postedBy = req.user._id; // Ensure job is linked to user
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    // postedBy,
  });

  console.log("Job Created:", job); // Debugging
  res.status(201).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});

//  Update a job
export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  // if (job.postedBy.toString() !== req.user._id.toString()) {
  //   return next(new ErrorHandler("Unauthorized to update this job.", 403));
  // }

  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Job Updated Successfully!",
    job,
  });
});

//  Delete a job
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  // if (job.postedBy.toString() !== req.user._id.toString()) {
  //   return next(new ErrorHandler("Unauthorized to delete this job.", 403));
  // }

   job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted Successfully!",
  });
});

export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});