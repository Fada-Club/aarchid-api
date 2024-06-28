import mongoose from "mongoose";

interface PlantInput {
  user_id: mongoose.Schema.Types.ObjectId;
  name: string;
  species: string;
  dateOfPlanting: Date;
  comment?: string;
  image: string;
}

const plantSchema = new mongoose.Schema({
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name : { type: String, required: true },
    species : { type: String, required: true },
    dateOfPlanting : { type: Date, required: true },
    comment : { type: String, required: false },
    image : { type: String, required: true },
}, { timestamps: true });

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;

// Plant Actions
export const getPlants = () => Plant.find();
export const getPlantById = (id: string) => Plant.findById(id);
export const getPlantsByUserId = (userId: string) => Plant.find({ user_id: userId });
export const createPlant = (values: PlantInput) => {
  console.log('Creating plant with values:', values);
  return new Plant(values).save()
    .then((plant) => plant.toObject())
    .catch((error) => {
      console.error('Error creating plant:', error);
      throw error;
    });
};
export const deletePlantById = (id: string) => Plant.findOneAndDelete({ _id: id });
export const updatePlantById = (id: string, values: Partial<PlantInput>) => Plant.findByIdAndUpdate(id, values, { new: true });