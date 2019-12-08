const express = require("express");
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const fileupload = require('express-fileupload');
const session = require('express-session');

require("dotenv").config({path:'./config/keys.env'});

const userRoutes = require("./routes/User");
const roomRoutes = require("./routes/Room");
const generalRoutes = require("./routes/General");
const adminRoutes = require("./routes/Admin");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// map file upload
app.use(fileupload());

// override the POST
app.use(methodOverride('_method'));

app.use(express.static('public'));

app.use(session({secret:"This is my secret key. This should not be shown to everyone"}))

app.use((req,res,next)=>{

    //This is a global variable that can be accessed by templates
    res.locals.user= req.session.userInfo;
    next();
})

//Map express to all our router objects
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/admin",adminRoutes);
app.use("/room",roomRoutes);

app.engine('handlebars',handlebars());
app.set('view engine', 'handlebars');

// app.get("/",(req,res)=>{

//   res.render("home")

// });
// The below route handle is called to display the FORM page
// app.get("/room",(req,res)=>{
  
//   res.render("room")

// });






const DBURL=`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-za4ky.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
 
mongoose.connect(DBURL, {useNewUrlParser: true,useUnifiedTopology: true})
//The then block will only be executed if the above-mentioned line is successful
.then(()=>{
    console.log(`Database is connected`)
})
//The catch block will only be executed if the connection failed
.catch(err=>{
    console.log(`Something went wrong : ${err}`);
})




// The below route handle is called to process the form when submitted
//app.post("/message",(req,res)=>{
//  res.render("message")
//});
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log(`Server Connected`)
});