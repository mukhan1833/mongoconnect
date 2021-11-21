import express from "express"
import morgan from "morgan"
import cors from "cors"
import mongoose from "mongoose"

// mongoose.connect('mongodb+srv://dbusman:qwerty123@cluster0.yw1iw.mongodb.net/mychatapp?retryWrites=true&w=majority')
mongoose.connect('mongodb+srv://dbusman:qwerty123@cluster0.yw1iw.mongodb.net/mychatapp?retryWrites=true&w=majority', function(){
    console.log("db connected.....")

});

const User= mongoose.model('users',{
    stname:String,
    stroll:String,
    stdepart:String,
    stsection:String
})

const app = express();
const port= process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(morgan('short'));

app.use((req,res,next)=>{
    console.log("req come");
    next();
})

app.get('/users',(req,res)=>{
    User.find({},(err,users)=>{
        if(!err){
            res.send(users);
        }
        else{
            res.status(500).send("error");
        }
    })
})

app.get('/user/:id',(req,res)=>{
    User.findOne({_id:req.params.id},(err,user)=>{
    if(!err){
        res.send(user);
    }else{
        res.send(500).send("error")
    }
})
})

app.post('/user',(req,res)=>{
    if(!req.body.stname || !req.body.stroll || !req.body.stdepart || !req.body.stsection)
    {
        res.status(400).send('invalid code')
    }
    else{
        const newUser=new User({
            stname:req.body.stname,
            stroll:req.body.stroll,
            stdepart:req.body.stdepart,
            stsection:req.body.stsection
        })
        newUser.save().then(()=>{
            console.log("user created");
            res.send("user created");
        })
   }
})

app.put('/user/:id',(req,res)=>{
    let updateUser={};
    
        if(req.body.stname){
            updateUser.stname=req.body.stname
        }
        if(req.body.stroll){
            updateUser.stroll=req.body.stroll
        }
        if(req.body.stdepart){
            updateUser.stdepart=req.body.stdepart
        }
        if(req.body.stsection){
            updateUser.stsection=req.body.stsection
        }
        User.findByIdAndUpdate(req.params.id,updateUser,{new:true},
        (err,data)=>{
            if(!err){
                res.send(data);
            }
            else{
                res.status(500).send("error");
            }
        })
        })

        app.delete('/user/:id',(req,res)=>{
            User.findByIdAndRemove(req.params.id,(err,data)=>{
                if(!err)
                {
                    res.send("user deleted")
                }
                else
                {
                    res.status(500).send("error")
                }
            })
        })
app.listen(port,()=>{
    console.log("server is running");
})