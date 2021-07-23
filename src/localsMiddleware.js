import multer from "multer";
import multerS3 from "multer-s3"
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    }
})

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
    s3: s3,
    bucket: 'wetube-2021-kr/images',
    acl: 'public-read',
})

const s3VideoUploader = multerS3({
    s3: s3,
    bucket: 'wetube-2021-kr/videos',
    acl: 'public-read',
})

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || false;
    res.locals.isHeroku = isHeroku;
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash("error", "로그인을 해야합니다.");
        return res.redirect("/");
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.user) {
        console.log(req.session.loggedInUser)
        return next();
    } else {
        req.flash("error", "로그아웃을 해야합니다.");
        return res.redirect("/");
    }
}

export const avatarUpload = multer({
    dest: 'upload/avatar',
    limits: {
        fileSize: 10000000,
    },
    storage: isHeroku ? s3ImageUploader : undefined,
});
export const videoUpload = multer({
    dest: 'upload/video',
    storage: isHeroku ? s3VideoUploader : undefined,
});