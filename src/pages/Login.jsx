import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import { context } from '../App';

export default function Login() {
  const navigate = useNavigate()
  const {setUser,setRole}=useContext(context)
  const [signupDetails, setsignupDetails] = useState(
    {
      email: '',
      password: ''
    }
  )
  const { name, email, password } = signupDetails;
  const changeHandler = (e) => {
    setsignupDetails({ ...signupDetails, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      if (response.data.success) {
        toast.success('Login Succesfully ..')
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user.name)
        setRole(response.data.user.role)
        navigate('/user')
      }
    }
    catch (e) {
      console.log('Login Failed', e.message)
    }
  }
  return (
    <div className='bg-white h-screen flex flex-row items-center justify-center'>
      <form className='shadow-lg p-3 bg-slate-300 w-96 rounded-lg'>
        <label className='form-label'>Email:</label>
        <input className='form-control' type="email" name="email" value={email} onChange={(e) => changeHandler(e)} />
        <label className='form-label'>Password:</label>
        <input className='form-control' type="password" name="password" value={password} onChange={(e) => changeHandler(e)} />
        <button className='float-end m-2 bg-slate-300'  style={{color:"green",border:"none"}} onClick={()=>navigate('/forgotpassword')}>Forget Password</button>
        <button className='btn btn-success col-12' type="submit" onClick={(e) => submitHandler(e)}>Login</button>
      </form>
    </div>
  );
}
