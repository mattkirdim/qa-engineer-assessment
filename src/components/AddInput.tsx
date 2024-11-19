import React, { FC, useState } from "react";
import styled from "@emotion/styled";

const Form = styled.form({
  width: "100%",
});

const Input = styled.input({
  width: "100%",
  border: "none",
  padding: 16,
  outline: "none",
  borderRadius: 3,
  marginBottom: 8,
});

const Button = styled.button({
  width: "100%",
  padding: 10,
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  borderRadius: 3,
  cursor: "pointer",
  fontWeight: "bold",
});

export interface AddInputProps {
  onAdd: (label: string) => void;
}

export const AddInput: FC<AddInputProps> = ({ onAdd }) => {
  const [input, setInput] = useState("");

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        if (input.trim()) {
          onAdd(input);
          setInput("");
        }
      }}
    >
      <Input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder="Add a new todo item here"
      />
      <Button type="submit">Add</Button>
    </Form>
  );
};
