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

        const database3 = client.db('all_reviews');
        const reviewData = database3.collection('reviews');

        const database4 = client.db('all_users');
        const usersData = database4.collection('users');
        
        //product database server-------------------
        //product get method ---------------------
        app.get("/watches", async(req, res)=>{
            const cursor = watchData.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // product post method ---------------------
        app.post("/watches", async(req, res) =>{
            const data = req.body;
            const result = await watchData.insertOne(data);
            res.json(result)
        })


        //product delete method-------------
        app.delete("/watches/:id", async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await watchData.deleteOne(filter);
            res.json(result)
        })


       // order database server--------------- 
       // simple get method to load all ordered products-------
       app.get("/OrderedProduct", async(req, res) =>{
           const product = orderedData.find({});
           const result = await product.toArray();
           res.send(result);
       })

       // order get method with email------------------
        app.get("/OrderedProduct/:email", async(req, res)=>{
            const email = req.params.email;
            const data = orderedData.find({email: email});
            const allOrders = await data.toArray();
            res.send(allOrders);
          })
        
       // orders post method-------------------------
        app.post("/OrderedProduct", async(req, res) =>{
            const data = req.body;
            data.status = 0
            const result = await orderedData.insertOne(data);
            res.json(result)
        })

        //update status-------------------
        app.put("/OrderedProduct/:id", async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const updateDoc = {
                $set: {
                    status: 1
                },
            }
            const options = { upsert: true };
            const result = await orderedData.updateOne(filter, updateDoc, options );
            res.send(result)
            console.log(result)

        })

        //delete my orders method--------------------
        app.delete("/OrderedProduct/:id", async(req, res)=>{
            const id = req.params.id;
            const getItem = {_id: ObjectId(id)}
            const deleteItem = await orderedData.deleteOne(getItem)
            res.json(deleteItem)
        })


    //    reviews section database server ---------
    //    reviews get method-------------------
        app.get("/review", async(req, res)=>{
            const cursor = reviewData.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

    //    reviews post method--------------
        app.post("/review", async(req, res) =>{
            const data = req.body;
            const result = await reviewData.insertOne(data);
            res.json(result)
        })
        


        // users database server------------------
        //user get method------------------------
        app.get('/users/:email', async(req, res)=>{
            const email = req.params.email;
            const query = { email : email };
            const user = await usersData.findOne(query);
            let isAdmin = false ;
            if(user?.role === 'admin'){
                isAdmin = true;
            }
            res.send({admin : isAdmin});
        })

        // user post method --------------------
        app.post("/users", async(req, res)=>{
            const user = req.body
            const result= await usersData.insertOne(user);
            res.json(result);
        })

        //user put method--------------------------
        // app.put("/users", async(req, res)=>{
        //     const user = req.body;
        //     console.log('put', user)
        //     const filter = {email: user.email};
        //     const options = {upsert: true};
        //     const updateDoc = {$set: user};
        //     const result = await usersData.updateOne(filter, options, updateDoc);
        //     res.json(result);
        //     console.log(result)
            
        // })


        app.put("/users/admin", async(req, res)=>{
            const user = req.body;
            const filter = { email: user.email};
            const updateDoc = {$set: {role: 'admin'}};
            const result = await usersData.updateOne(filter, updateDoc);
            res.send(result);
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