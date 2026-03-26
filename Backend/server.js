const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Connected");
    db = client.db("smartCampusDB");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

connectDB();

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    const existingUser = await db.collection("users").findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    await db.collection("users").insertOne({
      username,
      email,
      password
    });

    res.send("User Registered Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error storing user data");
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const user = await db.collection("users").findOne({ username, password });

    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }

    res.send("Login Successful");
  } catch (error) {
    console.log(error);
    res.status(500).send("Login error");
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const admin = await db.collection("admins").findOne({ username, password });

    if (!admin) {
      return res.status(401).send("Invalid Admin Credentials");
    }

    res.send("Admin Login Successful");
  } catch (error) {
    console.log(error);
    res.status(500).send("Admin login error");
  }
});

app.post("/api/students/add", async (req, res) => {
  try {
    const { studentId, name, department } = req.body;

    if (!studentId || !name || !department) {
      return res.status(400).send("All student fields are required");
    }

    const existingStudent = await db.collection("students").findOne({ studentId });

    if (existingStudent) {
      return res.status(400).send("Student ID already exists");
    }

    await db.collection("students").insertOne({
      studentId,
      name,
      department
    });

    res.send("Student Added Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding student");
  }
});

app.get("/api/students/all", async (req, res) => {
  try {
    const students = await db.collection("students").find().toArray();
    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching students");
  }
});

app.post("/api/complaints/add", async (req, res) => {
  try {
    const { studentId, issue, status } = req.body;

    if (!studentId || !issue) {
      return res.status(400).send("Student ID and Issue are required");
    }

    await db.collection("complaints").insertOne({
      studentId,
      issue,
      status: status || "pending"
    });

    res.send("Complaint Submitted Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error storing complaint");
  }
});

app.get("/api/complaints/all", async (req, res) => {
  try {
    const complaints = await db.collection("complaints").find().toArray();
    res.json(complaints);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching complaints");
  }
});

app.get("/api/users/all", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching users");
  }
});

app.listen(3000,()=>{
console.log("Server running on http://localhost:3000");
});
