const express = require("express");
const router = express.Router();
const {
  resetPassword,
  login,
  newPassword,
  editStudent,
  getStudent,
  editName,
  editEmail,
  editAddress,
  editSemester,
  editYear,
  editContact,
  editDob,
  editDepartment,
  getExamScheduleBySem,
  getResult,
  contact
} = require("../controllers/student");

router.post("/signin", login);
router.post('/contact', contact)
router.post("/reset-password", resetPassword);
router.post("/new-password", newPassword);
router.get("/view/student/:id", getStudent);
router.get("/view/student/:id", getStudent);
router.put("/edit/name/:id", editName);
router.put("/edit/email/:id", editEmail);
router.put("/edit/department/:id", editDepartment);
router.put("/edit/semester/:id", editSemester);
router.put("/edit/year/:id", editYear);
router.put("/edit/address/:id", editAddress);
router.put("/edit/contact/:id", editContact);
router.put("/edit/dob/:id", editDob);
router.get("/exam/schedule/:sem", getExamScheduleBySem);
router.get("/view/result/:enrollmentNumber", getResult);

module.exports = router;
