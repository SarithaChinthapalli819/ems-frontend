import React, { createContext, useEffect, useState } from 'react';
import Navigate from './components/Navigate';
import { BrowserRouter, Route, Routes, Link, useParams, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import User from './components/User';
import AddEditUser from './components/AddEditUser';
import Teams from './components/Teams';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Leaves from './components/Leaves';
import Board from './components/Board';
import UserTasks from './components/UserTasks';
import AllTasks from './components/AllTasks';
import TasksOverview from './components/TasksOverview';


export  const context=createContext()

export default function App() {
  const [user,setUser]=useState()
  const [role,setRole]=useState()
  const params=useParams()
  const getUsers=async ()=>{
    const response=await axios.get('http://localhost:5000/api/user/1',{
      headers:{
          authorization:`Bearer ${localStorage.getItem("token")}`
      }
  })
    if(response.data.users.length == 0){
      const response=await axios.post('http://localhost:5000/api/auth/register',{name:'Admin',email:'Admin@gmail.com',password:'Test123!',role:'Admin'})
      console.log(response)
    }
  }
  console.log(params)
  useEffect(()=>{
    getUsers();
  },[])
  const verify = async ()=>{
    
    const response=await axios.get('http://localhost:5000/api/auth/verify',{
      headers:{
        authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    if(response.data.success  && !window.location.pathname.includes('resetpassword') ){
       setUser(response.data.user.name)
       setRole(response.data.user.role)
    }
  }
  useEffect(()=>{
    verify()
  },[])
  return (
    <div style={{height:'100%'}}>
      <context.Provider value={{user,setUser,role,setRole}}>
      <BrowserRouter>
      <Navigate/>

      <div className='flex flex-row '>
      

    <ul className="nav flex-column navbar-dark h-screen pe-4" style={{backgroundColor:'#34495e'}}>
     <Link to='/user' style={{textDecoration:'none'}}> <li className="nav-item px-4 py-2">
        <a className="nav-link active text-white" aria-current="page">{role === 'Admin' ? 'Users' :'My Profile'}</a>
      </li></Link>
      <Link to='/teams' style={{textDecoration:'none'}}>{role === 'Admin' &&  <li className="nav-item px-4 py-2">
        <a className="nav-link text-white" >Teams</a>
      </li>}</Link>
      <Link to='/leaves' style={{textDecoration:'none'}}><li className="nav-item px-4 py-2">
        <a className="nav-link text-white">Leaves</a>
      </li></Link>
      <Link to='/board' style={{textDecoration:'none'}}>{role === 'Admin' &&<li className="nav-item px-4 py-2">
        <a className="nav-link text-white" >Board</a>
      </li>}</Link>
      <Link to='/usertasks' style={{textDecoration:'none'}}> {role != 'Admin' &&<li className="nav-item px-4 py-2">
        <a className="nav-link text-white" >User Tasks</a>
      </li>}</Link>
      <Link to='/alltasks' style={{textDecoration:'none'}}> {role === 'Admin' &&<li className="nav-item px-4 py-2">
        <a className="nav-link text-white" >Tasks</a>
      </li>}</Link>
      <Link to='/overview' style={{textDecoration:'none'}}> {role === 'Admin' &&<li className="nav-item px-4 py-2">
        <a className="nav-link text-white" >Tasks Overview</a>
      </li>}</Link>
    </ul>
    <div className='flex-grow'>
      <Routes>
      <Route path='/' element={<Login/>}></Route>
        <Route path='/user' element={<User/>}></Route>
        <Route path='/teams' element={<Teams/>}></Route>
        <Route path='/addedituser' element={<AddEditUser/>}></Route>
        <Route path='/forgotpassword' element={<ForgotPassword/>}></Route>
        <Route path='/resetpassword' element={<ResetPassword/>}></Route>
        <Route path='/leaves' element={<Leaves/>}></Route>
        <Route path='/board' element={<Board/>}></Route>
        <Route path='/usertasks' element={<UserTasks/>}></Route>
        <Route path='/alltasks' element={<AllTasks/>}></Route>
        <Route path='/overview' element={<TasksOverview/>}></Route>

      </Routes>
      </div>
      </div>
      <ToastContainer/>
      </BrowserRouter>
      </context.Provider>
    </div>
  );
}
