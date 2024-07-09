

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  // check auth
  auth: async (req, res) => {
  
    const token = req?.cookies?.userJwt;
    
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          console.log(err);
          res.json({ success: false, message: err });
        } else {
          const userId = decoded.user;
          console.log(userId ,'userId');
          const userData = await User.findById(userId)
          console.log('userData',userData);
          res.json({ success: true, userData });
        }
      });
    } else {
      res.json({ success: false });
    }
  },

  signup: async (req, res) => {
    try {
     
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      
      const newUser = await User.create(req.body);
      console.log(newUser ,'newuser');

      
      if (newUser) {

        const accessToken = jwt.sign(
          { user: newUser._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '30d' }
        );

        res.cookie('userJwt', accessToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000, 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production' 
        });
        const userId = newUser._id
        const userName = newUser.userName

        res.json({ success: true ,userId,userName});
      } else {
        throw new Error('Something went wrong during user creation.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      
      if (error.code === 11000) {
        res.json({
          success: false,
          message: 'This email is already registered.',
        });
      } else {
        res.json({ success: false, message: error.message });
      }
    }
  },


  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email,password,"hello login");
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        const isValidPassword = bcrypt.compareSync(
          password,
          existingUser.password
        );
        if (isValidPassword) {
          const accessToken = jwt.sign(
            { user: existingUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30d" }
          );
          res.cookie("userJwt", accessToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
          const userData={
            userId : existingUser._id,
            name: existingUser.userName
          }
          const id =  existingUser._id.toString()
          const userName =  existingUser.userName
         
          res.json({ success: true ,id ,userName});
        } else {
          res.json({ success: false, message: "Invalid credentials" });
        }
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      res.json({error, success: false, message: "Something went wrong" });
    }
  },

  userData: async (req, res) => {
    try {
      const userId = req.params.userId;
      
      const userData = await User.findById(userId);
      console.log(userData,'userdata here profile get');
      res.json({success: true, userData})
    } catch (error) {
      res.json({success: false, message: 'something went wrong'})
    }
  },

  // updateProfile: async (req, res) => {
  //   try {
  //     const filename = req?.file?.filename;
  //     const userId = req.body?.userId;

  //     if (filename) {
  //       req.body.profilePhoto = filename
  //     }
      
  //     const updatedUser = await User.findByIdAndUpdate(userId, {
  //       ...req.body,
  //     }, {
  //       upsert: true,
  //       new:true
  //     })
  //     if (updatedUser) {
  //       console.log(updatedUser);
  //       res.json({success: true, updatedUser})
  //     } else {
  //       throw new Error('something went wrong')
  //     }
  //   } catch (error) {
  //     if (error.code === 11000) {
  //       res.json({success: false, message: 'try with different email address'})
  //     } else {
  //       res.json({success: false, message: error})
  //     }
  //   }
  // },

  updateProfile: async (req, res) =>  {
    try {
  
      const filename = req?.file?.filename;
      const userId = req.body?.userId;
  
      if (filename) {
        req.body.profilePhoto = filename;
      }

      const updateData = {
        userName: req.body.userName,
        email: req.body.email,
      };
  
      if (req.file && req.file.filename) {
        updateData.profilephoto = req.file.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        upsert: true,
        new: true
      });
  
  
      if (updatedUser) {
        console.log(updatedUser);
        res.json({ success: true, updatedUser });
      } else {
        throw new Error('something went wrong');
      }
    } catch (error) {
      if (error.code === 11000) {
        res.json({ success: false, message: 'try with different email address' });
      } else {
        res.json({ success: false, message: error.message });
      }
    }
  },
  

  
  logout: (req, res) => {
    res.cookie("userJwt", "", { maxAge: 1 });
    res.json({ success: true});
  },
};




