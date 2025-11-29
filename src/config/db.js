// tarefas_new/src/config/db.js

import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI; 

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1); 
  }
};

export default connectDB;