import Task from '../models/task.model.js';
import User from '../models/user.model.js';
import PDFDocument from 'pdfkit';

// 1. GET - Buscar tarefas ativas (não deletadas)
export const getTasks = async (req, res) => {
    try {
        // Filtra tarefas ativas (deleted: false) 
        const tasks = await Task.find({ userId: req.userId, deleted: false });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar tarefas.' });
    }
};

// 2. POST - Criar uma nova tarefa
export const addTask = async (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'O texto da tarefa é obrigatório.' });
    }

    try {
        const newTask = new Task({
            text,
            completed: false,
            userId: req.userId
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar tarefa.' });
    }
};

// 3. PATCH - Atualizar Tarefa
export const updateTask = async (req, res) => {
    const { text, completed } = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $set: { text, completed } },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou acesso negado.' });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar tarefa.', error: error.message });
    }
};

// 4. DELETE - Remover Tarefa (Soft Delete)
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $set: { deleted: true } },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou acesso negado.' });
        }

        res.status(200).json({ message: 'Tarefa marcada como excluída com sucesso.' });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao marcar tarefa como excluída.' });
    }
};

// 5. FUNÇÃO DE GERAÇÃO DE RELATÓRIO (PDF)
export const generateReport = async (req, res) => {
    try {
        // Buscar TODAS as tarefas do usuário (incluindo deletadas)
        const allTasks = await Task.find({ userId: req.userId });
        
        // NOVO: CHECAGEM PARA BLOQUEAR RELATÓRIO VAZIO 
        if (allTasks.length === 0) {
            return res.status(404).send({ message: 'Nenhuma tarefa encontrada para gerar o relatório.' });
        }
        
        const user = await User.findById(req.userId).select('email');

        // Filtrar tarefas por categoria
        const categorias = {
            pendentes: allTasks.filter(t => !t.completed && !t.deleted),
            concluidas: allTasks.filter(t => t.completed && !t.deleted),
            deletadas: allTasks.filter(t => t.deleted),
        };

        // Configurar o cabeçalho para download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=relatorio_tarefas_${user.email.split('@')[0]}.pdf`);

        // Iniciar e configurar o PDF
        const doc = new PDFDocument();
        doc.pipe(res);

        doc.fontSize(18).text('Relatório de Tarefas do Usuário', { align: 'center' });
        doc.fontSize(12).text(`Usuário: ${user.email}`, { align: 'center' });
        doc.moveDown();

        // Adicionar Conteúdo por Categoria
        for (const [nome, lista] of Object.entries(categorias)) {
            doc.fontSize(14).fillColor('#42b983').text(`-- ${nome.toUpperCase()} (${lista.length}) --`);
            doc.fillColor('black');
            doc.moveDown(0.5);

            if (lista.length === 0) {
                doc.fontSize(10).text('Nenhuma tarefa nesta categoria.');
            } else {
                lista.forEach(task => {
                    const status = nome === 'concluidas' ? ' [CONCLUÍDA]' : (nome === 'deletadas' ? ' [DELETADA]' : '');
                    doc.fontSize(10).text(`• ${task.text}${status}`);
                });
            }
            doc.moveDown();
        }
        
        doc.end();

    } catch (error) {
        console.error('Erro na geração do relatório:', error);
        res.status(500).send({ message: 'Falha ao gerar o relatório PDF.' });
    }
};

// EXPORTAÇÃO FINAL DE TODOS OS CONTROLADORES
export { getTasks, addTask, updateTask, deleteTask, generateReport };