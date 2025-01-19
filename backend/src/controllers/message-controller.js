import Message from "../models/message-model.js";
import User from "../models/user-model.js";
import cloudinary from "../db/cloudinary.js";
import { getRecieverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const fillteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    res.status(200).json(fillteredUsers);
  } catch (error) {
    console.log("Error in getUserForSidebar", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: recieverId } = req.params;
    const { text, image, file } = req.body;

    //check if message is empty
    if (!text && !image && !file) {
      return res.status(400).json({ message: "Message can't be empty" });
    }

    let imageUrl;
    //if image is present then upload it to cloudinary
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    //create new message
    const newMessage = new Message({
      senderId: req.user._id,
      recieverId,
      text,
      image: imageUrl,
      file,
    });

    await newMessage.save();

    const recieverSocketId = getRecieverSocketId(recieverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage in message-controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
