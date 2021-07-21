import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("db on"));




//C:\Program Files\MongoDB\Server\4.9\bin
//C:\Program Files\heroku\bin