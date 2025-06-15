import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
uuidv4();

export const TodoWrapperLocalStorage = () => {
    const [todos, setTodos] = useState([]);
    const [sortOption, setSortOption] = useState('default'); 
    const [filterOption, setFilterOption] = useState('all'); 

    useEffect(() => {
        const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        setTodos(savedTodos);
    }, []);

    const addTodo = todo => {
        const newTodos = [...todos, { id: uuidv4(), task: todo, completed: false, isEditing: false }];
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
    };

    const toggleComplete = id => {
        const newTodos = todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
    };

    const deleteTodo = id => {
        const newTodos = todos.filter(todo => todo.id !== id);
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
    };

    const editTodo = id => {
        setTodos(todos.map(todo => (todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo)));
    };

    const editTask = (task, id) => {
        const newTodos = todos.map(todo => (todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo));
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
    };

    const handleSort = (option) => {
        setSortOption(option);
    };

    const handleFilter = (option) => {
        setFilterOption(option);
    };

    const getFilteredAndSortedTodos = () => {
        let filteredTodos = [...todos];

        // Apply filtering
        if (filterOption === 'completed') {
            filteredTodos = filteredTodos.filter(todo => todo.completed);
        } else if (filterOption === 'incomplete') {
            filteredTodos = filteredTodos.filter(todo => !todo.completed);
        }

        // Apply sorting
        if (sortOption === 'alphabetical') {
            filteredTodos.sort((a, b) => a.task.localeCompare(b.task));
        } else if (sortOption === 'completed') {
            filteredTodos.sort((a, b) => a.completed - b.completed);
        }

        return filteredTodos;
    };

    return (
        <div className='TodoWrapper'>
            <h1>To Do List</h1>
            <div className="controls">
                <select onChange={(e) => handleSort(e.target.value)}>
                    <option value="default">Sort by Default</option>
                    <option value="alphabetical">Sort Alphabetically</option>
                    <option value="completed">Sort by Completed</option>
                </select>
                <select onChange={(e) => handleFilter(e.target.value)}>
                    <option value="all">Show All</option>
                    <option value="completed">Show Completed</option>
                    <option value="incomplete">Show Incomplete</option>
                </select>
            </div>
            <TodoForm addTodo={addTodo} />
            {getFilteredAndSortedTodos().map((todo, index) =>
                todo.isEditing ? (
                    <EditTodoForm editTodo={editTask} task={todo} key={index} />
                ) : (
                    <Todo
                        task={todo}
                        key={index}
                        toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo}
                        editTodo={editTodo}
                    />
                )
            )}
        </div>
    );
};