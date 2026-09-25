import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

let groq = null;

if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

export default groq;
