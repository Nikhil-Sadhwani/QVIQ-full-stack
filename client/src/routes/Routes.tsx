import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import EditForm from "../pages/EditForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/home", element: <Home /> },
      { path: "/edit/:uid", element: <EditForm /> },
    ],
  },
]);
