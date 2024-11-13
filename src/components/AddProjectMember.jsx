import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AddProjectMember({openAddMemberPopup,id}) {
    const [users, setUsers] = useState([])
    const [selectedUser, selectUser] = useState("")
    const [teamMembers,setTeammeber]=useState([])
    
    useEffect(() => {
        addProjectMember()   
        
    }, [])

    const addProjectMember = async ()=>{
       const response =await axios.get(`${import.meta.env.VITE_API_URL}/api/board/getMember/${id}`)
       setTeammeber(response.data.members[0].User)
       const members=response.data.members[0].User
       const userresponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/1`,{
        headers:{
            authorization:`Bearer ${localStorage.getItem("token")}`
        }
        })
        const users= userresponse.data.users.filter(user=>!(members.some(item=>item._id == user._id)))
        setUsers(users)
    }
   

    const addUserToTeam = async (value)=>{
        const member=value
        try{
       const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/board/addMember/${id}`,{member})
       if(response.data.success){
        toast.success('Added Project Member Successfully..')
        addProjectMember() 
       }
    }catch(e){
        toast.error('fialed duw to error')
    }
    }

    const removeUser = async (userId) =>{
        const member=userId
        try{
       const response=await axios.put(`${import.meta.env.VITE_API_URL}/api/board/removeMember/${id}`,{member})
       if(response.data.success){
        toast.success('Removed Project Member Successfully..')
        addProjectMember() 
       }
        }catch(e){
            toast.error('fialed duw to error')
        }
    }
    return (
        <div className='addmember-backdrop'>
            <div className="addmember-content" >

                <select value={selectedUser} onChange={(e) =>{selectUser(e.target.value); addUserToTeam(e.target.value)}} className='float-end form-control' style={{width:'184px'}}>
                    <option value="" disabled>Add Project Member</option>
                    {users && users.length>0 && users.map((item) => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                    ))
                    }
                </select>
               
                <table style={{maxHeight:"300px",overflowY:"auto" }} className="table table-striped table-hover">
                    <thead className='sticky'>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.length > 0 ? (
                            teamMembers.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td><button className='btn'  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>removeUser(item._id)}>Delete</button></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No team members found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
               
                <button className='btn'  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>openAddMemberPopup(false)}>Close</button>
            </div>
        </div>
    );
}
