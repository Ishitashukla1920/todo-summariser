import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle,
  Circle,
  Trash2,
  Edit,
  Send,
  Plus,
  X,
  Filter as FilterIcon,
  ClipboardCheck,
  Loader2,
} from 'lucide-react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [filter, setFilter] = useState('all'); 

  const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      showMessage('Failed to fetch tasks. Please try again later.', 'error');
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text, type, duration = 4000) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType('');
    }, duration);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) {
      showMessage('Task title cannot be empty.', 'info');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodoTitle, completed: false }),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodoTitle('');
      showMessage('Task added successfully!', 'success');
    } catch (error) {
      showMessage('Failed to add task.', 'error');
    }
  };

  const toggleTodoCompletion = async (id, currentCompletedStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentCompletedStatus }),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !currentCompletedStatus } : todo
      ));
      showMessage('Task status updated!', 'success');
    } catch (error) {
      showMessage('Failed to update task status.', 'error');
    }
  };

  const startEditing = (todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoTitle(todo.title);
  };

  const saveEdit = async (id) => {
    if (!editingTodoTitle.trim()) {
      showMessage('Task title cannot be empty.', 'info');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTodoTitle }),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, title: editingTodoTitle } : todo
      ));
      setEditingTodoId(null);
      setEditingTodoTitle('');
      showMessage('Task updated successfully!', 'success');
    } catch (error) {
      showMessage('Failed to update task.', 'error');
    }
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
    setEditingTodoTitle('');
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      setTodos(todos.filter((todo) => todo.id !== id));
      showMessage('Task deleted successfully!', 'success');
    } catch (error) {
      showMessage('Failed to delete task.', 'error');
    }
  };

  const summarizeAndSendToSlack = async () => {
    setIsSummarizing(true);
    setSummaryText('');
    showMessage('Generating summary and sending to Slack...', 'info', 10000);
    try {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      const data = await response.json();
      if (data.summary) {
        setSummaryText(data.summary);
      }
      showMessage(data.message || 'Summary operation completed.', 'success');
    } catch (error) {
      setSummaryText('');
      showMessage('Failed to generate or send summary.', 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredTodos = useMemo(() => {
    if (!Array.isArray(todos)) return [];
    return todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => {
    if (!Array.isArray(todos)) return 0;
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    if (completedTodos.length === 0) {
      showMessage('No completed tasks to clear.', 'info');
      return;
    }
    try {
      await Promise.all(completedTodos.map(todo =>
        fetch(`${API_BASE_URL}/todos/${todo.id}`, { method: 'DELETE' })
      ));
      setTodos(todos.filter(todo => !todo.completed));
      showMessage('Cleared all completed tasks!', 'success');
    } catch (error) {
      showMessage('Failed to clear completed tasks.', 'error');
    }
  };

  
  const commonButtonClasses = "text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed";
  const gradientBluePurple = "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-blue-600";
  const gradientGreenBlue = "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:ring-green-500";
  const gradientIndigoTeal = "bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 focus:ring-indigo-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 flex flex-col items-center justify-center py-8 px-4 font-sans text-gray-100">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg md:max-w-xl lg:max-w-2xl transition-all duration-300 transform hover:scale-[1.01] relative border border-gray-700 backdrop-blur-sm bg-opacity-70">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center mb-6 sm:mb-8 tracking-wide">
          Task Manager 
        </h1>

        {message && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 p-3 px-5 rounded-full text-white text-sm font-medium animate-fade-in-down z-10 shadow-lg border
              ${
                messageType === 'success'
                  ? 'bg-green-600 border-green-800'
                  : messageType === 'error'
                  ? 'bg-red-600 border-red-800'
                  : 'bg-blue-600 border-blue-800'
              }
            `}
          >
            {message}
          </div>
        )}

        <form onSubmit={addTodo} className="flex flex-col sm:flex-row items-stretch gap-3 mb-6 animate-fade-in">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-100 transition-all duration-300 text-base placeholder-gray-500 shadow-inner"
            disabled={isLoading || isSummarizing}
          />
          <button
            type="submit"
            className={`${commonButtonClasses} ${gradientBluePurple}`}
            disabled={isLoading || isSummarizing || !newTodoTitle.trim()}
          >
            <Plus size={20} /> Add Task
          </button>
        </form>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 bg-gray-700 p-1 rounded-full shadow-inner border border-gray-600">
            <FilterIcon size={18} className="text-gray-400 ml-2" />
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-300
                  ${
                    filter === f
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-400 hover:bg-gray-600'
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <span className="text-base text-gray-400 font-medium bg-gray-700 px-3 py-1 rounded-full border border-gray-600 shadow-sm">
            {activeTodosCount} tasks left
          </span>
        </div>

        {isLoading && filteredTodos.length === 0 && (
          <div className="flex justify-center items-center py-10 text-gray-400 animate-pulse">
            <Loader2 className="h-7 w-7 text-blue-500 animate-spin mr-3" />
            <p>Loading tasks...</p>
          </div>
        )}

        {!isLoading && filteredTodos.length === 0 && todos.length > 0 && (
          <p className="text-center text-gray-500 py-4 animate-fade-in">
            No tasks match the current filter.
          </p>
        )}

        {!isLoading && todos.length === 0 && (
          <p className="text-center text-gray-500 py-4 animate-fade-in">
            Your task list is empty! Add some tasks above.
          </p>
        )}

        <ul className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`flex flex-col sm:flex-row items-center justify-between bg-gray-700 p-3.5 rounded-lg shadow-sm border border-gray-700 hover:shadow-md transition-all duration-300 group
                ${todo.completed && editingTodoId !== todo.id ? 'bg-gray-800' : ''}
                transform hover:translate-x-1 animate-fade-in-up`}
            >
              {editingTodoId === todo.id ? (
                <div className="flex-grow flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                  <input
                    type="text"
                    value={editingTodoTitle}
                    onChange={(e) => setEditingTodoTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                    className="flex-grow p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-800 text-gray-100 text-base w-full shadow-inner"
                    autoFocus
                  />
                  <div className="flex justify-end sm:justify-start gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="text-green-400 hover:text-green-300 p-2 rounded-full hover:bg-gray-600 transition-colors"
                      aria-label="Save edit"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-400 hover:text-gray-200 p-2 rounded-full hover:bg-gray-600 transition-colors"
                      aria-label="Cancel edit"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="flex items-center flex-grow cursor-pointer mr-2 w-full sm:w-auto mb-2 sm:mb-0"
                    onClick={() => toggleTodoCompletion(todo.id, todo.completed)}
                  >
                    {todo.completed ? (
                      <CheckCircle className="text-green-500 mr-3 flex-shrink-0 transition-transform transform scale-105" size={22} />
                    ) : (
                      <Circle className="text-gray-500 group-hover:text-blue-500 mr-3 flex-shrink-0 transition-colors transition-transform group-hover:scale-105" size={22} />
                    )}
                    <span
                      className={`text-base break-all ${
                        todo.completed ? 'line-through text-gray-500' : 'text-gray-100 group-hover:text-blue-400'
                      } transition-colors`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEditing(todo)}
                      className="text-blue-400 hover:text-indigo-400 p-2 rounded-full hover:bg-gray-600 transition-colors opacity-50 group-hover:opacity-100"
                      aria-label="Edit todo"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-gray-600 transition-colors opacity-50 group-hover:opacity-100"
                      aria-label="Delete todo"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mt-6">
          <button
            onClick={clearCompletedTodos}
            className={`${commonButtonClasses} ${gradientGreenBlue} text-sm`}
            disabled={todos.filter((t) => t.completed).length === 0}
          >
            <ClipboardCheck size={18} /> Clear Completed
          </button>
          <button
            onClick={summarizeAndSendToSlack}
            className={`${commonButtonClasses} ${gradientIndigoTeal} text-sm`}
            disabled={isSummarizing || todos.length === 0}
          >
            {isSummarizing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send size={18} />
            )}
            Send Summary to Slack
          </button>
        </div>

        {summaryText && (
          <div className="mt-6 bg-gray-700 border border-blue-900 text-blue-200 rounded-lg p-4 text-sm animate-fade-in-up shadow-md">
            <strong>Summary:</strong> {summaryText}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;