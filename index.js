const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middlewires
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qjj43hj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const socialServicesCollection = client.db('volunteerWork').collection('socialServices');
        const bookedServicesCollection = client.db('volunteerWork').collection('bookedServices');

        // load all the sercices from db
        app.get('/socialservices', async (req, res) => {
            const query = {};
            const cursor = socialServicesCollection.find(query);
            const socialWorks = await cursor.toArray();
            res.send(socialWorks);
        })
        // load booked sercices from db
        app.get('/bookedservices', async (req, res) => {
            const email = req.query.email;
            const query = {email:email};
            const cursor = bookedServicesCollection.find(query);
            const bookedServices = await cursor.toArray();
            res.send(bookedServices);
        })
        //add new servcie to db
        app.post('/addservice', async (req, res) => {
            const newService = req.body;
            const result = await socialServicesCollection.insertOne(newService);
            res.send(result);
        })
        //add booked service to db
        app.post('/bookservice', async (req, res) => {
            const bookedService = req.body;
            const result = await bookedServicesCollection.insertOne(bookedService);
            res.send(result);
        })
        //load single service from db
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await socialServicesCollection.findOne(query);
            res.send(result);
        })
        //delete booked service 1 by one from db
        app.delete('/bookedservice/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookedServicesCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})