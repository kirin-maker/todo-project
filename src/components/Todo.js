import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
  return (
    <div className="Todo">
      {/* แสดงสถานะงานสำเร็จ/ไม่สำเร็จ */}
      <p
        className={`${task.completed ? "completed" : "incompleted"}`}
        onClick={() => toggleComplete(task._id)} // ใช้ _id เพื่อเปลี่ยนสถานะ
      >
        {task.task}
      </p>
      <div>
        {/* ปุ่มแก้ไขงาน */}
        <FontAwesomeIcon
          className="edit-icon"
          icon={faPenToSquare}
          onClick={() => editTodo(task._id)} // ใช้ _id เพื่อเปิด/ปิดโหมดแก้ไข
        />
        {/* ปุ่มลบงาน */}
        <FontAwesomeIcon
          className="delete-icon"
          icon={faTrash}
          onClick={() => deleteTodo(task._id)} // ใช้ _id เพื่อลบงาน
        />
      </div>
    </div>
  );
};
