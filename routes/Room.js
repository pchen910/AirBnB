const express = require('express')
const router = express.Router();
const Room = require("../models/Room");
const hasAccess= require("../middleware/auth");
const path = require("path");

router.get("/addroom",hasAccess,(req,res)=>
{
    res.render("Rooms/addRoom")
});

//Route to process user's request and data when the admin create rooms
router.post("/addroom",hasAccess,(req,res)=>
{
    const newRoom=
    {
        title:req.body.title,
        price:req.body.price,
        description : req.body.description,
        location : req.body.location,
        profilePic : req.body.profilePic
    }

    const errors= [];

    //Test to see if user did not upload file
    if(req.files==null)
    {
        errors.push("Sorry you must upload a file")
    }   

    //User uploaded file
    else
    {       //file is not an image
            if(req.files.profilePic.mimetype.indexOf("image")==-1)
            {
                errors.push("Sorry you can only upload images : Example (jpg,gif, png) ")
            }
    }

    //Has errors
    if(errors.length > 0)
    {
        res.render("Rooms/addRoom",{
            errors:errors,
            // firstName :newUser.firstName,
            // lastName : newUser.lastName,
            // email : newUser.email
        })
    }
    
    else
    {
        const room = new Room(newRoom)
        room.save()
        .then(room =>{

            //rename file to include the userid
            req.files.profilePic.name = `db_${room._id}${path.parse(req.files.profilePic.name).ext}`
            
            //upload file to server
            req.files.profilePic.mv(`public/uploads/${req.files.profilePic.name}`)
            .then(()=>{

                //Then is needed to refer to associate the uploaded image to the user
                Room.findByIdAndUpdate(room._id,{
                    profilePic:req.files.profilePic.name 
                })
                .then(()=>{

                    console.log(`File name was updated to the database`);
                    
                })
                .catch(err=>console.log(`Error : ${err}`));
            });
            

        })
        .catch(err=>console.log(`Error :${err}`));
        
        console.log(`Room was added to the list`);
        console.log(`${room}`);
        res.redirect("/room/list");
    }
  
});

////Route to fetch all tasks
router.get("/list",hasAccess,(req,res)=>
{

    Room.find()
    .then((rooms)=>{
        res.render("Rooms/roomDashboard",
        {
            lists:rooms
        });
    })
    .catch(err=>console.log(`Error : ${err}`));
});

router.get("/roomPage",(req,res)=>
{

    Room.find()
    .then((rooms)=>{
        res.render("Rooms/room",
        {
            roomLists:rooms
        });
    })
    .catch(err=>console.log(`Error : ${err}`));
});

router.post("/search",(req,res)=>{

    const errors = [];

    if(req.body.city == "")
    {
        errors.push("Please select a city")
    }
    if(errors.length > 0)
    {

        res.render("Rooms/home",
        {
           login:errors 
        })
    }


        Room.find({location:req.body.city})
        .then((rooms)=>{        
            res.render("Rooms/roomSearch",
            {
                searchLists:rooms
            });
        
    })
    .catch(err=>console.log(`Error : ${err}`));
    
})

//Route to direct user to the room profile page
router.get("/profile/:id",hasAccess,(req,res)=>{

    Room.findById(req.params.id)
    .then((room)=>{
        res.render("Rooms/editRoom",{
            roomDocument:room
        })
    })
    .catch(err=>console.log(`Error : ${err}`));
})


//Route to direct user to edit task form
router.get("/edit/:id",hasAccess,(req,res)=>
{
    Room.findById(req.params.id)
    .then((room)=>{

        res.render("Rooms/editRoom",{
            roomDocument:room
        })

    })
    .catch(err=>console.log(`Error : ${err}`));
});

//Route to update a task based on the information entered in the task form
router.put("/edit/:id",hasAccess,(req,res)=>
{
    Room.findById(req.params.id)
    .then((room)=>{

        room.title=req.body.title;
        room.peice=req.body.price;
        room.description=req.body.description;
        room.location=req.body.location;
        room.profilePic=req.body.profilePic;

        room.save()

        .then(()=>{
           res.redirect("/room/list") 
        })
        .catch(err=>console.log(`Error : ${err}`));

    })
    .catch(err=>console.log(`Error : ${err}`));
});

router.get("/room",(req,res)=>
{
    res.render("Rooms/room");
});

//Route used to delete task 
router.delete("/delete/:id",hasAccess,(req,res)=>
{
    Room.deleteOne({_id:req.params.id})
    .then((room)=>{

        res.redirect("/room/list");
    })
    .catch(err=>console.log(`Error : ${err}`));
});

//Route to direct user to home page


module.exports=router;
