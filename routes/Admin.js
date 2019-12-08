const express = require('express')
const router = express.Router();

router.get("/adminDashboard",(req,res)=>
{
    res.render("Admin/adminDashboard");
});






module.exports=router;