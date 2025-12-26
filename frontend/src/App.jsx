import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from 'react-icons/io5';
import { MdModeEditOutline } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa6';

const App = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText
      });
      setTodos(todos.map(todo =>
        todo._id === id ? response.data : todo
      ));
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const response = await axios.patch(`/api/todos/${todo._id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map(t =>
        t._id === todo._id ? response.data : t
      ));
    } catch (error) {
      console.log("Error toggling completion:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-4 transition-colors duration-500'>
      <div className='bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 transition-all duration-300'>
        <h1 className='text-4xl font-bold text-gray-800 mb-6 text-center tracking-wide'>Task Manager</h1>

        {/* ADD TODO FORM */}
        <form onSubmit={addTodo} className='flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-inner transition-shadow hover:shadow-md'>
          <input
            className='flex-1 outline-none px-4 py-3 text-gray-700 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300 transition duration-200'
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='Add a new task...'
            required
          />
          <button type='submit' className='bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200'>
            Add
          </button>
        </form>

        {/* TODOS LIST */}
        <div className='mt-6'>
          {todos.length === 0 ? (
            <p className='text-gray-500 text-center mt-4'>No tasks yet. Add your first task!</p>
          ) : (
            <div className='flex flex-col gap-3'>
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className='p-3 bg-gray-50 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-200'
                >
                  {/* Edit Mode */}
                  {editingTodo === todo._id ? (
                    <div className='flex items-center gap-3 w-full'>
                      <input
                        type='text'
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className='flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200'
                      />
                      <div className='flex gap-2'>
                        <button
                          onClick={() => saveEdit(todo._id)}
                          className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition duration-200'>
                          <MdOutlineDone />
                        </button>
                        <button
                          onClick={() => setEditingTodo(null)}
                          className='px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-sm transition duration-200'>
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Normal Mode
                    <>
                      <div className='flex items-center gap-3 overflow-hidden'>
                        <button
                          onClick={() => toggleComplete(todo)}
                          className={`flex-shrink-0 h-7 w-7 border-2 rounded-full flex items-center justify-center transition-colors duration-200
                            ${todo.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-blue-500"}`}
                        >
                          {todo.completed && <MdOutlineDone />}
                        </button>
                        <span className={`font-medium ${todo.completed ? "line-through text-gray-400" : "text-gray-800"} truncate`}>
                          {todo.text}
                        </span>
                      </div>

                      <div className='flex gap-2'>
                        <button
                          onClick={() => startEditing(todo)}
                          className='p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition duration-200'>
                          <MdModeEditOutline size={20} />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo._id)}
                          className='p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition duration-200'>
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
