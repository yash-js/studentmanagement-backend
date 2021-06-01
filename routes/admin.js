const express = require("express");
const {
  adminSignup,
  adminSignin,
  addStudent,
  getStudents,
  deleteStudent,
  updateStudent,
  getStudent,
  getByYear,
  getAdmins,
  getByDept,
  scheduleExam,
  addSubject,
  getSubjects,
  deleteSubject,
  getExamSchedule,
  getExamScheduleByYear,
  deleteExam,
  addResult,
  viewResult,
  deleteResult,
  resetPassword,
  deleteAdmin,
  newPassword,
  getBySem
} = require("../controllers/admin");
const router = express.Router();

// Auth Route
router.post("/signup", adminSignup);
router.post("/signin", adminSignin);

// Admin Route
router.get("/view/admins", getAdmins);
router.delete("/delete/admin/:id", deleteAdmin);
router.post("/reset-password", resetPassword);
router.post("/new-password", newPassword);

// Student Routes
router.post("/add/student", addStudent);
router.put("/edit/student/:id", updateStudent);
router.delete("/delete/student/:id", deleteStudent);
router.get("/view/students/:year", getByYear);
router.get("/view/students/sem/:sem", getBySem);
router.get("/view/students", getStudents);
router.get("/view/students/all/:dept", getByDept);

// Exam Route
router.post("/exam/schedule", scheduleExam);
router.get("/exam/schedule", getExamSchedule);
router.get("/exam/schedule/:year", getExamScheduleByYear);

router.delete("/delete/exam/:id", deleteExam);

// Subject Route
router.post("/add/subject", addSubject);
router.get("/view/subjects", getSubjects);
router.delete("/delete/subject/:id", deleteSubject);

// RESULT ROUTE
router.post("/add/result", addResult);
router.get("/view/result/:enrollment", viewResult);
router.delete("/delete/mark/:id", deleteResult);

module.exports = router;
