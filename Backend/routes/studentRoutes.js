const express = require("express");

const router = express.Router();

const { getDB } = require("../config/db");

router.post("/add", async (req,res)=>{

const db = getDB();

await db.collection("students").insertOne(req.body);

res.send("Student Added");

});

router.get("/all", async (req,res)=>{

const db = getDB();

const students = await db.collection("students").find().toArray();

res.json(students);

});

module.exports = router;