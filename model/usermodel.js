const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const formDataSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    conpassword:{
        type:String,
        unique:true,
        required:true
    },
    tokens:[{
        token:{
        type:String,
        required:true
        }
    }]
})

formDataSchema.methods.generateToken=async function(){
    try{
        console.log(this._id)
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        
        return token;

    }catch(e){
        console.log(e)
    }

}

formDataSchema.pre("save",async function(next){
    if(this.isModified("password")){
        
        console.log(`${this.password}`)
        this.password=await bcrypt.hash(this.password,10);
        this.conpassword=undefined;
    
    }
    next();
})

const FormData=new mongoose.model("FormData",formDataSchema);
module.exports=FormData;