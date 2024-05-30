const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ussmjv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("menuManageDb").collection("menu");
    const orderCollection = client.db("menuManageDb").collection("order");
    const userCollection = client.db("menuManageDb").collection("user");

    
    
    // API FOR LOADING DATA

    // 1) loading menu data
    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    })

    // 2) loading order data
    app.get('/order', async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    })

    // 3) loading user data
    app.get('/user', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    
    
    
    
    
    
    // API FOR STORING DATA

    // 1) store menu
    app.post('/menu', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await menuCollection.insertOne(item);
      res.send(result);
    })

    // 2) store order 
    app.post('/order', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await orderCollection.insertOne(item);
      res.send(result);
    })

    // 3) store user
    app.post('/user', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await userCollection.insertOne(item);
      res.send(result);
    })


  
    // Updating user role to admin
    app.patch('/user/admin/:id', async (req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    // Cheking if the user is an admin
    app.get('/user/admin/:email', async(req, res)=>{
      const email = req.params.email;
      const query = {email: email};
      const user = await userCollection.findOne(query);
      const result = {admin: user?.role === 'admin'};
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Server is ready.')
})

app.listen(port, () => {
  console.log(`Serrver is running on port ${port}`)
})