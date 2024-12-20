import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";
import axios from "axios";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  // ดึงรายการงานจาก Backend
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // เพิ่มงานใหม่ใน Backend และ State
  const addTodo = async (task) => {
    try {
      const response = await axios.post("http://localhost:5000/todos", { task });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // ลบงานใน Backend และ State
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // สลับสถานะงาน (สำเร็จ/ไม่สำเร็จ)
  const toggleComplete = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo._id === id);
      const updatedTodo = {
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      };
      await axios.put(`http://localhost:5000/todos/${id}`, updatedTodo);
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling complete:", error);
    }
  };

  // เปิด/ปิดโหมดแก้ไข
  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  // แก้ไขงานใน Backend และ State
  const editTask = async (task, id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo._id === id);
      const updatedTodo = { ...todoToUpdate, task };
      await axios.put(`http://localhost:5000/todos/${id}`, updatedTodo);
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...updatedTodo, isEditing: false } : todo
        )
      );
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  return (
    <div className="TodoWrapper">
      <h1>Let Get Things Done!</h1>
      <TodoForm addTodo={addTodo} />
      {/* แสดงรายการงาน */}
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm key={todo._id} editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo._id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
