import React, { useEffect, useState } from 'react';
import AddProject from './AddProject';
import axios from 'axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import AddProjectMember from './AddProjectMember';
import Tasks from './Tasks';
import nodataimag from '../assets/nodataimag.jpg'
export default function Board() {
  const [addProjectPopup, openAddProjectPopup] = useState(false)
  const [addMemberPopup, openAddMemberPopup] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [projects, updateProjects] = useState([])
  const [taskpage, openTaskPage] = useState(false)
  const [id, setId] = useState(null)
  const [row, setRow] = useState(null)
  const projectsData = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/board`)
    updateProjects(response.data.projects)
  }

  useEffect(() => {
    projectsData()
  }, [])

  const addPorject = async (projectName) => {

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/board/addProjects`, { projectName })
      if (response.data.success) {
        toast.success('Added Project Succesfully')
        openAddProjectPopup(false)
        projectsData()
      }
      else {
        toast.error(e.message)
      }
    }
    catch (e) {
      toast.error('Failed Due To Error..')
    }
  }

  const editPorject = async (projectName) => {

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/board/updateProject/${id}`, { projectName })
      if (response.data.success) {
        toast.success('Updated the Project Succesfully')
        openAddProjectPopup(false)
        projectsData()
      }
      else {
        toast.error(e.message)
      }
    }
    catch (e) {
      toast.error('Failed Due To Error..')
    }
  }
  const deleteProject = async (id) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/board/deleteProject/${id}`)
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
          <button className="btn mr-2" style={{ backgroundColor: 'rgb(54, 194, 196)', color: 'white' }} onClick={() => { openTaskPage(true); setRow(row) }}>Go To Task</button>
        </div>
      ),
    },
    {
      name: '',
      cell: (row) => (
        <div>
          <button className=" mr-2 bg-green-600 hover:bg-green-700
 text-white py-2 px-4 rounded"  onClick={() => { openAddMemberPopup(true); setId(row._id) }}>Add Project Member</button>
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button className="btn  mr-2" style={{ backgroundColor: '#f39c12', color: 'white' }} onClick={() => { setId(row._id); setCurrentProject(row.projectName); openAddProjectPopup(true) }}>Edit</button>
          <button className="btn mr-2" style={{ backgroundColor: '#e74c3c', color: 'white' }} onClick={() => { deleteProject(row._id) }}>Delete</button>
        </div>
      ),
    },

  ];
  const customStyles = {

    headCells: {
      style: {
        backgroundColor: '#5d6d7e',
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
    <div style={{ height: "100%" }}>
      {!taskpage && <div className='flex flex-row justify-end'><button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded m-3' onClick={() => { setCurrentProject(null); openAddProjectPopup(true) }}> + Add Projects</button></div>}
      {
        !taskpage && addProjectPopup && <AddProject openAddProjectPopup={openAddProjectPopup} addPorject={addPorject} currentProject={currentProject} setCurrentProject={setCurrentProject} editPorject={editPorject} />
      }
      {!taskpage && projects && projects.length > 0 ?
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DataTable
            columns={columns}
            data={projects}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20]}
            customStyles={customStyles}
            striped
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 200px)"
          />
        </div>
        : !taskpage && projects && projects.length == 0 && <div className='flex items-center justify-center w-full' style={{ height: "70vh" }}><img width="600px" height="600px" src={nodataimag} /></div>
      }
      {
        !taskpage && addMemberPopup && <AddProjectMember openAddMemberPopup={openAddMemberPopup} id={id} />
      }
      {taskpage && <Tasks row={row} openTaskPage={openTaskPage} />}
    </div>
  );
}
