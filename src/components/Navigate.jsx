import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { context } from '../App';

export default function Navigate() {
  const {user,setUser}=useContext(context)
  const {role} = useContext(context)
  const navigate=useNavigate()
  console.log(user)
  const onLogout =()=>{
    localStorage.setItem("token",null)
    navigate('/')
    setUser('')
  }
  return (
    <div className='sticky'>
      <div className='flex flex-row justify-between h-14 items-center text-white p-4 sticky' style={{backgroundColor:'#2c3e50'}}>
        <div className='font-extrabold text-white text-lg font-dancing'>Employee Management System</div>
        {/* {user?<div className='w-[386px] flex flex-row justify-between'>
        <Link to='/user'><button className='btn btn-light shadow-lg' >{role === 'Admin' ? 'Users' :'My Profile'}</button></Link>
        {role === 'Admin' && <Link to='/teams'><button className='btn btn-light shadow-lg' >Teams</button></Link>}
        <Link to='/leaves'><button className='btn btn-light shadow-lg' >Leaves</button></Link>
        <Link to='/board'><button className='btn btn-light shadow-lg' >Board</button></Link>
        {role != 'Admin' && <Link to='/usertasks'><button className='btn btn-light shadow-lg'>User Tasks</button></Link>}
        </div>:<></>} */}
        <div  className='flex flex-row justify-between'>
          {user && <div className='flex flex-row justify-between items-center'><div>{user} &nbsp;&nbsp;&nbsp;</div> <button className='btn shadow-lg'  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>onLogout()}>Logout</button></div>}         
        </div>
      </div>
    </div>
  );
}
