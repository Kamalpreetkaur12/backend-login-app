import express from "express";
import mongoose from "mongoose";
// to read the cookie from the request
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter.js";
import postRouter from "./routers/postRouter.js";
import passport from 'passport';
import configureJwtStrategy from "./middleware/passport-jwt-config.js";
const app = express();
dotenv.config();
// / * db connection */;
mongoose.set("strictQuery", false);
mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2p8ni9g.mongodb.net/${process.env.DB_NAME}`
)
.then(()=>console.log("Connected to the database 😄"))
.catch((error)=> console.log("Oh error", error.message));

/*express and cors middlewares */
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const  corsOption = {
  origin:["http://localhost:3000", "https://user-6f37.onrender.com"],
  credentials: true,
  methods:["GET","POST", "PUT", "DELETE"]
};
app.use(cors(corsOption));
app.use(cookieParser());
//use passport and initialize to verify token
app.use(passport.initialize());
//call the passport configuration
configureJwtStrategy(passport);
// /uploads/images/name with data different


app.use("/uploads", express.static("uploads"));

///routers

app.use("/api/auth", userRouter);
app.use("/api/post", postRouter);
app.use("/",(req,res)=>{
  res.send("hello")
})
app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({msg: error.message || "there is an error"});
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("the server is up and running on 5000"));
