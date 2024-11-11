import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AddMember({closeMemberPopup,teamId}) {
    const [users, setUsers] = useState([])
    const [selectedUser, selectUser] = useState("")
    const [teamMembers,setTeammeber]=useState([])
    const usersdata = async () => {
        const response = await axios.get('https://ems-frontend-air2.vercel.app/api/user/1',{
            headers:{
                authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        const users= response.data.users.filter((item)=>!item.team)
        setUsers(users)
    }
    
    useEffect(() => {
        usersdata()
        addTeamMember()
    }, [])

    const addTeamMember = async ()=>{
        const response = await axios.get(`https://ems-frontend-air2.vercel.app/api/teams/user/${teamId}`)
        setTeammeber(response.data.team.user)
    }
    const addUser = async (userId) =>{
        try{
        const response = await axios.post(`https://ems-frontend-air2.vercel.app/api/teams/adduser/${teamId}`,{userId})
        if(response.data.success){
             toast.success('User Added To Team SuucessFully')
             addTeamMember()
        }
        }
        catch(e){
            toast.error(e.message)
        }
    }

    const addUserToTeam = async (value)=>{
        selectUser(value)
        addUser(value)
    }

    const removeUser = async (userId) =>{
      const response = await axios.put(`https://ems-frontend-air2.vercel.app/api/teams/removeuser/${teamId}`,{userId})
      if(response.data.success) 
        {
            toast.success('User Removed SuccessFully ..')  
            addTeamMember()
        }
    }
    return (
        <div className='addmember-backdrop'>
            <div className="addmember-content" >

                <select value={selectedUser} onChange={(e) =>{ addUserToTeam(e.target.value)}} className='float-end form-control w-25'>
                    <option value="" disabled>Add Member</option>
                    {users && users.length>0 && users.map((item) => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                    ))
                    }
                </select>

                <table className="table table-striped table-hover">
                    <thead>
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

                <button className='btn'  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>closeMemberPopup()}>Close</button>
            </div>
        </div>
    );
}
