import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ApplyLeaveModel({openApplyLeaveModel,applyLeave}) {

  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const [users, setUsers] = useState([])
  const [selectedUser, selectUser] = useState("")

  const usersdata = async () => {
      const response = await axios.get('https://ems-server-ddw8.onrender.com/api/user/1',{
        headers:{
            authorization:`Bearer ${localStorage.getItem("token")}`
        }
    })
      const users= response.data.users.map((item)=>item)
      setUsers(users)
  }
  
  useEffect(() => {
      usersdata()
  }, [])
  
  const submitHandler = ()=>{
    applyLeave(selectedUser,selectedDateFrom,selectedDateTo)
  }
  return (
    <div className='notemodal-backdrop'>
    <div className="notemodal-content" >
       <h4>Apply Leave</h4>
       <select value={selectedUser}  onChange={(e)=>selectUser(e.target.value)} className='form-control w-100 mb-3'>
                    <option value="" disabled>Select User</option>
                    {users && users.length>0 && users.map((item) => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                    ))
                    }
        </select>
      <DatePicker className='form-control mb-3'
        selected={selectedDateFrom} 
        onChange={(date) => setSelectedDateFrom(date)} 
        dateFormat="dd/MM/yyyy"
        placeholderText="Choose LeaveDate From" 
        showYearDropdown 
        scrollableYearDropdown 
      /><br/>
      <DatePicker className='form-control mb-3'
        selected={selectedDateTo} 
        onChange={(date) => setSelectedDateTo(date)} 
        dateFormat="dd/MM/yyyy"
        placeholderText="Choose LeaveDate To" 
        showYearDropdown 
        scrollableYearDropdown 
      /><br/>
       <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-3' onClick={()=>submitHandler()}>Add Leave </button><br />
      <button className='btn'  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>openApplyLeaveModel(false)}> Cancel</button>
    </div>
    </div>
  );
}
