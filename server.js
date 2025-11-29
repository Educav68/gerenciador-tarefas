// tarefas_new/server.js (Versão Final ES Modules)

// Importa o dotenv de forma simplificada para carregar as variáveis
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';

// Importa as rotas (O caminho está correto: ./src/routers/)
import authRoutes from './src/routers/auth.routes.js'; 
import taskRoutes from './src/routers/task.routes.js'; 

// 1. Conecta ao Banco de Dados
connectDB(); 

// 2. Inicializa o Express
const app = express();

// Configura o CORS
app.use(cors({
    // 🚨 AJUSTE AQUI: O Front-end está rodando na porta 5173 (Vite) 🚨
    origin: [
        'http://localhost:5173',
        'https://gertarefas.netlify.app'
    ]
}));

// Middleware para processar JSON
app.use(express.json());

// Define os endpoints de API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 3. Define a Porta e Inicia o Servidor
// Nota: O Backend geralmente roda em uma porta diferente do Frontend (ex: 3000 ou 5000)
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// FIM do server.js