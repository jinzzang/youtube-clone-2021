import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    description: { type: String, trim: true, minLength: 1 },
    createAt: { type: Date, default: Date.now },
    hashtags: [{ type: String }],
    meta: {
        views: { type: Number, default: 0 },
        rating: { type: Number, default: 0 }
    },
    fileUrl: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Comment"
    }],
    thumbUrl: {
        type: String,
        required: true
    }
});

videoSchema.static("formatHashtags", (hashtags) => {
    return hashtags.split(',').map((word) => word.startsWith('#') ? word : `#${word}`);
})

const Video = mongoose.model("Video", videoSchema);

export default Video;