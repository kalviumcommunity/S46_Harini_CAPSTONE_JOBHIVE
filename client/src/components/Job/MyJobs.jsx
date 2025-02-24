import React, { useEffect, useState } from "react";
import axios from "axios";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editJob, setEditJob] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  
  const token = localStorage.getItem("token");

  //  Fetch all jobs posted by the user
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/api/v1/job/getmyjobs", {
          headers: {
            "Content-Type": "application/json",
            "Authorization":token,
           },
        });
        console.log(res.data.myJobs)
        setJobs(res.data.myJobs);
      } catch (err) {
        setError("Failed to fetch jobs");
      }
      setLoading(false);
    };

    fetchJobs();
  }, [token]);

  //  Delete Job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/v1/job/delete/${id}`, {
        headers: { Authorization: token },
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      setError("Failed to delete job");
    }
  };

  //  Update Job
  const handleUpdate = async () => {
    if (!editJob) return;
    try {
      await axios.put(`http://localhost:4000/api/v1/job/update/${editJob._id}`, updatedData, {
        headers: { Authorization: token },
      });

      setJobs(jobs.map((job) => (job._id === editJob._id ? { ...job, ...updatedData } : job)));
      setEditJob(null);
      setUpdatedData({});
    } catch (err) {
      setError("Failed to update job");
    }
  };

  return (
    <div className="container">
      <h2>My Posted Jobs</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>City</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.category}</td>
                <td>{job.city}</td>
                <td>
                  {job.fixedSalary ? `₹${job.fixedSalary}` : `₹${job.salaryFrom} - ₹${job.salaryTo}`}
                </td>
                <td>
                  <button onClick={() => setEditJob(job)}>Edit</button>
                  <button onClick={() => handleDelete(job._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editJob && (
        <div>
          <h3>Update Job: {editJob.title}</h3>
          <input
            type="text"
            placeholder="Title"
            defaultValue={editJob.title}
            onChange={(e) => setUpdatedData({ ...updatedData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            defaultValue={editJob.category}
            onChange={(e) => setUpdatedData({ ...updatedData, category: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            defaultValue={editJob.city}
            onChange={(e) => setUpdatedData({ ...updatedData, city: e.target.value })}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditJob(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
