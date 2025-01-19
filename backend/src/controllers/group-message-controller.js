import GroupMessage from "../models/group-message-model.js";
import UserGroup from "../models/user-group-model.js";
import cloudinary from "../db/cloudinary.js";
import { getMembersSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const createGroup = async (req, res) => {
  try {
    console.log("req.body", req.user);
    if (!req.body.groupName || !req.body.members[0]) {
      return res
        .status(400)
        .json({ message: "Group name and members are required" });
    }
    const isGroupExist = await UserGroup.findOne({
      name: req.body.groupName,
      admin: req.user._id,
    });
    console;
    if (isGroupExist) {
      return res
        .status(400)
        .json({ message: "Group with this name already exist" });
    }
    const { groupName, members } = req.body;

    const group = new UserGroup({
      name: groupName,
      admin: req.user._id,
      members: members,
    });

    await group.save();

    res.status(201).json(group);
  } catch (error) {
    console.log("Error in getAllUser", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGroupsForSidebar = async (req, res) => {
  try {
    const groups = await UserGroup.find();
    res.status(200).json(groups);
  } catch (error) {
    console.log("Error in getUserForSidebar", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getGroupMessages = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const myId = req.user._id;

    const messages = await GroupMessage.find({
      groupId: groupId,
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendGroupMessages = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { text, image, file } = req.body;
    console.log("req.body", req.body);
    console.log("req.user", req.user);
    console.log("---------------------------------");
    //check if message is empty
    if (!text && !image && !file) {
      return res.status(400).json({ message: "Message can't be empty" });
    }

    const group = await UserGroup.findById(groupId);
    const members = group.members;

    if (req.user._id !== group.admin) {
      members.push(group.admin);
    }

    console.log("members", members);

    let imageUrl;
    //if image is present then upload it to cloudinary

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    //create new message
    const newMessage = new GroupMessage({
      groupId,
      senderId: req.user._id,
      text,
      image: imageUrl,
      file,
      senderPic: req.user.profilePic,
      senderName: req.user.fullName,
    });

    await newMessage.save();

    const recieverSocketIdForGroup = getMembersSocketId(members);

    if (recieverSocketIdForGroup) {
      io.to(recieverSocketIdForGroup).emit("newGroupMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage in message-controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
