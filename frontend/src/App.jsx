import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import CallPage from './pages/CallPage.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Chatpage from './pages/Chatpage.jsx';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import axios from "axios"
import { axiosInstance } from './lib/axios.js';
const App = () => { 
  
  const {data,isLoading,error} =useQuery({queryKey:["todos"],
    queryVn:async ()=>{
      const res= await axiosInstance.get()
      return res.data
    }
})
console.log(data)
  return (
    <div className=" h-screen " data-theme="night">
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/notifications' element={<NotificationPage/>} />
        <Route path='/chat' element={<Chatpage/>} />
        <Route path='/call' element={<CallPage/>} />
        <Route path='/Onboarding' element={<Onboarding/>} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
