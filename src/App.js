import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import Root from './Root';
import Test from './features/test/Test';
import Home from './features/pages/Home';
import Result from './features/pages/Result';
import Signup from './features/pages/Signup';
import Login from './features/pages/Login';
import Dashboard from './features/pages/Dashboard';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />} >
        <Route index element={<Home />} />
        <Route path='test' element={<Test />} />
        <Route path='result' element={<Result />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
        <Route path='dashboard' element={<Dashboard />} />
      </Route>
    )
  )
  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}

export default App;
