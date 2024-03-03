require('dotenv').config();
const express=require("express");
const app=express();

require("./db/conn");
const FormData=require("./model/usermodel");
const bcrypt= require("bcryptjs");
const bodyParser=require("body-parser");
const port= process.env.PORT || 2800;

app.set("view engine","ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.get("/",async(req,res)=>{
    try{
        res.render("in.ejs");
    }catch(e){
        res.send(e)
    }
});
app.get("/submit",async(req,res)=>{
    try{
        res.render("index.ejs");
    }catch(e){
        res.send(e)
    }
});

app.post("/submit",async(req,res)=>{
    try{
        const password=req.body.password;
        const conpassword=req.body.conpassword;
        
        if(password===conpassword){
            const userData=new FormData({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                conpassword: req.body.conpassword
            });

            const token=await  userData.generateToken();

            //hashing
            

            const formData=await userData.save();
            console.log(formData)
            res.render("sigin.ejs");

        }
        else{
            res.send("password are not matching");
        }
        
        

    }catch(e){
        res.send(e);
    }
})
app.get("/signin",async(req,res)=>{
    try{
        res.render("sigin.ejs");
    }catch(e){
        res.send(e)
    }
});

app.post("/signin",async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const usermail=await FormData.findOne({email:email});
        const isMatch=await bcrypt.compare(password,usermail.password);
        const token=await  usermail.generateToken();
        if(isMatch){
            res.status(201).render("in.ejs");
        }else{
            res.send("password not matching");
        }

    }catch(e){
        res.send(e)
    }
})


// const securepasword=async(password)=>{
//     try{
//         const passwordHash=await bcrypt.hash(password,10);
//         console.log(passwordHash);
//         const passwordmatch=await bcrypt.compare(password,passwordHash);
//         console.log(passwordmatch);
//     }catch(e){
//         res.status(400).send(e)
//     }
// }
// securepasword("sah");

const jwt=require("jsonwebtoken");
const createToken=async()=>{
    const token=await jwt.sign({_id:"65d794ad8df1961413cf0a5d"},"ndfjbfjsbvfslvbflvndjlfjdfnsdlnvosdlvcnsdvlsnvsdvlnm");
    console.log(token)

    const userVar=await jwt.verify(token,"ndfjbfjsbvfslvbflvndjlfjdfnsdlnvosdlvcnsdvlsnvsdvlnm")
    console.log(userVar)
}
createToken();


app.listen(port,()=>{
    console.log(`connection at port no ${port}`);
})