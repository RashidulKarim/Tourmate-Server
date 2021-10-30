const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

//middleWare
app.use(cors())
app.use(express.json())

//setting for mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djl2y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async() =>{
        try{
            await client.connect();
            const db = client.db(process.env.DB_NAME);
            const packages = db.collection('packages');
            const order = db.collection('order');
            const reviews = db.collection('reviews');

        //add a package to db using post
        app.post('/addPackage', async(req, res) =>{
                const packageInfo = req.body.body;
                const result = await packages.insertOne(packageInfo)
                res.send(result)
        })
        //add a review to db using post
        app.post('/addReview', async(req, res) =>{
                const review = req.body.body;
                const result = await reviews.insertOne(review)
                res.send(result)
        })

        //find all package by get
        app.get('/packages', async(req, res) =>{
            const finding = packages.find({})
            const allPackages = await finding.toArray()
            res.send(allPackages)
        })
        //find all review by get
        app.get('/reviews', async(req, res) =>{
            const finding = reviews.find({})
            const allReviews = await finding.toArray()
            res.send(allReviews)
        })

        //find single package by id
        
        app.get('/package/:id', async(req, res)=>{
            const params = req.params.id;
            const id = {_id: ObjectId(params)}
            const package = await packages.findOne(id)
            res.send(package)
            
        })

        //order confirm by post

        app.post('/confirmOrder',async(req, res)=>{
            const orderInfo = req.body.body;
            const result = await order.insertOne(orderInfo)
            res.send(result)
        })

        // getting all orders
        app.get("/allOrder", async(req, res)=>{
            const findingOrders = order.find({});
            const orders = await findingOrders.toArray()
            res.send(orders)
        })
        // getting all filter orders
        app.get("/orders/:email", async(req, res)=>{
            const query = req.params.email
            const email = {email: query}
            const findingOrders = await order.find(email).toArray();
            res.send(findingOrders)
        })
        // delete a order
        app.delete("/delete/:id", async(req, res)=>{
            const query = req.params.id;
            const id = {_id: ObjectId(query)}
            const deleteOrder = await order.deleteOne(id)
            res.send(deleteOrder)
        })

         //update status
    app.put('/order/:id', async(req, res)=>{
        const query = req.params.id 
        const id = {_id: ObjectId(query)}
        const updateDoc = {
            $set: {
              status: "approved"
            },
          };      
        const result = await order.updateOne(id, updateDoc)
        res.send(result)
    })
            
        }
        finally{

        }
}

run().catch(err =>{
    console.log(err)
})




app.get('/', (req, res)=>{
    res.send("Welcome to tourMate server")
})

app.listen(port, ()=>{
    console.log("running on port", port);
    
})