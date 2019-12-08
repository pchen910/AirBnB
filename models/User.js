const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  fname:  
  {
      type:String,
      required:true
  },
  lname:  
  {
      type:String,
      required:true
  },
  email:  
  {
      type:String,
      required:true
  },
  password:  
  {
      type:String,
      required:true
  },

  profilePic :
  {
      type:String
    
  },
  type :
  {
      type:String,
      default:"User"
  },

  admin :
  {
      type:Boolean,
      default:false
  },

  dateCreated :
  {
      type:Date,
      default: Date.now()
  }
});


//The "pre" mongoose function is going to call the below function right before the document is saved to the DB
userSchema.pre("save",function(next){
  
        bcrypt.genSalt(10)
        .then(salt=>{
            bcrypt.hash(this.password,salt)
            .then(hash=>{
                this.password=hash
                // The below code is a call back function that does the following :
                 //It forces the code of execution to  move onto the next code in the execution queue 
                next();
            })
        })

})

const userModel =mongoose.model("User",userSchema);

module.exports=userModel;