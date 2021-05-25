const Student = require("../models/Student");
const Exam = require("../models/Exam");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stdntmanagement@gmail.com",
    pass: "mern1234",
  },
});

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check If User Existing OR Not
    const existing = await Student.findOne({ username });

    if (!existing) {
      return res.status(400).json({
        error: "User not found!",
      });
    }

    const checkPassword = await bcrypt.compare(password, existing.password);

    if (!checkPassword) {
      return res.status(400).json({
        error: "Incorrect Password!",
      });
    }

    const token = await jwt.sign({ id: existing._id }, process.env.JWT_SECRET);

    return res.json({ token, user: existing });
  } catch (error) {
    res.json(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = await crypto.randomBytes(32).toString("hex");

    const student = await Student.findOne({ email: req.body.email });

    console.log(token);
    if (student) {
      student.resetToken = token;
      student.expireToken = Date.now() + 3600000;
      await student.save((err, student) => {
        if (err || !student) {
          console.log(err);
          return res.status(400).json({
            error: "Something Went Wrong!",
          });
        }
        const link = "http://localhost:3000/new-password";
        const mail = {
          to: student.email,
          from: "yash@no-reply.com",
          subject: "Password Reset Link",
          html: `<h2>Hey, ${student.name}</h2>
            <h5>
            Please
            <a href=${link}/${token}>
            Click Here</a> to reset your password.
            </h5>
            <footer>
            <p>-Admin Dept.</p>
            </footer>
    
          `,
        };
        transporter.sendMail(mail, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        return res.json({
          message: "Password Reset Link Sent!",
        });
      });
    } else {
      return res.status(400).json({
        error: "User Not Found!",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.newPassword = async (req, res) => {
  try {
    const { password, cPassword, token } = req.body;
    if (password !== cPassword) {
      return res.status(400).json({
        error: "Please Enter Same Password Twice!",
      });
    }
    const findStudent = await Student.findOne({
      resetToken: token,
      expireToken: { $gt: Date.now() },
    });

    if (!findStudent) {
      return res.status(400).json({
        error: "Password Reset Link is Invalid!",
      });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    findStudent.password = hashPassword;
    findStudent.resetToken = undefined;
    findStudent.expireToken = undefined;
    findStudent.save((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "Something Went Wrong , Please Try Again!",
        });
      }
      return res.json({
        message: "Password Changed Successfully!",
      });
    });
  } catch (error) {}
};

exports.getStudent = async (req, res) => {
  const id = req.params.id;
  await Student.findById({ _id: id }).exec((err, student) => {
    if (err || !student) {
      return res.status(400).json({
        error: "Something Went Wrong",
      });
    }
    return res.json(student);
  });
};

exports.editName = async (req, res) => {
  console.log(req.body);
  try {
    const _id = req.params.id;
    const { newname } = req.body;

    await Student.findByIdAndUpdate(
      _id,
      {
        name: newname,
      },
      { new: true }
    ).exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "Something Went Wrong!",
        });
      }

      return res.json(student);
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
exports.editSemester = async (req, res) => {
  console.log(req.body);
  try {
    const _id = req.params.id;
    const { newsemester } = req.body;

    await Student.findByIdAndUpdate(
      _id,
      {
        semester: newsemester,
      },
      { new: true }
    ).exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "Something Went Wrong!",
        });
      }
      return res.json(student);
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
exports.editContact = async (req, res) => {
  console.log(req.body);
  try {
    const _id = req.params.id;
    const { newcontact } = req.body;

    await Student.findByIdAndUpdate(
      _id,
      {
        contact: newcontact,
      },
      { new: true }
    ).exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "Something Went Wrong!",
        });
      }
      return res.json(student);
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
exports.editYear = async (req, res) => {
  console.log(req.body);
  try {
    const _id = req.params.id;
    const { newyear } = req.body;

    await Student.findByIdAndUpdate(
      _id,
      {
        year: newyear,
      },
      { new: true }
    ).exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "Something Went Wrong!",
        });
      }
      return res.json(student);
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
exports.editEmail = async (req, res) => {
  console.log(req.body);
  try {
    const _id = req.params.id;
    const { newemail, newusername } = req.body;

    await Student.findByIdAndUpdate(
      _id,
      {
        email: newemail,
        username: newusername,
      },
      { new: true }
    ).exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "Something Went Wrong!",
        });
      }
      const mail = {
        to: student.email,
        from: "yash@no-reply.com",
        subject: "Your Email Id and Username is Been Updated",
        html: `<h2>Hey, ${student.name}</h2>
          <h4>
            Your new Email Id is ${student.email}.
            <br/>
            Your new Username is ${student.username}.
          </h4>
          <footer>
          <p> - Admin Dept.</p>
          </footer>
  
        `,
      };
      transporter.sendMail(mail, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res.json(student);
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
exports.editAddress = async (req, res) => {
  console.log(req.body);
  try {
    const _id = req.params.id;
    const { newaddress } = req.body;

    await Student.findByIdAndUpdate(
      _id,
      {
        address: newaddress,
      },
      { new: true }
    ).exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "Something Went Wrong!",
        });
      }
      return res.json(student);
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
exports.editDepartment = async (req, res) => {
  console.log(req.body);
  try {
    const _id = req.params.id;
    const { newdepartment } = req.body;

    await Student.findByIdAndUpdate(
      _id,
      {
        department: newdepartment,
      },
      { new: true }
    ).exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "Something Went Wrong!",
        });
      }
      return res.json(student);
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
exports.editDob = async (req, res) => {
  console.log(req.body);
  try {
    const _id = req.params.id;
    const { newdob } = req.body;

    await Student.findByIdAndUpdate(
      _id,
      {
        dob: newdob,
      },
      { new: true }
    ).exec((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: "Something Went Wrong!",
        });
      }
      return res.json(student);
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
exports.getExamScheduleBySem = async (req, res) => {
  try {
    const { sem } = req.params;

    await Exam.find({ semester: sem })
      .sort({ date: 1 })
      .exec((err, student) => {
        if (err || !student) {
          return res.status(400).json({
            error: "Something Went Wrong",
          });
        }

        return res.json(student);
      });
  } catch (error) {
    return console.log(error);
  }
};
exports.getResult = async (req, res) => {
  try {
    const enrollmentNumber = req.params.enrollmentNumber;
    const findRes = await Mark.find({ enrollmentNumber });

    if (!findRes) return res.json({ error: "Your Result Not Declared Yet!" });

    return res.json(findRes);
  } catch (error) {
    return res.json({
      error: "Something Went Wrong!",
    });
  }
};
