const express =require("express");
const app= express();
const path =require('path');
const userModel=require('./models/user.models.js')


app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.render("index");
})
app.get('/delete/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        await userModel.findByIdAndDelete(req.params.id); // Correct usage of findByIdAndDelete
        res.redirect('/read');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
});

app.get('/read',async (req,res)=>{
    let users = await userModel.find();
    res.render("read",{users});
})
app.post('/create',async (req,res)=>{
    let {name , email , image} =req.body;

    let createdUser = await userModel.create({
       name,
       email,
       image
    });
    res.redirect("/read");
})

app.get('/edit/:id',async (req,res)=>{
    let user =await userModel.findOne({_id:req.params.id})
    res.render("edit",{user});
})

app.post('/update/:userid',async (req,res)=>{
    let{image,name,email}=req.body;

    let user = await userModel.findOneAndUpdate({_id:req.params.userid},{image,name,email});
    res.redirect("/read");
})


app.listen(3000, () => {
    console.log("Server is live");
});