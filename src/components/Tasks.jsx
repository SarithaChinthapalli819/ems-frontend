import React, { useContext, useEffect, useState } from 'react';
import AddTasks from './AddTasks';
import axios from 'axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import * as XLSX from 'xlsx';

export default function Tasks({row,openTaskPage}) {
  const [addTaskPopup,openAddTaskPopup]=useState(false)
  const [tasks,getTasks]=useState([])
  const [selectedStauts,setSelectedStauts]=useState('P0 Priority')
  const [currentTask,setCurrentTask]=useState(null)
  const [filteredRecords,setFilteredRecords] = useState([])
  const [projectMember,setTeammeber]=useState([])
  const [assigneName,setAssigneName] = useState()
  const [exceldata,setExcelData]=useState([])
  const [isfromAllTasks,setFromAllTasks]=useState(false)
  useEffect(()=>{
    setFilteredRecords(tasks)
  },[tasks])

  

  useEffect(()=>{
   const exceldata = filteredRecords.map((item)=>({
      taskName:item.taskName,
      projectName:item.Project.projectName,
      deadLineDate:item.deadLineDate,
      priority:item.priority,
      status:item.status,
      Assignee:item.assignee.name
    }))
    setExcelData(exceldata)
  },[filteredRecords])

  const downloadExcel= ()=>{
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exceldata);
    XLSX.utils.book_append_sheet(workbook,worksheet,'Sheet1');
    XLSX.writeFile(workbook,'TaskSheet.XLSX')
  }

  const filterBasedOnPriority = (value)=>{
    const filtered = tasks.filter(item =>item.status == value)
    setFilteredRecords(filtered)
  }

  const filteredBasedOnAssigne = (value) =>{
    const filtered = tasks.filter(item =>item.assignee.name == value)
    setFilteredRecords(filtered)
  }

  const addProjectMember = async ()=>{
    const response =await axios.get(`https://ems-frontend-jkr7.vercel.app/api/board/getMember/${row._id}`)
    setTeammeber(response.data.members[0].User)
  }

  useEffect(()=>{
    addProjectMember()
  },[row])

  const columnColors = {
    new: 'rgb(183, 183, 183)',
    inprogress: 'rgb(51, 178, 255)',
    devcompleted: 'rgb(112, 173, 71)',
    readyforqa: 'rgb(81, 187, 82)',
    qaapproved: 'rgb(255, 217, 102)',
    deployed: 'rgb(54, 194, 196)',
  };

  const priorityColumnColors = {
    p0critical: 'rgb(254, 2, 4)',
    p1high: 'rgb(254, 126, 2)',
    p2medium: 'rgb(0, 191, 255)',
    p3low: 'rgb(123, 123, 123)'
  };

  const normalizeStatus = (status) => status.toLowerCase().replace(/\s+/g, '');

  const addTaks = async(taskName,userId,selectedDateFrom,projectId,priority)=>{
    
    const response = await axios.post('https://ems-frontend-jkr7.vercel.app/api/tasks/AddTasks',{taskName,userId,selectedDateFrom,projectId,priority},{
        headers:{
            authorization:`Bearer ${localStorage.getItem("token")}`
        }
    })
    if(response.data.success)
    {
      toast.success('Task Added Successfully ..')
      openAddTaskPopup(false)
      tasksValue()
    }
  }
  
  const editTasks = async(taskName,userId,selectedDateFrom,projectId,priority)=>{
    
    const response = await axios.put(`https://ems-frontend-jkr7.vercel.app/api/tasks/updateTasks/${currentTask._id}`,{taskName,userId,selectedDateFrom,projectId,priority})
    if(response.data.success)
    {
      toast.success('Task Updated Successfully ..')
      openAddTaskPopup(false)
      tasksValue()
    }
  }

  const deleteTasks = async(id)=>{
    
    const response = await axios.delete(`https://ems-frontend-jkr7.vercel.app/api/tasks/deleteTasks/${id}`)
    if(response.data.success)
    {
      toast.success('Task Deleted Successfully ..')
      openAddTaskPopup(false)
      tasksValue()
    }
  }

  const tasksValue = async()=>{
    const response = await axios.get(`https://ems-frontend-jkr7.vercel.app/api/tasks/getTasks/${row._id}`,{
      headers:{
          authorization:`Bearer ${localStorage.getItem("token")}`
      }
  })
    getTasks(response.data.tasks)
   
  }

  const statusChange =async (title,id)=>{
    const response = await axios.put(`https://ems-frontend-jkr7.vercel.app/api/tasks/updateTaskStatus/${id}`,{title},{
      headers:{
          authorization:`Bearer ${localStorage.getItem("token")}`
      }
  })
    if(response.data.success){
      const response = await axios.get(`https://ems-frontend-jkr7.vercel.app/api/tasks/getTasks/${row._id}`,{
        headers:{
            authorization:`Bearer ${localStorage.getItem("token")}`
        }
    })
    getTasks(response.data.tasks)
  }
    
  }

  useEffect(() => {
    tasksValue()
  }, []);

  const columns = [
    {
      name: 'Task Name',
      selector: (row) => row.taskName,
      sortable: true,
    },
    {
      name : 'Assignee',
      selector : (row) => row.assignee.name,
      sortable:true,
    },
    {
      name : 'Project Name',
      selector : (row) => row.Project.projectName,
      sortable:true,
    },
    {
      name : 'Status',
      selector : (row) => row.status,
      sortable:true,
      cell: (row) => (
        <span>
          <select  className='float-end form-control' value={row.status} onChange={(e)=>{statusChange(e.target.value,row._id)}} style={{
            color: columnColors[normalizeStatus(row.status)] || 'grey',
            fontWeight: 'bold',
          }}>
                        <option key='New' value='New' style={{color:'rgb(183, 183, 183)'}}>New</option>  
                        <option key='In Progress' value='In Progress' style={{color:'rgb(51, 178, 255)'}}>In Progress</option>  
                        <option key='Dev Completed' value='Dev Completed' style={{color:'rgb(112, 173, 71)'}}>Dev Completed</option>  
                        <option key='Deployed' value='Deployed' style={{color:'rgb(54, 194, 196)'}}>Deployed</option>  
                        <option key='Ready for QA' value='Ready for QA' style={{color:'rgb(81, 187, 82)'}}>Ready for QA</option> 
                        <option key='QA Approved' value='QA Approved' style={{color:'rgb(255, 217, 102)'}}>QA Approved</option>             
                </select>
                </span>
      ),
    },
    {
      name : 'Deadline Date',
      selector : (row) => new Date(row.deadLineDate).toLocaleDateString(),
      sortable:true,
    },
    {
      name : 'Priority',
      selector : (row) =>row.priority,
      sortable:true,
      cell:(row) =>(
        <span style={{color:priorityColumnColors[normalizeStatus(row.priority)]}}>
          {row.priority}
        </span>
      )
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button className="btn mr-2" style={{backgroundColor:'#f39c12',color:'white'}} onClick={()=>{setCurrentTask(row);openAddTaskPopup(true)}}>Edit</button>
          <button className="btn mr-2" style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>deleteTasks(row._id)}>Delete</button>
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
        fontSize:'14px',
        textAlign: 'center', 
        padding:'10px'
      },
    },
  };


  return (
    <div>
      <div className='flex flex-row justify-between'>
      <button className='btn btn-primary m-3 float-end' onClick={()=>openTaskPage(false)}> + Back To Projects</button>
      <div className="flex items-center w-50 justify-content-around">
      <select  value={assigneName} name="assigneName" className='form-control w-25 mr-2' onChange={(e)=>{setAssigneName(e.target.value);filteredBasedOnAssigne(e.target.value)}}>
                    <option value="" disabled>Select User</option>
                    {projectMember && projectMember.length>0 && projectMember.map((item) => (
                        <option key={item._id} value={item.name}>{item.name}</option>
                    ))
                    }
                    </select>
      <select  className='float-end form-control w-25' value={selectedStauts} onChange={(e)=>{setSelectedStauts(e.target.value);filterBasedOnPriority(e.target.value)}} style={{
            color: columnColors[normalizeStatus(selectedStauts)] || 'grey',
            fontWeight: 'bold',
          }}>
                        <option key='New' value='New' style={{color:'rgb(183, 183, 183)'}}>New</option>  
                        <option key='In Progress' value='In Progress' style={{color:'rgb(51, 178, 255)'}}>In Progress</option>  
                        <option key='Dev Completed' value='Dev Completed' style={{color:'rgb(112, 173, 71)'}}>Dev Completed</option>  
                        <option key='Deployed' value='Deployed' style={{color:'rgb(54, 194, 196)'}}>Deployed</option>  
                        <option key='Ready for QA' value='Ready for QA' style={{color:'rgb(81, 187, 82)'}}>Ready for QA</option> 
                        <option key='QA Approved' value='QA Approved' style={{color:'rgb(255, 217, 102)'}}>QA Approved</option>             
                </select>
      <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded m-3 float-end' onClick={()=>{setCurrentTask(null);openAddTaskPopup(true)}}> + Add Task</button>
      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Download Tasks !!</Tooltip>}>
        <svg onClick={()=>downloadExcel()} className='hover:cursor-pointer size-6' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </OverlayTrigger>

      </div>
      </div>
      {addTaskPopup && <AddTasks openAddTaskPopup={openAddTaskPopup} row={row} addTaks={addTaks} currentTask={currentTask} editTasks={editTasks} deleteTasks={deleteTasks} isfromAllTasks={isfromAllTasks}/>}
      {filteredRecords && filteredRecords.length > 0 ? 
      <DataTable
        columns={columns}
        data={filteredRecords}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 20]}
        customStyles={customStyles}
        striped
      />
     : 'No Tasks Found'}
     
    </div>
  );
}
