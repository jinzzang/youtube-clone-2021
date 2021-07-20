import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    socialOnly: { type: Boolean, default: false },
    location: { type: String },
    avatarUrl: { type: String },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
});

userSchema.pre("save", async function () {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 5);
        }
    } catch (error) {
        console.log(error);
    }
})

const User = mongoose.model("User", userSchema);

export default User;