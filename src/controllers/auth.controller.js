import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

const jwtSecret = process.env.JWT_SECRET || 'SEGREDO_DE_DESENVOLVIMENTO'; 

// 1. Função de Registro
export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já registrado.' });
    }
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
  }
};

// 2. Função de Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      jwtSecret, 
      { expiresIn: '1h' } 
    );
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Erro no login.', error: error.message });
  }
};