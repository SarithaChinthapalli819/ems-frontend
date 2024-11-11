import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import { context } from '../App';

export default function ForgotPassword() {
  const navigate = useNavigate()
  const {setUser}=useContext(context)
  const [forgotDetails, setforgotDetails] = useState(
    {
      email: ''
    }
  )
  const { email } = forgotDetails;
  const changeHandler = (e) => {
    setforgotDetails({ ...forgotDetails, [e.target.name]: e.target.value })

  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://ems-server.onrender.com/api/auth/forgotpassword', { email})
      if (response.data.success) {
        toast.success(response.data.message)
        localStorage.setItem('token', response.data.token)
        navigate('/')
      }
    }
    catch (e) {
      toast.error("error")
    }
  }
  return (
    <div className='bg-white h-screen flex flex-row items-center justify-center'>
      <form className='shadow-lg p-3 bg-slate-300 w-96 rounded-lg'>
        <label className='form-label'>Email:</label>
        <input className='form-control' type="email" name="email" value={email} onChange={(e) => changeHandler(e)} /><br/>
        <button className='btn btn-success col-12' type="submit" onClick={(e)=>submitHandler(e)}>Forgot Password</button><br/><br/>
        <button className='btn col-12'  style={{backgroundColor:'#e74c3c',color:'white'}} type="submit" onClick={()=>navigate('/')}>Back</button>
      </form>
    </div>
  );
}
