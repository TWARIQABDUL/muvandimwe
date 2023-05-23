import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@ionic/react/css/core.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/login';
import { SessionProvider } from './session';
import Home from './components/home';
import Loading from './components/loadinf';
import Ride from './pages/ride';
import Hotels from './pages/hotels';
import Restaurant from './pages/retaurant';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <SessionProvider>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/signin' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/Ride' element={<Ride/>}/>
        <Route path='/Hotels' element={<Hotels/>}/>
        <Route path='/Restaurant' element={<Restaurant/>}/>

      </Routes>
    </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
