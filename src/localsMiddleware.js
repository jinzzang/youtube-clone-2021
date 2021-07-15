import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || false;
    console.log("req.session.loggedInUser : ", req.session.loggedInUser);
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

export const avatarUpload = multer({ dest: 'upload/avatar' });
export const videoUpload = multer({ dest: 'upload/video' });