// src/routes/task.routes.js (AJUSTADO)

import express from 'express';
// Importa as novas funções do controller
import { getTasks, addTask, updateTask, deleteTask } from '../controllers/task.controller.js'; 
import { protect } from '../middleware/auth.middleware.js'; 
import { generateReport } from '../controllers/task.controller.js'; // Importar a nova função

const router = express.Router();

router.get('/', protect, getTasks); 
router.post('/', protect, addTask); 
router.patch('/:id', protect, updateTask); 
router.delete('/:id', protect, deleteTask);

// Rotas Protegidas de Edição e Exclusão (requerem ID na URL)
router.patch('/:id', protect, updateTask); 
router.delete('/:id', protect, deleteTask); 
router.get('/report', protect, generateReport);

export default router;