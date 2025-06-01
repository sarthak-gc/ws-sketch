import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import WorkSpace from "./pages/WorkSpace.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OnlyLoggedOut from "./utils/RouteProtection/OnlyLoggedOut.tsx";
import Anyone from "./utils/RouteProtection/Anyone.tsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <OnlyLoggedOut element={<Login />} />,
    },
    {
      path: "/register",
      element: <OnlyLoggedOut element={<Register />} />,
    },
    {
      path: "/",
      element: <Anyone element={<WorkSpace />} />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
