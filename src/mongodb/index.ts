import mongoose from "mongoose";

const connectDB = (url : string) => {
    mongoose.set('strictQuery', true);
    mongoose.connect(url)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error));
}

export default connectDB;