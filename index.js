import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { User } from "./Model/user.model.js";
import connectDB from "./db.js";
import validator from "validator";

const userRoute = express.Router();
const app = express();
const PORT = process.env.PORT || 3500;

const corsWhitelist = (process.env.CORS_WHITELIST || "http://localhost:5173").split(",").map(s => s.trim());
const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        if(corsWhitelist.indexOf(origin) != -1 || !origin){ //!origin is for development
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

userRoute.post("/user/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email invaild" });
    }

    const isExist = await User.findOne({ email: email });
    if (isExist) {
      return res.status(400).json({ message: "Email existed" });
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({
        message:
          "Password must have a minimun length of 8 and at least one number",
      });
    }

    await User.create({ email: email, password: password });
    res.status(200).json({ message: "User successfully created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRoute.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExist = await User.findOne({ email: email });

    if (!isExist) {
      return res.status(400).json({ message: "Account does not exist" });
    }

    const isMatch = await bcrypt.compare(password, isExist.password);
    if (isMatch) {
      return res.status(200).json({ message: "Logged in" });
    } else {
      return res.status(400).json({ message: "Email or password is wrong" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
app.use("/", userRoute);

await connectDB();

app.listen(PORT, () => {
  console.log("server running");
});
