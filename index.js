const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3l260.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
   
    try{
        await client.connect();
        const database = client.db('watch_service');
        const watchData = database.collection('watchData');

        const database2 = client.db('all_order');
        const orderedData = database2.collection('orderData');

        app.get("/watches", async(req, res)=>{
            const cursor = watchData.find({});
            const result = await cursor.toArray();
            res.send(result);
            console.log(result)
        })


        app.post("/OrderedProduct", async(req, res) =>{
            const data = req.body;
            data.status = 0
            const result = await orderedData.insertOne(data);
            res.json(result)
        })


    }
    finally{
           //   await client.close(); 
    }

}
run().catch(console.dir);

app.get("/", (req, res) =>{
    res.send("this is my nodejs")
});

app.listen(port, ()=>{
    console.log("the port is hitting", port)
});