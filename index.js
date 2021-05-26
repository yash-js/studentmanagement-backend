const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors( ));
const db = process.env.DB_URI;

mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("💻 Mondodb Connected"))
  .catch((err) => console.error(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));

const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");

app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
