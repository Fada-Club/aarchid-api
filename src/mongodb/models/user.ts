import mongoose from "mongoose";

export interface IUser {
  email: string;
  name: string;
  image: string;
  plantSpecies: string[];
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    plantSpecies: [{ type: String, required: true }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;

// User Actions
export const getUsers = () => User.find();
export const getuserByEmail = (email: string) => User.findOne({ email });
export const getUserById = (id: string) => User.findById(id);
export const createUser = (values: IUser) => {
  console.log('Creating user with values:', values);
  return new User(values).save()
    .then((user) => user.toObject())
    .catch((error) => {
      console.error('Error creating user:', error);
      throw error;
    });
};
export const updateUserById = (id: string, values: Partial<IUser>) => {
  return User.findByIdAndUpdate(id, values, { new: true });
};