const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // ใช้สำหรับการรับข้อมูล JSON จาก Body ของ Request
app.use(cors()); // เปิดการเข้าถึงจากโดเมนอื่น

// เชื่อมต่อ MongoDB
const mongoURI = 'mongodb://localhost:27017/todolist'; // URL ของ MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// ตัวอย่าง Schema และ Model
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// Routes
// ดึงรายการ Todo ทั้งหมด
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos); // ส่งกลับข้อมูลในรูปแบบ JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
});

// เพิ่ม Todo ใหม่
app.post('/todos', async (req, res) => {
  try {
    const { task } = req.body; // ดึงข้อมูล task จาก request body
    if (!task) {
      return res.status(400).json({ message: 'Task is required' }); // ถ้าไม่มี task ส่งกลับ 400
    }
    const newTodo = new Todo({ task });
    await newTodo.save(); // บันทึกลงในฐานข้อมูล
    res.status(201).json(newTodo); // ส่งกลับข้อมูลที่สร้างขึ้นใหม่
  } catch (error) {
    res.status(500).json({ message: 'Error adding todo', error });
  }
});

// ลบ Todo ตาม id
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id); // ลบ Todo ที่มี id ตรงกับที่ส่งมา
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' }); // ถ้าไม่พบ Todo ที่ต้องการลบ
    }
    res.json({ message: 'Todo deleted' }); // ส่งข้อความยืนยันการลบ
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
});

// แก้ไข Todo ตาม id
app.put('/todos/:id', async (req, res) => {
  try {
    const { task, completed } = req.body; // ดึงข้อมูล task และ completed จาก body
    if (!task) {
      return res.status(400).json({ message: 'Task is required' }); // ถ้าไม่มี task ส่งกลับ 400
    }
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { task, completed }, // อัปเดต task และ completed
      { new: true } // ส่งกลับข้อมูล Todo ที่ถูกอัปเดต
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' }); // ถ้าไม่พบ Todo ที่ต้องการแก้ไข
    }
    res.json(updatedTodo); // ส่งกลับ Todo ที่ถูกอัปเดต
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error });
  }
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
