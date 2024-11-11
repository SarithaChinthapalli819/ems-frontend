import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
export default function AddTasks({openAddTaskPopup,row,setRow,addTaks,currentTask,editTasks,isfromAllTasks}) {
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const normalizeStatus = (status) => status.toLowerCase().replace(/\s+/g, '');
  const [projectMember,setTeammeber]=useState([])
  const [projects,updateProjects] = useState([])
  const [taskDetails,setTaskDetails]=useState({
    taskName:'',
    assigneName:'',
    priority:'P0 Critical',
    projectName:''
  })
  const projectsData= async ()=>{
    const response = await axios.get('https://ems-server-ddw8.onrender.com/api/board')
    updateProjects(response.data.projects)
  }

  useEffect(()=>{
    projectsData()
  },[])
  const columnColors = {
    p0critical: 'rgb(254, 2, 4)',
    p1high: 'rgb(254, 126, 2)',
    p2medium: 'rgb(0, 191, 255)',
    p3low: 'rgb(123, 123, 123)'
  };

  const {taskName,assigneName,priority,projectName}=taskDetails;
    const addProjectMember = async (id)=>{
      const response =await axios.get(`https://ems-server-ddw8.onrender.com/api/board/getMember/${id}`)
      setTeammeber(response.data.members[0].User)
  }
  const addUser=async()=>{
    const response =await axios.get(`https://ems-server-ddw8.onrender.com/api/user/1`,{
      headers:{
          authorization:`Bearer ${localStorage.getItem("token")}`
      }
  })
  setTeammeber(response.data.users)
  }
 

  useEffect(()=>{
    if(!isfromAllTasks){
      addProjectMember(row._id);
    }
    else if(row._id == null && projectName=='' && isfromAllTasks){
      addUser()
    }
  },[row])
  useEffect(()=>{
    if(currentTask !=null){
      setTaskDetails({...taskDetails,assigneName:currentTask.assignee._id,taskName:currentTask.taskName,priority:currentTask.priority,projectName:currentTask.Project._id})
      setSelectedDateFrom(currentTask.deadLineDate)
      if(isfromAllTasks){
        setRow({...row,_id:currentTask.Project._id})
      }
    }
    
  },[currentTask])

  const changeHandler=(e)=>{
    setTaskDetails({...taskDetails,[e.target.name]:e.target.value})
  }
  const submitHandler=(e)=>{
    e.preventDefault()
    if(currentTask ==null){
    addTaks(taskName,assigneName,selectedDateFrom,row._id,priority)
    }
    else{
      editTasks(taskName,assigneName,selectedDateFrom,row._id,priority)
    }
  }

    return (
        <div className='notemodal-backdrop'>
            <div className="notemodal-content" >
                <form>
                   {currentTask ? <h4>Update Task</h4> :<h4>Add Task</h4>} 
                    {!isfromAllTasks && <><label className='form-label'>Project Name:</label>
                    <input value={row.projectName} className='form-control' disabled={true}/></>}
                    {
                      isfromAllTasks && <select  value={projectName} name="projectName" className='form-control w-100 mb-3' onChange={(e)=>{setRow({...row,_id:e.target.value});changeHandler(e);addProjectMember(e.target.value)}}>
                      <option value="" disabled>Select Project</option>
                      {projects && projects.length>0 && projects.map((item) => (
                          <option key={item._id} value={item._id}>{item.projectName}</option>
                      ))
                      }
                      </select>
                    }
                    <label className='form-label'>Task Name:</label>
                    <input className='form-control' value={taskName} name="taskName" onChange={(e)=>changeHandler(e)}/>
                    <label className='form-label'>Assignee:</label>
                    <select  value={assigneName} name="assigneName" className='form-control w-100 mb-3' onChange={(e)=>changeHandler(e)}>
                    <option value="" disabled>Select User</option>
                    {projectMember && projectMember.length>0 && projectMember.map((item) => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                    ))
                    }
                    </select>
                    <label className='form-label'>Priority:</label>
                    <select  value={priority} style={{color:columnColors[normalizeStatus(priority)]}} name="priority" className='form-control w-100 mb-3' onChange={(e)=>changeHandler(e)}>
                      <option value="P0 Critical" style={{color: columnColors[normalizeStatus("P0 Critical")] || 'grey',fontWeight: 'bold'}}>P0 Critical</option>
                      <option value="P1 High" style={{color: columnColors[normalizeStatus("P1 High")] || 'grey',fontWeight: 'bold'}}>P1 High</option>
                      <option value="P2 Medium" style={{color: columnColors[normalizeStatus("P2 Medium")] || 'grey',fontWeight: 'bold'}}>P2 Medium</option>
                      <option value="P3 Low" style={{color: columnColors[normalizeStatus("P3 Low")] || 'grey',fontWeight: 'bold'}}>P3 Low</option>
                    </select>
                    <label className='form-label'>Deadline Date:</label>
                    <DatePicker className='form-control mb-3'
                      selected={selectedDateFrom} 
                      onChange={(date) => setSelectedDateFrom(date)} 
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Choose LeaveDate From" 
                      showYearDropdown 
                      scrollableYearDropdown 
                    /><br/>
                   {currentTask ? <button className='btn btn-primary mt-2' onClick={(e)=>submitHandler(e)}>Update Task</button> : <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2' onClick={(e)=>submitHandler(e)}>Add Task</button>} <br />
                    <button className='btn  mt-2'  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>{openAddTaskPopup(false);setRow({...row,_id:null})}}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
