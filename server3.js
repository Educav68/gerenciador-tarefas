// tarefas_new/server.js (Versão Blindada)

import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';

import authRoutes from './src/routers/auth.routes.js'; 
import taskRoutes from './src/routers/task.routes.js'; 

// Conecta ao Banco
connectDB(); 

const app = express();

// 🚨 CORS LIBERADO GERAL (Para eliminar qualquer bloqueio agora) 🚨
app.use(cors());
// Nota: Se quiser restringir depois, troque por:
// app.use(cors({ origin: '*', allowedHeaders: '*' }));

// Middleware para processar JSON
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Rota de Teste (Para saber se o servidor está vivo no navegador)
app.get('/', (req, res) => {
    res.send('API do Gerenciador de Tarefas está FUNCIONANDO! 🚀');
});

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));