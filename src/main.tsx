import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ApplicationProvider } from "./store/applicationStore";
import { NoteProvider } from "./store/noteStore";
import { TodoProvider } from "./store/todoStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApplicationProvider>
        <NoteProvider>
          <TodoProvider>
            <App />
          </TodoProvider>
        </NoteProvider>
      </ApplicationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
