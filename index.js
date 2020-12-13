// EXPRESS and other Setups
const express = require('express');
const hbs = require('hbs');
const MongoUtil = require('./MongoUtil.js');
const wax = require('wax-on');

// load in environment variables
require('dotenv').config();

// Create app 
const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'))

// Setup template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

async function main() {
    const MONGO_URL = process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "sample_airbnb");
    let db = MongoUtil.getDB();
    // let results = await db.collection('listingsAndReviews').find().limit(10).toArray();
    // console.log(results);

    // ROUTES
    app.get('/', async (req, res)=>{
        let results = await db.collection('listingsAndReviews').find({},{
            'name': 1, 'address': 1
        }).limit(10).project({'name':1, 'address':1}).toArray();
        res.render('listings', {
            'results':results
        })
    })
}

main()
// LISTEN
app.listen(3000, () => {
    console.log("Server is running")
})