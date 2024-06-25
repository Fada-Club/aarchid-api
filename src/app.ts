import express from "express";
import cors from "cors";
import connectDB from "./mongodb";

const app = express();
app.use(cors({
    origin: function (origin, callback) {
      const allowedOrigins = ['http://localhost:5173','https://aarkid-client.vercel.app'];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  }));
app.use(express.json());
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}));



app.get("/", (req, res) => {
    res.send({message: "Hello From Aarchid API"});
});


export const startServer = async () => {
    try {
        if(process.env.MONGODB_URL) await connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => console.log("Aarchid Api started on http://localhost:8080"));
    } catch (error) {
        console.log(error);
    }
}
