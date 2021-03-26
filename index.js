// Backend Part ******************************

const express = require('express');
const bodyParser = require('body-parser');
const password = 'Saiful01813';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID; // Object Id from mongo

const uri = "mongodb+srv://organicUser:Saiful01813@cluster0.1ldzw.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express(); // express app creat
app.use(bodyParser.json()); // bodyparser add
app.use(bodyParser.urlencoded({ extended: false })); // url tekhe parse

app.get('/', (req, res) => {
    // res.send("Working");
    res.sendFile(__dirname + '/index.html'); // show a file content
})


client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");
    
    // READ operation
    // load data
    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // Load specific one data item
    app.get('/product/:id', (req, res) => {
        // console.log(req.params.id);
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);

            })
    })


    //CREATE operation
    app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                // console.log("data added");
                // res.send('Success');
                res.redirect('/') // Redirect same page (root url)
            })
        console.log(product);

    })

    //UPDATE operation
    app.patch('/update/:id', (req, res) => {
        console.log(req.params.id);
        productCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                // kun kun property k update korte hobe 
                $set: { price: req.body.price, quantity: req.body.quantity }
            })

            .then(result => {
                res.send(result.modifiedCount> 0);

            })
    })

    // DELETE operation
    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount> 0); // this is use for collect true delete info
            })
    })



    // const product = {name : "modhu",price : 25, quantity:20};

    // app.post("/addProduct", (req, res) => {
    //     collection.insertOne(product)
    //         .then(result => {
    //             console.log('one product added');
    //         })

    // })

    // console.log('database connected');
});

app.listen(3000);