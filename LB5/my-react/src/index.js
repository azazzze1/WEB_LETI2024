import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './App.header'
import Brokers from './App.brokers';
import Stocks from './App.stocks';
import Exchange from './App.exchange';
import SocketService from './App.socket';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/brokers",
    element: <Brokers />,
  },
  {
    path: "/stocks",
    element: <Stocks />,
  },
  {
    path: "/exchange",
    element: <Exchange />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <RouterProvider router={router} />
  </React.StrictMode>
);

