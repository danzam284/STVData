import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Postgres from './components/Postgres.jsx';
import Home from './components/Home.jsx';
import Org from './components/Org.jsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/postgres",
    element: <Postgres />,
  },
  {
    path: "/org",
    element: <Org />,
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
