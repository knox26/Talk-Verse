import mongoose from "mongoose";

const userGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  admin:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  coverImage:{
    type: String,
  }
},{timestamps: true});


const UserGroup = mongoose.model("userGroup", userGroupSchema);

export default UserGroup;