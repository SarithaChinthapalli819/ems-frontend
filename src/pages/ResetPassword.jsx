import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import { context } from '../App';

export default function ResetPassword() {
  const navigate = useNavigate()
  const {setUser}=useContext(context)
  const [resetDetails, setResetDetails] = useState(
    {
      password: ''
    }
  )
  const { password } = resetDetails;
  const changeHandler = (e) => {
    setResetDetails({ ...resetDetails, [e.target.name]: e.target.value })

  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://ems-server.onrender.com/api/auth/resetpassword', { password},
        {headers:{
          authorization:`Bearer ${localStorage.getItem("token")}`
        }}
      )
      if (response.data.success) {
        localStorage.setItem("token",null)
        setUser('')
        toast.success(response.data.message)
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
        <label className='form-label'>Password:</label>
        <input className='form-control' type="password" name="password" value={password} onChange={(e) => changeHandler(e)} /><br/>
        <button className='btn btn-success col-12' type="submit" onClick={(e)=>submitHandler(e)}>Reset Password</button><br/><br/>
        <button className='btn col-12'  style={{backgroundColor:'#e74c3c',color:'white'}} type="submit" onClick={()=>navigate('/')}>Back</button>
      </form>
    </div>
  );
}
