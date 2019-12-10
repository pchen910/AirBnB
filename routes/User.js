/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();
const bcrypt= require("bcryptjs");
//const path = require("path");

//This allows you to pefrom CRUD operations on the User colections 
const User = require("../models/User");

router.get("/registration",(req,res)=>{
  
    res.render("User/registration")
    
});
  
router.post("/registration",(req,res)=>
  {

    const newUser = {
        fname : req.body.fname,
        lname : req.body.lname ,
        email : req.body.email,
        password : req.body.password,
        birthday : req.body.birthday
    }

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

          if(req.body.cpassword != newUser.password)
          {
            errors.push("Passwords not match")
          }
      }
      
      
  
      if(req.body.birthday=="")
      {
          errors.push("Please select your birthday")
      }

      if({email:req.body.email})
      {
        errors.push("Email has been used")
      }
      // User.findOne({email:req.body.email})
      //   .then((email)=>{   
      //     if(email)
      //       {     
      //         errors.push("Email has been used")
      //       }
      //   })
  
      //This means that there are errors
      if(errors.length > 0)
      {
        res.render("User/registration",
          {
            registration:errors 
          })
      }
        
        
  
      //This means that there are no errors
      else
      {
        
      //To create a User document we have to call the Model constructor
      const user = new User(newUser);
      user.save()
      .then(() => 
      {
          console.log('Your information was inserted into database')
      })
      .catch((err)=>{
          console.log(`Your information was not inserted into the database because ${err}`)  
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
          res.redirect("/user/login");
    }
        
});

  router.get("/login",(req,res)=>{
  
    res.render("User/login");
    
  });
  
  router.post("/login",(req,res)=>
  {
    const errors =[];
    const loginData = 
    {
        email:req.body.email,
        password:req.body.password
    }

    if(loginData.email=="")
      {
          errors.push("Please enter an email")
      }
  
      if(loginData.password=="")
      {
          errors.push("Please enter the passwords")
      }
      const passwd = /^[a-zA-Z0-9]+$/;
       if(!loginData.password.match(passwd))
      {
         errors.push("Password only allows letters or numbers")
      }
  
          if(loginData.password.length < 6 || loginData.password.length > 12)
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
    
    User.findOne({email:loginData.email})
    .then(user=>{
          //This means that there was no matching email in the database
          if(user==null)
          {
              errors.push("Sorry your email was not found");
              res.render("User/login",{
                  errors: errors
              })
          }
  
          //This reprsents tha the email exists
          else
          {
              bcrypt.compare(loginData.password,user.password)
              .then(isMatched=>{
  
                  if(isMatched==true)
                  {
                      //It means that the user is authenticated 
  
                      //Create session 
                      if(user.type == "User")
                      {
                        req.session.userInfo=user;
                        res.redirect("/user/userDashboard")
                      }
                      
                      else if(user.type == "Admin")
                      {
                        req.session.userInfo=user;
                        res.redirect("/admin/adminDashboard")
                      }

                  }
  
                  else
                  {
                      errors.push("Sorry, your password does not match");
                      res.render("User/login",{
                          errors:errors
                      })
                  }
  
              })
  
              .catch(err=>console.log(`Error :${err}`));
        }
    })
    .catch(err=> console.log(`Something occured ${err}`));

      
  });

  router.get("/logout",(req,res)=>{
      req.session.destroy();
      res.redirect("/user/login");
  });

  router.get("/userDashboard",(req,res)=>
  {
    res.render("User/userDashboard");
  });


module.exports=router;