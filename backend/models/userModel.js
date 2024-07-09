const mongoose = require('mongoose')

const userSchema = new  mongoose.Schema({
    userName :{
        type: String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    profilephoto:{
        typeL:String
    }

} )

module.exports= mongoose.model('Users',userSchema)
