import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { context } from '../App';
import DataTable from 'react-data-table-component';
import nodataimag from '../assets/nodataimag.jpg'
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

function UserTasks() {
  const [tasks,getTasks]=useState([])
  const {role} = useContext(context)
  const [isHorizontal,setHorizontal] = useState(true)
  const [isVertical,setVertical] = useState(false)
  const normalizeStatus = (status) => status.toLowerCase().replace(/\s+/g, '');

  const [data,setInitialData]=useState( {
    columns: {
      new: { id: 'new', title: 'New', taskIds: [] },
      inprogress: { id: 'inprogress', title: 'In Progress', taskIds: [] },
      devcompleted: { id: 'devcompleted', title: 'Dev Completed', taskIds: [] },
      deployed: { id: 'deployed', title: 'Deployed', taskIds: [] },
      readyforqa: { id: 'readyforqa', title: 'Ready for QA', taskIds: [] },
      qaapproved: { id: 'qaapproved', title: 'QA Approved', taskIds: [] },    
    },
    tasks: {
      
    },
    columnOrder: ['new', 'inprogress', 'devcompleted', 'deployed','readyforqa', 'qaapproved', ],
  }
  )
  const statusChange =async (title,id)=>{
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/updateTaskStatus/${id}`,{title},{
      headers:{
          authorization:`Bearer ${localStorage.getItem("token")}`
      }
  })
    if(response.data.success){
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/getMyTasks/${role}`,{
        headers:{
            authorization:`Bearer ${localStorage.getItem("token")}`
        }
    })
    getTasks(response.data.tasks)
  }
    
  }
  const columns = [
    {
      name: 'Task Name',
      selector: (row) => row.taskName,
      sortable: true,
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
      name : 'Deadline Date',
      selector : (row) => new Date(row.deadLineDate).toLocaleDateString(),
      sortable:true,
    }
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

  const tasksValue = async()=>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/getMyTasks/${role}`,{
      headers:{
          authorization:`Bearer ${localStorage.getItem("token")}`
      }
  })
  getTasks(response.data.tasks)
  setInitialData(updateDataWithTasks(response.data.tasks,data))
  }

  useEffect(() => {
    tasksValue()
  }, []);

  const updateDataWithTasks = (newTasks, data) => {
    const updatedData = { ...data };
  
    newTasks.forEach(task => {
      updatedData.tasks[task._id] = {
        id: task._id,
        content: task.taskName, 
        assignee: task.assignee.name,
        deadline: task.deadLineDate,
        priority:task.priority
      };

      const columnId = Object.keys(updatedData.columns).find(
        columnKey => updatedData.columns[columnKey].title.toLowerCase() === task.status.toLowerCase()
      );
  
      
      if (columnId) {
        updatedData.columns[columnId].taskIds.push(task._id);
      }
    });
  
    return updatedData;
  };
  
  const onDragEnd =async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside any column
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move task to new column
    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];

    if (startColumn === endColumn) {
      // Moving within the same column
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setInitialData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
    } else {
      // Moving to a different column
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = { ...startColumn, taskIds: startTaskIds };

      const endTaskIds = Array.from(endColumn.taskIds);
      endTaskIds.splice(destination.index, 0, draggableId);
      const newEnd = { ...endColumn, taskIds: endTaskIds };
      const title=newEnd.title
      setInitialData({
        ...data,
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newEnd.id]: newEnd,
        },
      });
     
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/updateTaskStatus/${draggableId}`,{title},{
        headers:{
            authorization:`Bearer ${localStorage.getItem("token")}`
        }
    })
      if(response.data.success){
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/getMyTasks/${role}`,{
          headers:{
              authorization:`Bearer ${localStorage.getItem("token")}`
          }
      })
      getTasks(response.data.tasks)
      }
    }
  };

  return (
    <>
    <div className='flex flex-col' style={{height:"100%"}}>
      <div className='flex justify-end p-6 flex-wrap'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" onClick={()=>{setHorizontal(true);setVertical(false)}}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" onClick={()=>{setHorizontal(false);setVertical(true)}}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
        </svg>
      </div>
      {isVertical && <div style={{ height: '80%' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', justifyContent: 'space-around', height: '100%',overflow:'auto' }}>
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              return (
                <Droppable droppableId={column.id} key={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        width: '16%',
                        backgroundColor: '#f0f0f0',
                        borderRadius: 4,
                        margin: '0 5px',
                      }}
                    >
                      <h6
                        style={{
                          backgroundColor: columnColors[column.id],
                          color: '#fff',
                          padding: '10px',
                          borderRadius: '4px 4px 0 0',
                          textAlign: 'center',
                        }}
                      >
                        {column.title}
                      </h6>
                      {column.taskIds.map((taskId, index) => {
                        const task = data.tasks[taskId];
                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  padding: 8,
                                  margin: '0 0 8px 0',
                                  backgroundColor: '#fff',
                                  borderRadius: 4,
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                }}
                              >
                                <b>{task.assignee}</b><br/>
                                Task : {task.content}<br/>
                               <span style={{color:priorityColumnColors[normalizeStatus(task.priority)]}}>Priority : {task.priority}</span>  <br/>
                                {new Date(task.deadline).toLocaleDateString()}<br/>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>}

      {isHorizontal && tasks && tasks.length > 0 ? 
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <DataTable
        columns={columns}
        data={tasks}
        pagination
        paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20]}
        customStyles={customStyles}
        striped
        fixedHeader
        fixedHeaderScrollHeight="calc(100vh - 200px)"
      />
      </div>
     : isHorizontal && tasks && tasks.length==0 && <div className='flex items-center justify-center w-full' style={{height:"70vh"}}><img width="600px" height="600px" src={nodataimag}/></div>
}
    </div>
     
     </>
  );
}

export default UserTasks;
