const express = require("express");

const router = express.Router();

const { getDB } = require("../config/db");

router.post("/register", async (req,res)=>{

const db = getDB();

await db.collection("users").insertOne(req.body);

res.send("User Registered");

});

router.post("/login", async (req,res)=>{

const db = getDB();

const { username,password } = req.body;

const user = await db.collection("users").findOne({username,password});

if(user){
res.send("Login Successful");
}else{
res.send("Invalid Credentials");
}

});

module.exports = router;