import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
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
    }
});

videoSchema.static("formatHashtags", (hashtags) => {
    return hashtags.split(',').map((word) => word.startsWith('#') ? word : `#${word}`);
})

const Video = mongoose.model("Video", videoSchema);

export default Video;