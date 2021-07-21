import mongoose from "mongoose"


const commentSchema = new mongoose.Schema({
    text: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
    createAt: { type: Date, default: Date.now, required: true },
})


const Comment = mongoose.model("Comment", commentSchema);


export default Comment;