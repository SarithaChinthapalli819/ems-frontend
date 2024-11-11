import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function AddEditEmployee({setAddModel,addUser,setCurrentUser,currentUser,editUser}) {
  const [EmployeeDetails,setDetails]=useState(
    {
      name:'',
      email:'',
      password:'',
      role:'Employee'
    }
  )
  useEffect(()=>{
   if(currentUser !=null) setDetails({...EmployeeDetails,name:currentUser.name,email:currentUser.email,role:currentUser.role})
  },[currentUser])

  const {name,email,password,role}=EmployeeDetails;
  const changeHandler =(e)=>{
    setDetails({...EmployeeDetails,[e.target.name]:e.target.value})
  }

  const submitHandler = async (e)=>{
    e.preventDefault()

   if(currentUser ==null) {
    addUser(name,email,password,role)
    }
    else{
      editUser(name,email,role)
    }
    
  }
  return (
    <div className='notemodal-backdrop'>
    <div className="notemodal-content" >
      {currentUser ? <h4>Update User</h4> : <h4>Add User</h4>}
      <input type="text" className='form-control mb-3' placeholder='Enter Name..' required name="name" value={name} onChange={(e)=>changeHandler(e)}/>
      <input type="email" className='form-control mb-3' placeholder='Enter Email..' required name="email" value={email} onChange={(e)=>changeHandler(e)}/>
      {currentUser ==null &&  <input type="password" className='form-control mb-3' placeholder='Enter Password..' required name="password" value={password} onChange={(e)=>changeHandler(e)} /> }
      <select className='form-control mb-3' name="role" value={role} onChange={(e)=>changeHandler(e)} style={{width:"100%",padding:"5px"}}>
        <option value="Admin">Admin</option>
        <option value="Employee">User</option>
      </select>
      {currentUser ? <button className='btn btn-primary mb-3' onClick={(e)=>submitHandler(e)}>Update User </button> : <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-3' onClick={(e)=>submitHandler(e)}>Add User </button>}<br />
      <button className='btn'  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>{setAddModel(false);setCurrentUser(null)}}> Cancel</button>
    </div>
    </div>
  );
}
