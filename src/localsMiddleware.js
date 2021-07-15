import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || false;
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        return res.redirect("/");
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedInUser) {
        return next();
    } else {
        return res.redirect("/");
    }
}

export const avatarUpload = multer({ dest: 'upload/avatar' });
export const videoUpload = multer({ dest: 'upload/video' });