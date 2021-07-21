import fetch from "node-fetch";
import Comment from "../models/Comment";
import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ createAt: 'desc' }).populate("owner");
        console.log(videos);
        res.render("home", { pageTitle: "home", videos });
    } catch (error) {
        console.log(error);
    }
}


export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    if (!video) {
        return res.render("404", { pageTitle: "Video Not Found" });
    }
    return res.render("watch", { pageTitle: `Watcing ${video.title}`, video });
}

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({ title: { $regex: new RegExp(`${keyword}$`, "i") } }).populate("owner");
    }
    res.render("Search", { pageTitle: "Search", videos });
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    const { session: { user: { _id } } } = req;
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner._id) !== String(_id)) {
        req.flash("error", "업로더와 다른 사람입니다.");
        return res.status(403).redirect('/');
    }
    return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
}

export const postEdit = async (req, res) => {
    const { title, description, hashtags } = req.body;
    const { id } = req.params;
    const { session: { user: { _id } } } = req;
    const video = await Video.exists({ _id: id });

    if (!video) {
        return res.status(404).render("404", { errorMessage: "Video Not Found" });
    }
    if (String(video.owner._id) !== String(_id)) {
        req.flash("error", "업로더와 다른 사람입니다.");
        return res.status(403).redirect('/');
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags)
    })
    req.flash("error", "수정 성공!");
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => res.render("upload", { pageTitle: "Upload" });
export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    const { video, thumb } = req.files;
    const { user: { _id } } = req.session;
    const user = await User.findById({ _id });
    try {
        const newVideo = await Video.create({
            fileUrl: video[0].path,
            thumbUrl: thumb[0].path,
            owner: _id,
            title,
            description,
            hashtags: Video.formatHashtags(hashtags)
        });
        console.log(newVideo.thumbUrl);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        res.render('/videos/upload', { errorMessage: error.massage });
    }
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    const { session: { user: { _id } } } = req;
    if (String(video.owner._id) !== String(_id)) {
        return res.status(403).redirect('/');
    }
    await Video.findByIdAndDelete(id);
    req.flash("error", "삭제 성공!");
    res.redirect('/');
}

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404)
    }
    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
}

export const createComment = async (req, res) => {
    const {
        body: { text },
        params: { id },
        session: { user }
    } = req;

    const video = await Video.findById(id);
    if (!video) {
        res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
    });
    video.comments.push(comment._id);
    video.save();
    res.status(200).json({ newComment: comment._id });
}

export const deleteComment = async (req, res) => {
    console.log(1);
    const { id, commentId } = req.params;
    const { user } = req.session;
    const video = await Video.findById(id);
    const comment = await Comment.findById(commentId);
    if (!video || !comment) {
        return res.sendStatus(404);
    } else {
        if (String(user._id) === String(comment.owner)) {
            await Comment.findByIdAndDelete(commentId);
            video.comments.pull(commentId);
            video.save();
            return res.sendStatus(200);
        } else {
            return res.sendStatus(400);
        };
    };
}