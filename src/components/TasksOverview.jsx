import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

export default function TasksOverview() {
    const [tasks, setTasks] = useState([]);
    const [statusCount, setStatusCount] = useState([]);
    const [employeeStatusCount, setEmployeeStatusCount] = useState([]);
    const [priorityCount, setPriorityCount] = useState([]);
    const [projectMember,setTeammeber]=useState([])
    const [assigneName,setAssigneName] = useState()
    const [employeeTasks,setEmployeeTasks] = useState([])
    const fetchTasks = async () => {
        const response = await axios.get('https://ems-server-ddw8.onrender.com/api/tasks/getAllTasks');
        setTasks(response.data.tasks);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addProjectMember = async ()=>{
        const response =await axios.get(`https://ems-server-ddw8.onrender.com/api/user/1`,{
            headers:{
                authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
        setTeammeber(response.data.users)
        setAssigneName(response.data.users[0].name)
    }
    
    useEffect(()=>{
        addProjectMember()
    },[])
    
    const statusCategory = ['New', 'In Progress', 'Dev Completed', 'Deployed', 'Ready for QA', 'QA Approved'];
    const priorityCategory = ['P0 Critical', 'P1 High', 'P2 Medium', 'P3 Low'];

    useEffect(() => {
        if (tasks.length > 0) {
            const calculatedStatusCount = statusCategory.map(status =>
                tasks.filter(task => task.status === status).length
            );
            const calculatedPriorityCount = priorityCategory.map(priority =>
                tasks.filter(task => task.priority === priority).length
            );
            setStatusCount(calculatedStatusCount);
            setPriorityCount(calculatedPriorityCount);
        }
    }, [tasks]);
    console.log(employeeStatusCount)
    const employeeTasksList = (assigneName)=>{
        if(tasks.length > 0){
            const filteredTasks = tasks.filter((item) => item.assignee.name === assigneName)
            setEmployeeTasks(filteredTasks)
            const calculateStatusCount = statusCategory.map(status=>
                filteredTasks.filter(item=>item.status == status).length
            )
            setEmployeeStatusCount(calculateStatusCount)
        }
    }
    useEffect(()=>{
        employeeTasksList(assigneName)
    },[tasks])

    useEffect(()=>{
        employeeTasksList(assigneName)
    },[assigneName])

    const statusOptions = {
        chart: { type: 'bar' },
        title: { text: 'Tasks by Status' },
        xaxis: { categories: statusCategory },
        plotOptions: { bar: { distributed: true, horizontal: false } },
        colors: ['rgb(183, 183, 183)', 'rgb(51, 178, 255)', 'rgb(112, 173, 71)', 'rgb(54, 194, 196)', 'rgb(81, 187, 82)', 'rgb(255, 217, 102)'],
    };

    const employeeStatusOptions = {
        chart: { type: 'bar' },
        title: { text: 'Tasks by Status Of Employee' },
        xaxis: { categories: statusCategory },
        plotOptions: { bar: { distributed: true, horizontal: false } },
        colors: ['rgb(183, 183, 183)', 'rgb(51, 178, 255)', 'rgb(112, 173, 71)', 'rgb(54, 194, 196)', 'rgb(81, 187, 82)', 'rgb(255, 217, 102)'],
    };
    const priorityOptions = {
        chart: { type: 'donut' },
        labels: priorityCategory,
        title: { text: 'Tasks by Priority' },
        colors: ['rgb(254, 2, 4)', 'rgb(254, 126, 2)', 'rgb(0, 191, 255)', 'rgb(123, 123, 123)'],
    };
   

    return (
        <div className="p-3" style={{height:'90%',overflowY:'scroll'}}>
        <div style={{ display: 'flex', justifyContent: 'space-around',flexWrap:'wrap' }}>
            <div style={{ width: '45%' }}>
                {statusCount.length > 0 && (
                    <Chart options={statusOptions} series={[{ data: statusCount }]} type="bar" height={350} />
                )}
            </div>
            <div style={{ width: '45%' }}>
                {priorityCount.length > 0 && (
                    <Chart options={priorityOptions} series={priorityCount} type="donut" height={350} />
                )}
            </div>
        </div>
        <div>
           <div className='flex flex-row items-center my-3 mx-2'> <span className="font-bold">Filter By Employee : &nbsp; &nbsp; &nbsp;</span><select value={assigneName} name="assigneName" className='form-control w-25 mr-2' onChange={(e)=>{setAssigneName(e.target.value);employeeTasksList(e.target.value)}}>
                    <option value="" disabled>Select User</option>
                    {projectMember && projectMember.length>0 && projectMember.map((item) => (
                        <option key={item._id} value={item.name}>{item.name}</option>
                    ))
                    }
            </select>
            </div>
            <div>
                {employeeStatusCount.length > 0 && (
                    <Chart options={employeeStatusOptions} series={[{ data: employeeStatusCount }]} type="bar" height={350} />
                )}
            </div>
        </div>
        </div>
    );
}
