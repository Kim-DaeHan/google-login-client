import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Login";
import "./App.css";

function App() {
  return (
    <GoogleOAuthProvider clientId="176867064739-b9uq3gmpq12tsf72jfqugr4s72rhp5qp.apps.googleusercontent.com">
      <div className="App">
        <Login />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
