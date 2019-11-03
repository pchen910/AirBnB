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
// The below route handle is called to process the form when submitted
//app.post("/message",(req,res)=>{
//  res.render("message")
//});
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log(`Server Connected`)
});