const mongoose = require('mongoose');
const Listing = require('../modals/listing');
const initData  = require("./data")


main().then(()=> {
    console.log("Database Connect..........");    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const insertData =  async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((el)=> ({...el, owner: '6900b96c40cceb8e927c6b92'}));
    await Listing.insertMany(initData.data)
    console.log(initData.data);    
}

insertData()