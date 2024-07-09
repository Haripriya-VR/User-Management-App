const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
require("dotenv").config();

module.exports = {

  // check auth
  auth: async (req, res) => {
    const token = req?.cookies?.adminJwt;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          const adminId = decoded.user;
          const adminData = await Admin.findById(adminId)
          res.json({ success: true, adminData });
        }
      });
    } else {
      res.json({ success: false, message: 'authentication failed'});
    }
  },


 

  // admin login verification
 
  

   adminLogin : async (req, res) => {
    try {
      console.log('here admin login');
      const credentials = {
        email: 'admin123@gmail.com',
        password: '123456'
      };
      const { email, password } = req.body;
      // Logging to ensure the extracted values
      console.log('Received email:', email);
      console.log('Received password:', password);
      console.log('Expected email:', credentials.email);
      console.log('Expected password:', credentials.password);
      // Mock admin data for testing
      const mockAdminData = {
        _id: 'mockAdminId123',
        email: 'admin123@gmail.com',
        userName: 'Admin User'
      };
  
      if (email.toString() === credentials.email && password === credentials.password) {
        console.log('valid');
        const accessToken = jwt.sign(
          { admin: mockAdminData._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '30d' }
        );
  
        res.cookie('adminJwt', accessToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true
        });
  
        res.json({ success: true, adminData: mockAdminData });
      } else {
        res.json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: 'Something went wrong' });
    }
  },
  

  

  logout: (req, res) => {
    res.cookie("adminJwt", "", { maxAge: 1 });
    res.json({ success: true});
  },

  dashboard: async (req, res) => {
    const searchEmail = req.query.searchEmail || "";
    try {
      const users = await User.find({
        email: {
          $regex: searchEmail,
          $options: "i",
        },
      });
      res.json({ success: true, users });
    } catch (error) {
      res.json({ success: false });
    }
  },

  addUser: async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      if (newUser) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      if (error.code === 11000) {
        res.json({ success: false, message: "already registered" });
      } else {
        res.json({ success: false, message: "something went wrong" });
      }
    }
  },

  editUserProfile: async (req, res) => {
    try {
      console.log(req.body);
      const userId = req.body.id;
      const updatedUser = await User.findByIdAndUpdate(userId, { ...req.body });
      if (updatedUser) {
        const users = await User.find()
        res.json({ success: true, users });
      } else {
        res.json({ success: false, message: "something went wrong" });
      }
    } catch (error) {
      if (error.code === 11000) {
        res.json({ success: false, message: "already registered email" });
      } else {
        res.json({ success: false, message: "something went wrong" });
      }
    }
  },

  deleteAUser: async (req, res) => {
    try {
      const userId = req.query.userId;
      const deleteUser = await User.findByIdAndDelete(userId);
      if (deleteUser) {
        const users = await User.find()
        res.json({ success: true, users });
      } 
      else res.json({ success: false, message: "something went wrong" });
    } catch (error) {
      res.json({ success: false, message: "An error occured" });
    }
  },
};
