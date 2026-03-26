const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

let db;

async function connectDB(){

await client.connect();

console.log("MongoDB Connected");

db = client.db("smartCampusDB");

}

function getDB(){
return db;
}

module.exports = { connectDB, getDB };