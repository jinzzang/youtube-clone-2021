import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch";


export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "edit-profile" });
}
export const postEdit = async (req, res) => {
    const { body: {
        email,
        username,
        name
    }, session: {
        user: { _id }
    }, file } = req;
    const isHeroku = process.env.NODE_ENV === "production";

    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? (isHeroku ? file.location : "/" + file.path) : user.avatarUrl,
        email,
        username,
        name: name
    }, { new: true });

    req.session.user = updatedUser;
    req.flash("error", "성공!");
    return res.redirect("/users/edit-profile");
}

export const getLogin = (req, res) => {
    res.render("login", { pageTitle: "login" });
}
export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const pageTitle = "login";
    const user = await User.findOne({ email, socialOnly: false });
    if (!user) {
        return res.status(404).render("login", { pageTitle, errorMessage: "User doesnt exit" });
    }
    try {
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(404).render("login", { pageTitle, errorMessage: "password doesnt match" });
        }
    } catch (error) {
        console.log(error, postLogin);
    }
    req.session.loggedIn = true;
    req.session.user = user;

    res.redirect('/');
}
export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
}
export const postJoin = async (req, res) => {
    const { email, username, password, password2, name } = req.body;
    const pageTitle = "Join"
    if (password !== password2) {
        return res.status(400).render("join", { pageTitle, errorMessage: "Confirm Password doesn`t match" });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("join", { pageTitle, errorMessage: "username/email already exists" });
    }
    try {
        await User.create({ email, username, password, name });
    } catch (error) {
        console.log(error, "postJoin");
    }


    res.redirect("login");
}

export const githubLoginStart = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize"
    const config = {
        client_id: process.env.GH_CLIENT_ID,
        scope: "read:user user:email",
        allow_signup: false
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    res.redirect(finalUrl);
}

export const finishGithub = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token"
    const config = {
        client_id: process.env.GH_CLIENT_ID,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const encodingConfig = new URLSearchParams(config);
    const finalUrl = `${baseUrl}?${encodingConfig}`;
    const tokenRequest = await (await fetch(finalUrl, {
        method: "POST",
        headers: {
            'Accept': "application/json"
        }
    })).json();
    if ("access_token" in tokenRequest) {
        const accessToken = tokenRequest.access_token;
        const apiUrl = "https://api.github.com";
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers: {
                "Authorization": `token ${accessToken}`
            }
        })).json();

        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
            headers: {
                "Authorization": `token ${accessToken}`
            }
        })).json();
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        if (!emailObj) {
            return res.redirect("/login");
        }
        console.log(userData, emailData);
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                name: userData.name,
                avatarUrl: userData.avatar_url,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location
            });
        }

        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        res.redirect("/login");
    }
}

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
    }
    return res.render("users/change-password", { pageTitle: "change-password" });
}
export const postChangePassword = async (req, res) => {
    const { body: {
        oldPassword,
        newPassword1,
        newPassword2
    }, session: {
        user: { _id }
    } } = req;

    if (newPassword1 != newPassword2) {
        return res.render("users/change-password", { pageTitle: "change-password", errorMessage: "newPassword doesn`t match" });
    }
    const user = await User.findById(_id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
        return res.status(400).render("users/change-password", { pageTitle: "change-password", errorMessage: "oldPassword is incorrect" });
    }
    user.password = newPassword1;
    await user.save();
    req.flash("error", "성공!");
    return res.redirect('/users/logout');



}
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}

export const deleteUser = (req, res) => res.send("deleteUser");

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        }
    });
    console.log(user);
    if (!user) {
        res.status(404).render("404", { errorMessage: "User Not Found" });
    }
    res.render("users/profile", { pageTitle: user.name, user });
}