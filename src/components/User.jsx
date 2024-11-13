import React, { useContext, useEffect, useRef, useState } from 'react';
import AddEditUser from './AddEditUser';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import DeleteModel from './DeleteModel';
import { context } from '../App';
import * as XLSX from 'xlsx';
import nodataimag from '../assets/nodataimag.jpg'
export default function User() {
  const [openAddModel,setAddModel]=useState(false)
  const [users,setUsers]=useState([])
  const [filteredUsers,setFilteredUsers] =useState()
  const [searchValue,setSearchedValue] = useState('')
  const navigate=useNavigate()
  const [currentUser,setCurrentUser] = useState(null)
  const [deleteModelOpen,setDeleteModel] =useState(false)
  const [deleteId,setDeleteId]=useState(null)
  const [isActive,setIsActiveValue]=useState(1)
  const {role} = useContext(context)
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const addUser = async (name,email,password,role)=>{
    const response =await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,{name,email,password,role})
    if(response.data.success) {
      toast.success('User Added Successfully ..')
      setusers()
      setAddModel(false)
      setCurrentUser(null)
    }
  }
  const editUser = async (name,email,role)=>{
    const response =await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/edituser/${currentUser._id}`,{name,email,role})
    if(response.data.success) {
      toast.success('User Edited Successfully ..')
      setusers()
      setAddModel(false)
      setCurrentUser(null)
    }
  }
  const setusers = async ()=>{
    const response =await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${isActive}`,{
      headers:{
          authorization:`Bearer ${localStorage.getItem("token")}`
      }
  })
    setUsers(response.data.users)
   console.log(response.data.users)
  }

  const filtering = (value)=>{
    setSearchedValue(value)
    const filtered = users.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()) || 
      item.email.toLowerCase().includes(value.toLowerCase()) ||
      item.team && item.team.name.toLowerCase().includes(value.toLowerCase())
  );
  setFilteredUsers(filtered);
  }
  useEffect(()=>{
    setusers()
  },[])

  useEffect(()=>{
    filtering(searchValue)
  },[users])

  useEffect(() => {
    setusers();
  }, [isActive]);
  
  const openEditModel =(row)=>{
    setAddModel(true)
    setCurrentUser(row)
  }
  const onDeleteClick = async (id)=>{
    setDeleteId(id)
    setDeleteModel(true);
  }

  const setIsDelete =async (value)=>{
    if(value){
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/deleteuser/${deleteId}`)
      if (response.data.success) {
        setusers()
        setDeleteModel(false);
      }
      
    }
    else{
      setDeleteModel(false);
    }
  }
  
  const columns = [
    {
      name: 'User Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name : 'Email',
      selector : (row) => row.email,
      sortable:true,
    },
    {
      name : 'Role',
      selector : (row) => row.role,
      sortable:true,
    },
    {
      name: 'Team Name',
      selector: (row) => row.team ? row.team.name: '',
      sortable: true,
    },
    ...(role === 'Admin'
      ? [
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button className="btn mr-2" onClick={()=>openEditModel(row)} style={{backgroundColor:'#f39c12',color:'white'}}>Edit</button>
          <button className="btn mr-2"  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>{onDeleteClick(row._id)}}>Delete</button>
        </div>
      ),
    }]:[]),
  ];
  
  const customStyles = {
    
    headCells: {
      style: {
        backgroundColor:'#5d6d7e',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        fontSize:'14px',
        textAlign: 'center', 
        padding:'10px'
      },
    },
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
console.log(data)
  const handleFileUpload =async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
        try{
        const response =await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/addMulitUsers`,{jsonData})
        if(response.data.success){
          toast.success('Users Added Succesfully..')
        }
        }
        catch(e){
          toast.error('Failed To Add Users..')
        }
      };
      reader.readAsBinaryString(file);
    }
  };
  return (
    <div>
      {deleteModelOpen  && <DeleteModel setIsDelete={setIsDelete}/>}
      {openAddModel && <AddEditUser setAddModel={setAddModel} addUser={addUser} editUser={editUser} currentUser={currentUser} setCurrentUser={setCurrentUser}/>}
      {role !='Admin' && <h3 className='m-3'>My Profile:</h3>}
      {role === 'Admin' && <div className='row items-center justify-between mx-3'>
        <div className='d-flex align-items-center w-50 justify-content-between'>
          <input placeholder='Search by user name,email' className='form-control w-50' value ={searchValue} onChange={(e)=>filtering(e.target.value)}/>
          <select className='form-control w-25' value={isActive} onChange={(e)=>{setIsActiveValue(e.target.value)}}>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div className='w-50 flex flex-row items-center justify-end'>
          <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded add-team-btn' onClick={()=>handleButtonClick()}>
          <input type="file"  style={{display:'none'}} ref={fileInputRef} onChange={(e)=>handleFileUpload(e)}/>+Add Multi Users
          </button>   
        <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded add-team-btn' style={{width:'150px'}} onClick={()=>{setAddModel(true);}}>+ Add User</button>
        </div>
        </div>}
      {filteredUsers && filteredUsers.length > 0 ? 
      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20]}
        customStyles={customStyles}
        striped
      />
     : filteredUsers  && filteredUsers.length==0 && <div className='flex items-center justify-center w-full'><img width="600px" height="600px" src={nodataimag}/></div>
}
    </div>
  );
}
