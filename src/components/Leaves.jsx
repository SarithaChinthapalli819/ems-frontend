import React, { useContext, useEffect, useState } from 'react';
import ApplyLeaveModel from './ApplyLeaveModel';
import { toast } from 'react-toastify';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import { context } from '../App';

export default function Leaves() {
    const [applyLeaveModel,openApplyLeaveModel]=useState(false)
    const [appliedLeaves,updateAppliedLeaves] = useState([])
    const [apprvoalLeaves,updateApprovalLeaves] = useState([])
    const [myLeaves,setMyLeaves] = useState(true)
    const [isMyApprovals,setIsMyApprovals] = useState(false)
    const {role} = useContext(context)
    const applyLeave = async (userId,dateFrom,dateTo) =>{
      try{
        const response = await axios.post('https://ems-server-ddw8.onrender.com/api/leaves/applyleave',{userId,dateFrom,dateTo})
        if (response.data.success ){
            toast.success('Leave Applied Successfully')
            openApplyLeaveModel(false)
            setAppliedLeaves()
            setMyApprovalLeaves()
        } 
      }
      catch(e){
        toast.error('Already Applied Leave On Specific Date')
      }
    }
    const setAppliedLeaves = async  () =>{
        const response = await axios.get('https://ems-server-ddw8.onrender.com/api/leaves/myleaves',{
            headers:{
                authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        console.log(response.data.leaves)
        if(response.data.success) updateAppliedLeaves(response.data.leaves)
         
    }
    const setMyApprovalLeaves = async  () =>{
      const response = await axios.get(`https://ems-server-ddw8.onrender.com/api/leaves/myApprovals/${role}`,{
          headers:{
              authorization:`Bearer ${localStorage.getItem("token")}`
          }
      })
      if(response.data.success) updateApprovalLeaves(response.data.leaves)
       
    }
    useEffect(()=>{
        setAppliedLeaves()
        setMyApprovalLeaves()
    },[role])

    const leaveStatusCahange=async (id,cancel,approve,reject,email,name,leavefrom,leaveto)=>{
      const response = await axios.post(`https://ems-server-ddw8.onrender.com/api/leaves/cancelOrapproveOrreject/${id}`,{cancel,approve,reject,email,name,leavefrom,leaveto})
      if(response.data.success){ 
       if(cancel) toast.success('Cancelled successfully')
       else if(approve) toast.success('Approved successfully')
       else toast.success('Rejected successfully')
       setAppliedLeaves()
       setMyApprovalLeaves()
      }
    }
    const apprvoalColumns = [
        {
          name: 'User Name',
          selector: (row) => row.User.name,
          sortable: true,
        },
        {
          name: 'LeaveFrom',
          selector: (row) => new Date(row.LeaveFrom).toLocaleDateString(),
          sortable: true,
        },
        {
          name: 'Leave To',
          selector: (row) => new Date(row.LeaveTo).toLocaleDateString(),
          sortable: true,
        },
        {
          name: 'Actions',
          cell: (row) => (
            <div>
              <button className="btn  mr-2" style={{backgroundColor:'#f39c12',color:'white'}} onClick={()=>leaveStatusCahange(row._id,true,false,false,row.User.email,row.User.name,row.LeaveFrom,row.LeaveTo)}>Cancel Leave</button>
              {role === 'Admin'  && <button className="btn btn-success mr-2" onClick={()=>leaveStatusCahange(row._id,false,true,false,row.User.email,row.User.name,row.LeaveFrom,row.LeaveTo)}>Approve </button>}
              {role === 'Admin' && <button className="btn mr-2"  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>leaveStatusCahange(row._id,false,false,true,row.User.email,row.User.name,row.LeaveFrom,row.LeaveTo)}>Reject </button>}
            </div>
          ),
        },
      ];

      const Columns = [
        {
          name: 'User Name',
          selector: (row) => row.User.name,
          sortable: true,
        },
        {
          name: 'LeaveFrom',
          selector: (row) => new Date(row.LeaveFrom).toLocaleDateString(),
          sortable: true,
        },
        {
          name: 'Leave To',
          selector: (row) => new Date(row.LeaveTo).toLocaleDateString(),
          sortable: true,
        },
        {
          name: 'Status',
          cell: (row) => (
            <div>
              {row.isPending && <span style={{color:'blue'}}>Pending</span>}
              {row.isApproved && <span style={{color:'green'}}>Approved</span>}
              {row.isRejected && <span style={{color:'red'}}>Rejected</span>}
              {row.isCanceled && <span style={{color:'6c757d'}}>Cancelled</span>}
             </div>
          ),
        },
        
        {
          name: '',
          cell: (row) => (
            <div>
               <button className="bg-orange-400 hover:bg-orange-500 text-white p-2 rounded mr-2" disabled={row.isCanceled} onClick={()=>leaveStatusCahange(row._id,true,false,false)}>Cancel Leave</button>
             </div>
          ),
        },
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
            fontSize: '14px',
            textAlign: 'center',
            padding: '10px'
          },
        },
      };
  return (
    <div>
      <div className='text-green-600 hover:text-green-700 hover:cursor-pointer p-2 rounded float-end add-team-btn font-bold' onClick={()=>openApplyLeaveModel(true)}>Apply Leave</div>
      {role === 'Admin' && <div className='text-teal-500 hover:text-teal-600 hover:cursor-pointer rounded p-2 float-end add-team-btn font-bold' onClick={()=>{setIsMyApprovals(true);setMyLeaves(false)}}>My Approvals</div>}
      {role === 'Admin' && <div className='text-indigo-500 hover:text-indigo-600 hover:cursor-pointer p-2 rounded float-end add-team-btn font-bold' onClick={()=>{setMyLeaves(true);setIsMyApprovals(false)}}>My Leaves</div>}
      {applyLeaveModel && <ApplyLeaveModel openApplyLeaveModel={openApplyLeaveModel} applyLeave={applyLeave}/>}
      {
        myLeaves && appliedLeaves && appliedLeaves.length>0 &&
        <DataTable
          columns={Columns}
          data={appliedLeaves}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 20]}
          customStyles={customStyles}
          striped
        />
      }
      {
        isMyApprovals && apprvoalLeaves && apprvoalLeaves.length>0 &&
        <DataTable
          columns={apprvoalColumns}
          data={apprvoalLeaves}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 20]}
          customStyles={customStyles}
          striped
        />
      }
    </div>
  );
}
