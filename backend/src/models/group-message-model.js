import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserGroup",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderPic: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    }
    ,
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    file: {
      type: String,
    },
  },
  { timestamps: true }
);

const GroupMessage = mongoose.model("groupMessage", groupMessageSchema);

export default GroupMessage;
