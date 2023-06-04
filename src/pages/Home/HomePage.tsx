import React from "react";
import logo from "../../logo.svg";
import "./HomePage.css";
import TemplateComponentGQL from "@/components/TemplateComponentGQL/TemplateComponentGQL";
import DarkModeSwitch from "@/components/DarkModeSwitch/DarkModeSwitch";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <DarkModeSwitch />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <TemplateComponentGQL />
    </div>
  );
}

export default App;
