const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0vnziom.mongodb.net/?retryWrites=true&w=majority`;


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
    const productCollection = client.db('emaJhonUserDb').collection('products');
  
    app.get('/products', async(req, res)=>{
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size)
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.skip(page*size).limit(size).toArray();
      const count = await productCollection.estimatedDocumentCount();
      res.send({count, products});
    });
   app.post('/productsByIds', async(req, res)=>{
    const ids = req.body;
    const objectIds = ids.map(id => new ObjectId(id))
    const query = {_id: {$in: objectIds}};
    const cursor = productCollection.find(query);
    const products = await cursor.toArray();
    res.send(products);
   });
  } finally {
   
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('data send')
})

app.listen(port, ()=>{
    console.log(`${port} is running now!`)
})
