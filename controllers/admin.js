const Admin = require("../models/Admin");
const Exam = require("../models/Exam");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Subject = require("../models/Subject");
const Mark = require("../models/Mark");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stdntmanagement@gmail.com",
    pass: "mern1234",
  },
});

exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password, cPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All FIelds Are Required!",
      });
    }

    const existing = await Admin.findOne({ email });

    if (existing) {
      return res.status(400).json({
        error: "User Already Exists!",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const saveAdmin = new Admin({
      name,
      email,
      password: hashPassword,
    });

    await saveAdmin.save((err, admin) => {
      if (err || !admin) {
        return res.status(400).json({
          error: "Something Went Wrong!",
        });
      }

      const mail = {
        to: student.email,
        from: "yash@no-reply.com",
        subject: "Account Successfully Registered",
        html: `<h2>Welcome, ${name}. </h2>
        <h4>You're Now an Admin of Student Management System</h4>
          <p>Your Login Credentials Are : </p>
          <em>Email Id: ${email}</em>
          <em>Password: ${password}</em>
  

<h4><a href="https://project-sms.netlify.app/admin">Click Here To Login!</a></h4>



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

      res.json(admin);
    });
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};

exports.adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check If User Existing OR Not
    const existing = await Admin.findOne({ email });

    if (!existing) {
      return res.status(400).json({
        error: "User does not exists!",
      });
    }

    const checkPassword = await bcrypt.compare(password, existing.password);

    if (!checkPassword) {
      return res.status(400).json({
        error: "Incorrect Password!",
      });
    }

    const token = await jwt.sign({ id: Admin._id }, process.env.JWT_SECRET);
    req.header.cookie = existing;

    return res.json({ token, user: existing });
  } catch (error) {
    res.json(error);
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    await Admin.findByIdAndRemove({ _id: id }).exec((err, del) => {
      if (err || !del) return res.json({ error: "Something Went Wrong!" });

      return res.json({
        message: "Admin deleted",
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      cPassword,
      department,
      semester,
      year,
      dob,
      address,
      username,
      contact,
      enrollmentNumber,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !department ||
      !semester ||
      !username ||
      !dob ||
      !address ||
      !year ||
      !contact ||
      !enrollmentNumber
    ) {
      return res.status(400).json({
        error: "All Fields Are Required!",
      });
    }

    if (password !== cPassword) {
      return res.status(400).json({
        error: "Please Enter Same Password Twice!",
      });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({
        error: "Student Aleady Exist!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const saveStudent = new Student({
      name,
      email,
      password: hashPassword,
      dob,
      contact,
      address,
      year,
      department,
      semester,
      username,
      enrollmentNumber,
    });

    await saveStudent.save((err, student) => {
      if (err || !student) {
        return res.status(400).json({
          error: err.message,
        });
      }
      const mail = {
        to: student.email,
        from: "yash@no-reply.com",
        subject: "Account Successfully Registered",
        html: `<h1>Welcome, ${student.name}</h1>

<h4>Your Enrollment Number is : ${student.enrollmentNumber}</h4>
          <h4>Your Login Credentials Are : </h4>
          <h4>Username: ${student.username}</h4>
          <h4>Password: ${password}</h4>
  
<h4><a href="https://project-sms.netlify.app">Click Here To Login!</a></h4>
          
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
      res.json(student);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getStudents = async (req, res) => {
  try {
    await Student.find()
      .sort({ name: 1 })
      .exec((err, student) => {
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

exports.deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    await Student.findByIdAndDelete({ _id: id }).exec((err, response) => {
      if (err) {
        return res.status(400).json({
          error: "Something Went Wrong",
        });
      }
      return res.json("Successfully Deleted!");
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const _id = req.params.id;
    const {
      name,
      email,
      password,
      department,
      year,
      contact,
      address,
      semester,
      dob,
    } = req.body;

    const update = Student.findByIdAndUpdate(
      _id,
      {
        name,
        email,
        password,
        department,
        year,
        contact,
        address,
        semester,
        dob,
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

exports.getByYear = async (req, res) => {
  try {
    const { year } = req.params;

    await Student.find({ year }, (err, student) => {
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

exports.getByDept = async (req, res) => {
  try {
    const { dept } = req.params;

    await Student.find({ department: dept }, (err, student) => {
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

exports.getAdmins = async (req, res) => {
  try {
    await Admin.find()
      .sort({ name: 1 })
      .exec((err, admin) => {
        if (err || !admin) {
          return res.status(400).json({
            error: "Something Went Wrong!",
          });
        }

        return res.json(admin);
      });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.addSubject = async (req, res) => {
  try {
    const { name, semester, year, department, code } = req.body;

    if (!name || !semester || !year || !department) {
      return res.status(400).json({ error: "All Fields are Reqiored!" });
    }

    const existing = await Subject.findOne({ name });

    if (existing) {
      return res.status(400).json({ error: "Subject Already Exists!" });
    }

    const saveSubject = new Subject({
      // code,
      name,
      semester,
      year,
      code,
      department,
    });

    await saveSubject.save((err, subject) => {
      if (err || !subject) {
        return res.status(400).json({ error: errror.message });
      }
      return res.json({
        subject,
        message: "Subject Added!",
      });
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    await Subject.find()
      .sort({ semester: 1 })
      .exec((err, subject) => {
        if (err || !subject) {
          return res.status(400).json({
            error: "Something Went Wrong!",
          });
        }

        return res.json(subject);
      });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const id = req.params.id;
    await Subject.findByIdAndDelete({ _id: id }).exec((err, response) => {
      if (err) {
        return res.status(400).json({
          error: "Something Went Wrong",
        });
      }
      return res.json("Successfully Deleted!");
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.scheduleExam = async (req, res) => {
  try {
    const { subjectName, year, date, time, department, sem, hrs, subjectCode } =
      req.body;

    const existing = await Exam.findOne({ subject: subjectName });

    if (existing) {
      return res.status(400).json({
        error: "Exam Already Scheduled For This Subject!",
      });
    }

    if (!subjectName || !date || !time || !department || !sem || !hrs) {
      return res.status(400).json({
        error: "All Fields are Required!",
      });
    }

    const saveExam = new Exam({
      subject: subjectName,
      date,
      time,
      semester: sem,
      hrs,
      subjectCode,
      department,
      year,
    });

    await saveExam.save((err, exam) => {
      if (err || !exam) {
        return res.status(400).json({
          error: "Something Went Wrong",
        });
      }

      return res.json({ message: `Exam Scheduled for ${exam.subject} !` });
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
exports.getExamSchedule = async (req, res) => {
  try {
    await Exam.find()
      .sort({ date: 1 })
      .exec((err, exam) => {
        if (err || !exam) {
          return res.status(400).json({
            error: "Something Went Wrong!",
          });
        }

        return res.json(exam);
      });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.getExamScheduleByYear = async (req, res) => {
  try {
    const { year } = req.params;

    await Exam.find({ year })
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

exports.deleteExam = async (req, res) => {
  try {
    const id = req.params.id;
    await Exam.findByIdAndDelete({ _id: id }).exec((err, response) => {
      if (err) {
        return res.status(400).json({
          error: "Something Went Wrong",
        });
      }
      return res.json("Successfully Deleted!");
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.addResult = async (req, res) => {
  try {
    const {
      name,
      subject,
      subjectCode,
      enrollmentNumber,
      semester,
      department,
      obtainedMarks,
      totalMarks,
    } = req.body;

    if (
      !name ||
      !subject ||
      !subjectCode ||
      !enrollmentNumber ||
      !semester ||
      !department ||
      !obtainedMarks ||
      !totalMarks
    ) {
      return res.status(400).json({
        error: "All Fields Are Required!",
      });
    }

    const exists = await Mark.findOne().where({
      subjectCode: req.body.subjectCode,
      enrollmentNumber: req.body.enrollmentNumber,
    });

    if (exists) return res.status(400).json({ error: "Already Added!" });

    const saveRes = new Mark({
      name,
      subject,
      subjectCode,
      enrollmentNumber,
      semester,
      department,
      obtainedMarks,
      totalMarks,
    });
    await saveRes.save(async (err, mark) => {
      if (err || !mark) {
        return res.status(400).json({
          error: "Something Went Wrong!",
        });
      }
      const findMarks = await Mark.find({ enrollmentNumber });
      const findSubjects = await Subject.find({ semester });
      const findEmail = await Student.find({ enrollmentNumber });

      if (findMarks.length === findSubjects.length) {
        const link = `https://project-sms.netlify.app/view/result/${enrollmentNumber}`;
        const mail = {
          to: findEmail[0].email,
          from: "yash@no-reply.com",
          subject: "Your Result Has Been Declared ",
          html: `<h1>Hello, ${name}</h1>
  <h4>Your Result Has been declared<h4>
  <h4>Your Enrollment Number is : ${enrollmentNumber}</h4>
            <h4><a href=${link}>Click Here to View Your Result</a>
     
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
      }

      return res.json({ message: "Added!" });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.viewResult = async (req, res) => {
  try {
    const enrollment = req.params.enrollment;

    await Mark.find({ enrollmentNumber: enrollment })
      .sort({ subjectCode: 1 })
      .exec((err, result) => {
        if (err || !result) {
          return res.status(400).json({
            error: "Result Not Found!",
          });
        }

        return res.json(result);
      });
  } catch (error) {
    return res.status(400).json({
      error: "Something Went Wrong!",
    });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const id = req.params.id;

    await Mark.findByIdAndDelete({ _id: id }).exec((err, del) => {
      if (err || !del) {
        return res.status(400).json({
          error: "Something Went Wrong",
        });
      }
      return res.json({
        message: "Successfully Deleted!",
      });
    });
  } catch (error) {
    return res.status(400).json({
      error: "Something Went Wrong!",
    });
  }
};
