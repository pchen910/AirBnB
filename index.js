const express = require("express");
const handlebars = require('express-handlebars');

const app = express();



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
// The below route handle is called to process the form when submitted
//app.post("/message",(req,res)=>{
//  res.render("message")
//});
const PORT = 3000;
app.listen(PORT);