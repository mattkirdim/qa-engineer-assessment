import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "./App";

afterEach(cleanup); // Clean up after each test

describe("Todo App", () => {
  // Test for toggling items
  test("toggles a todo item's checked state", () => {
    render(<App />);

    const todoItem = screen.getByText("Buy groceries");
    const checkbox = todoItem.closest("label")?.querySelector("input") as HTMLInputElement;

    // Ensure the checkbox is initially unchecked
    expect(checkbox).not.toBeChecked();

    // Toggle the checkbox
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Toggle the checkbox again
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  // Test for state persistence
  test("persists state across reloads", () => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => (store[key] = value),
        clear: () => (store = {}),
      };
    })();
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    render(<App />);

    // Add a new todo
    const input = screen.getByPlaceholderText("Add a new todo item here");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "Persisted Todo" } });
    fireEvent.click(addButton);

    // Toggle a todo item
    const todoItem = screen.getByText("Buy groceries");
    const checkbox = todoItem.closest("label")?.querySelector("input") as HTMLInputElement;

    fireEvent.click(checkbox); // Mark it as checked
    expect(checkbox).toBeChecked();

    // Simulate reloading the app
    cleanup(); // Unmount the app
    render(<App />);

    // Assert that the new todo persists
    expect(screen.getByText("Persisted Todo")).toBeInTheDocument();

    // Assert that "Buy groceries" is still checked
    const reloadedCheckbox = screen.getByText("Buy groceries").closest("label")?.querySelector("input") as HTMLInputElement;
    expect(reloadedCheckbox).toBeChecked();
  });

  // Test for auto-sinking checked items
  test("auto-sinks checked items to the bottom", async () => {
    // Clear localStorage to ensure a clean state
    localStorage.clear();
  
    render(<App />);
  
    // Get all todo labels before toggling
    const todosBefore = screen.getAllByText(/./, { selector: "label span" });
    console.log("Todos before toggle:", todosBefore.map((node) => node.textContent));
    expect(todosBefore[0]).toHaveTextContent("Buy groceries");
  
    // Toggle "Buy groceries" to check it
    const checkbox = screen.getByText("Buy groceries").closest("label")?.querySelector("input") as HTMLInputElement;
    fireEvent.click(checkbox);
  
    // Wait for DOM to update
    await screen.findByText("Buy groceries");
  
    // Get all todo labels after toggling
    const todosAfter = screen.getAllByText(/./, { selector: "label span" });
    console.log("Todos after toggle:", todosAfter.map((node) => node.textContent));
  
    // Assert the new order of todos
    const expectedOrder = ["Reboot computer", "Buy groceries", "Ace CoderPad interview"];
    const actualOrder = todosAfter.map((node) => node.textContent);
    expect(actualOrder).toEqual(expectedOrder);
  });
  
  
  
});
