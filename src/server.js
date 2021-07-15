import express from "express"
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./router/rootRouter";
import userRouter from "./router/userRouter";
import videoRouter from "./router/videoRouter";
import "./db";
import "./models/Video";
import { localsMiddleware } from "./localsMiddleware";
import apiRouter from "./apiRouter";



const app = express();

app.use(morgan("dev"));



app.set("view engine", "pug");
app.set("views", process.cwd() + '/src/views');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: `mongodb://127.0.0.1:27017/wetube` })
}));
app.use(localsMiddleware);

app.use('/', rootRouter);
app.use('/upload', express.static('upload'));
app.use('/static', express.static('assets'));
app.use('/users/static', express.static('assets'));
app.use('/videos/static', express.static('assets'));
app.use('/users', userRouter);
app.use('/videos', videoRouter);
app.use('/api', apiRouter);

export default app;
