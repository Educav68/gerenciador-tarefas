// tarefas_new/src/routers/auth.routes.js

import express from 'express';
// Importa as funções de login e registro do seu controller
import { register, login } from '../controllers/auth.controller.js'; // Note o .js

const router = express.Router();

// 1. Rota de Registro
router.post('/register', register);

// 2. Rota de Login
router.post('/login', login);

export default router;