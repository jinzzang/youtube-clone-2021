import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./router/rootRouter";
import userRouter from "./router/userRouter";
import videoRouter from "./router/videoRouter";
import flash from "express-flash";
import { localsMiddleware } from "./localsMiddleware";
import apiRouter from "./apiRouter";



const app = express();

app.use(morgan("dev"));
app.use(flash());
app.set("view engine", "pug");
app.set("views", process.cwd() + '/src/views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL })
}));
app.use(localsMiddleware);

app.use('/', rootRouter);
app.use('/upload', express.static('upload'));
app.use('/static', express.static('assets'));
app.use('/users/static', express.static('assets'));
app.use('/videos/static', express.static('assets'));
app.use('/api', apiRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

export default app;

