import React, { useCallback, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import styled from "@emotion/styled";
import { AddInput } from "./components/AddInput";
import { TodoItem } from "./components/TodoItem";
import { TodoList } from "./components/TodoList";
import { Header } from "./components/Header";
import { Todo } from "./interface";

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: 300,
});

const LOCAL_STORAGE_KEY = "todos"; // Key for localStorage

const initialData: Todo[] = [
  {
    id: uuid(),
    label: "Buy groceries",
    checked: false,
  },
  {
    id: uuid(),
    label: "Reboot computer",
    checked: false,
  },
  {
    id: uuid(),
    label: "Ace CoderPad interview",
    checked: true,
  },
];

function App() {
  // Load todos from localStorage or use initialData
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : initialData;
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = useCallback((label: string) => {
    if (!label.trim()) return; // Prevent adding empty todos
    setTodos((prev) => [
      {
        id: uuid(),
        label,
        checked: false,
      },
      ...prev,
    ]);
  }, []);

  // Toggle the checked state and auto-sink checked items
  const handleChange = useCallback((id: string, checked: boolean) => {
    setTodos((prev) => {
      const updatedTodos = prev.map((todo) =>
        todo.id === id ? { ...todo, checked } : todo
      );
  
      console.log("Todos before sorting:", updatedTodos);
  
      // Ensure checked items are always at the bottom
      const sortedTodos = updatedTodos.sort((a, b) => {
        if (a.checked === b.checked) return 0; // Maintain original order if checked states are equal
        return a.checked ? 1 : -1; // Checked items move to the bottom
      });
  
      console.log("Todos after sorting:", sortedTodos);
      return sortedTodos;
    });
  }, []);
  

  return (
    <Wrapper>
      <Header>Todo List</Header>
      <AddInput onAdd={addTodo} />
      <TodoList>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
            onChange={(checked) => handleChange(todo.id, checked)}
          />
        ))}
      </TodoList>
    </Wrapper>
  );
}

export default App;
