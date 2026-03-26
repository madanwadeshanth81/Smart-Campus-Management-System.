const express = require("express");

const router = express.Router();

const { getDB } = require("../config/db");

router.post("/add", async (req,res)=>{

const db = getDB();

await db.collection("complaints").insertOne(req.body);

res.send("Complaint Submitted");

});

router.get("/all", async (req,res)=>{

const db = getDB();

const complaints = await db.collection("complaints").find().toArray();

res.json(complaints);

});

module.exports = router;