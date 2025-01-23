import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

export const Context = createContext();

const AppWrapper = () => {
  const tkn = localStorage.getItem("token");
  const [user, setUser] = useState({});
  const [token, setToken] = useState(tkn);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        token, setToken
      }}
    >
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<AppWrapper />);