import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
  }
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;