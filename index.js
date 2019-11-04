const express = require("express");
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.engine('handlebars',handlebars());
app.set('view engine', 'handlebars');

app.get("/",(req,res)=>{

  res.render("home")

});
// The below route handle is called to display the FORM page
app.get("/room",(req,res)=>{
  
  res.render("room")

});

app.get("/registration",(req,res)=>{
  
  res.render("registration")
  
});

app.post("/registration",(req,res)=>
{
  const errors =[];

    if(req.body.email=="")
    {
        errors.push("Please enter an email")
    }

    if(req.body.fname=="")
    {
        errors.push("Please enter your first name")
    }


    if(req.body.lname=="")
    {
        errors.push("Please enter your last name")
        
    }
    
    if(req.body.password=="")
    {
        errors.push("Please enter the passwords")
    }
      /*
      if (req.body.password != "abcdefghijklmnopqrstuvwxyz" || req.body.password != "ABCDEFGHIJKLMNOPQRSTUVWXYZ" || req.body.password !="1234567890")
      */
     
     //const result = req.body.password.match(passwd)
     else
    {
      const passwd = /^[a-zA-Z0-9]+$/;    
      if(!req.body.password.match(passwd))
        {
          errors.push("Password only allows letters or numbers")
        }

        if(req.body.password.length < 6 || req.body.password.length > 12)
        {
        errors.push("Please enter between 6 - 12 chracters")
        }
    }
    
    

    if(req.body.birthday=="")
    {
        errors.push("Please select your birthday")
    }

    

      //This means that there are errors
      if(errors.length > 0)
      {

          res.render("registration",
          {
             registration:errors 
          })
      }

      //This means that there are no errors
      else
      {

        const Schema = mongoose.Schema;

        const taskSchema = new Schema({
        email: String,
        fname:  String,
        lname: String,
        password: String,
        birthday: String
      });

    //This creates a Model called Tasks. This model represents our Collection in our database
      const Task = mongoose.model('Task', taskSchema);

      const formData ={
        email:req.body.email,
        fname:req.body.fname,
        lname:req.body.lname,
        password:req.body.password,
        birthday:req.body.birthday
    }
    //To create a  Task document we have to call the Model constructor
    const sign = new Task(formData);
    sign.save()
    .then(() => 
    {
        console.log('Task was inserted into database')
    })
    .catch((err)=>{
        console.log(`Task was not inserted into the database because ${err}`)
    })


    const nodemailer = require('nodemailer');
    const sgTransport = require('nodemailer-sendgrid-transport');

    const options = {
      auth: {
              api_key: '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'
            }
    }

    const mailer = nodemailer.createTransport(sgTransport(options));

    const email = {
          to: `${req.body.email}`,
          from: 'bs810910@gmail.com',
          subject: 'Welcome',
          text: `Hellow, ${req.body.fname} ${req.body.lname}!\n You have sign up successfully from our AirBnB.`,
            html: ``
        };
         
    mailer.sendMail(email, (err, res)=> {
          if (err) { 
            console.log(err) 
          }
            console.log(res);
        });

      //REDIRECT THE USER TO THE DASHBOARD ROUTE
        res.redirect("/");
    }
      
});

app.get("/login",(req,res)=>{
  
  res.render("login")
  
});

app.post("/login",(req,res)=>
{
  const errors =[];

    if(req.body.email=="")
    {
        errors.push("Please enter an email")
    }

    if(req.body.password=="")
    {
        errors.push("Please enter the passwords")
    }
    const passwd = /^[a-zA-Z0-9]+$/;
     if(!req.body.password.match(passwd))
    {
       errors.push("Password only allows letters or numbers")
    }

        if(req.body.password.length < 6 || req.body.password.length > 12)
        {
        errors.push("Please enter between 6 - 12 chracters")
        }


    if(errors.length > 0)
      {

          res.render("login",
          {
             login:errors 
          })
      }
});


const DBURL= "mongodb+srv://WEB322:azx810910@cluster0-za4ky.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(DBURL, {useNewUrlParser: true})
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