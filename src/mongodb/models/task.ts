import mongoose from "mongoose";

// Define an interface for the Task document
interface ITask {
  user_id: mongoose.Schema.Types.ObjectId;
  plant_name: string;
  name: string;
  isCompleted: boolean;
}

// Define the schema using the interface
const taskSchema = new mongoose.Schema<ITask>({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plant_name: { type: String, required: true },
  name: { type: String, required: true },
  isCompleted: { type: Boolean, default: false, required: true },
});

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;

// Task Actions
export const getTasks = () => Task.find();
export const getTaskById = (id: string) => Task.findById(id);
export const getTasksByUserId = (userId: string) => Task.find({ user_id: userId });
export const getTasksByPlantId = (plantId: string) => Task.find({ plant_id: plantId });
export const createTask = (values: Partial<ITask>) => {
  console.log('Creating task with values:', values);
  return new Task(values).save()
    .then((task) => task.toObject())
    .catch((error) => {
      console.error('Error creating task:', error);
      throw error;
    });
};
export const deleteTaskById = (id: string) => Task.findOneAndDelete({ _id: id });
export const updateTaskById = (id: string, values: Partial<ITask>) => Task.findByIdAndUpdate(id, values, { new: true });