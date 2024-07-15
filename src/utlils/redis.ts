import { Redis } from "ioredis";

//@ts-ignore
const redis = new Redis(process.env.REDIS_URI);

export const setValuePair = async (key: string, val: object) => {
    try {
        await redis.set(key, JSON.stringify(val), "EX" , 600);
        console.log("Value set successfully");
    } catch (error) {
        console.error("Error setting value:", error);
    }
};

export const getValuePair = async (key: string) => {
    try {
        const value = await redis.get(key);
        const obj = value ? JSON.parse(value) : null;
        console.log("Value retrieved successfully");
        return obj;
    } catch (error) {
        console.error("Error retrieving value:", error);
        return null;
    }
};