const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/UserDA")
.then(()=>{
    console.log("connected")
})
.catch((e)=>{
    console.log("no conection")
})

