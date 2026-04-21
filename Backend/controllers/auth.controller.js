import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../config/generateToken.js";
import uploadOnCloudinary from "../utils/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user (no profile pic at register)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic?.url || "",
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic?.url || "",
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    // update basic fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // 🖼️ upload new profile image
    if (req.file) {

      // 🔴 delete old image (if exists)
      if (user.profilePic?.public_id) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
      }

      // 🟢 upload new image
      const uploadedImage = await uploadOnCloudinary(req.file.path);

      if (uploadedImage) {
        user.profilePic = {
          url: uploadedImage.url,
          public_id: uploadedImage.public_id,
        };
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic?.url || "",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//========================= GOOGLE LOGIN=======================================
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    // create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "google_oauth", // dummy
        profilePic: {
          url: picture,
          public_id: "google",
        },
      });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic?.url || "",
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};