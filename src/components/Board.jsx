import React, { useEffect, useState } from 'react';
import AddProject from './AddProject';
import axios from 'axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import AddProjectMember from './AddProjectMember';
import Tasks from './Tasks';

export default function Board() {
  const [addProjectPopup, openAddProjectPopup] = useState(false)
  const [addMemberPopup,openAddMemberPopup] = useState(false)
  const [currentProject,setCurrentProject]=useState(null)
  const [projects,updateProjects] = useState([])
  const [taskpage,openTaskPage] = useState(false)
  const [id,setId]=useState(null)
  const [row,setRow]=useState(null)
  const projectsData= async ()=>{
    const response = await axios.get('https://ems-frontend-jkr7.vercel.app/api/board')
    updateProjects(response.data.projects)
  }

  useEffect(()=>{
    projectsData()
  },[])

  const addPorject = async (projectName) => {
    
    try {
      const response = await axios.post('https://ems-frontend-jkr7.vercel.app/api/board/addProjects', { projectName })
      if (response.data.success) {
        toast.success('Added Project Succesfully')
        openAddProjectPopup(false)
        projectsData()
      }
      else {
        toast.error(e.message)
      }
    }
    catch(e) {
      toast.error('Failed Due To Error..')
    }
  }

  const editPorject = async (projectName) => {
    
    try {
      const response = await axios.put(`https://ems-frontend-jkr7.vercel.app/api/board/updateProject/${id}`, { projectName })
      if (response.data.success) {
        toast.success('Updated the Project Succesfully')
        openAddProjectPopup(false)
        projectsData()
      }
      else {
        toast.error(e.message)
      }
    }
    catch(e) {
      toast.error('Failed Due To Error..')
    }
  }
  const deleteProject=async (id)=>{
    const response = await axios.delete(`https://ems-frontend-jkr7.vercel.app/api/board/deleteProject/${id}`)
    if (response.data.success) {
      toast.success('Deleted the Project Succesfully')
      openAddProjectPopup(false)
      projectsData()
    }
    else {
      toast.error(e.message)
    }
  }

  const columns = [
    {
      name: 'Project Name',
      selector: (row) => row.projectName,
      sortable: true,
    },
    {
      name: '',
      cell: (row) => (
        <div>
          <button className="btn mr-2" style={{backgroundColor:'rgb(54, 194, 196)',color:'white'}} onClick={()=>{openTaskPage(true);setRow(row)}}>Go To Task</button>
        </div>
      ),
    },
    {
      name: '',
      cell: (row) => (
        <div>
          <button className=" mr-2 bg-green-600 hover:bg-green-700
 text-white py-2 px-4 rounded"  onClick={()=>{openAddMemberPopup(true);setId(row._id)}}>Add Project Member</button>
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button className="btn  mr-2" style={{backgroundColor:'#f39c12',color:'white'}} onClick={()=>{setId(row._id);setCurrentProject(row.projectName);openAddProjectPopup(true)}}>Edit</button>
          <button className="btn mr-2"  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>{deleteProject(row._id)}}>Delete</button>
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
     {!taskpage && <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded m-3 float-end' onClick={() => {setCurrentProject(null);openAddProjectPopup(true)}}> + Add Projects</button>}
      {
       !taskpage && addProjectPopup && <AddProject openAddProjectPopup={openAddProjectPopup} addPorject={addPorject} currentProject={currentProject} setCurrentProject={setCurrentProject} editPorject={editPorject}/>
      }
      {!taskpage && projects && projects.length > 0 ? 
      <DataTable
        columns={columns}
        data={projects}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 20]}
        customStyles={customStyles}
        striped
      />
     : !taskpage && 'No Projects Found'}
     {
      !taskpage && addMemberPopup && <AddProjectMember openAddMemberPopup={openAddMemberPopup} id={id}/>
     }
     {taskpage && <Tasks row={row} openTaskPage={openTaskPage}/>}
    </div>
  );
}
