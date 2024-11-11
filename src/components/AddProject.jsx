import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AddProject({openAddProjectPopup,addPorject,currentProject,editPorject}) {
   
    const [projectDetails,setProjectDetails]=useState(
        {
            projectName:''
        }
    )
    const {projectName} = projectDetails;
    const changeHandler=(e)=>{
        setProjectDetails({...projectDetails,[e.target.name]:e.target.value})
    }
    useEffect(()=>{
        if(currentProject !=null){
            setProjectDetails({...projectDetails,projectName:currentProject})
        }
    },[currentProject])
    const submitHandler = (e)=>{
        e.preventDefault();
        if(currentProject ==null){
        addPorject(projectName)
        }
        else{
            editPorject(projectName)
        }
    }
    return (
        <div className='notemodal-backdrop'>
            <div className="notemodal-content" >
                <form>
                    {currentProject!=null ? <h3>Update Porject</h3> : <h3>Add Porject</h3>}
                    <label className='form-label'>Project Name:</label>
                    <input type="text" value={projectName} name="projectName" className='form-control' onChange={(e)=>changeHandler(e)}/><br/>
                    <div className='d-flex w-full justify-between'>
                    {currentProject!=null ?<button className='btn btn-success' onClick={(e)=>submitHandler(e)}>Update Project</button>:<button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded' onClick={(e)=>submitHandler(e)}>Add Project</button>}
                    <button className='btn'  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>openAddProjectPopup(false)}>Close</button>
                    </div>
                </form>

                
            </div>
        </div>
    );
}
