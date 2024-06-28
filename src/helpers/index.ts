import  jwt  from "jsonwebtoken";


export const generateAuthToken = async (id : string) => {
    try {
    if (typeof process.env.AUTH_SECRET === 'undefined') {
            throw new Error('GEMINI_API_KEY is not set');
    }
      const token = await jwt.sign(
        {
          _id: id,
        },
        process.env.AUTH_SECRET
      );
      return token;
    } catch (error) {
      console.log(error);
    }
}