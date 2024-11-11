import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddEditTeams from './AddEditTeams';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import DeleteModel from './DeleteModel'
import AddMember from './AddMember';
import { toast } from 'react-toastify';
export default function Teams() {
  const [teamModel, setTeamModel] = useState(false)
  const [teams, setTeams] = useState([])
  const [filteredTeams, setFilteredTeams] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [currentTeam, setCurrentTeam] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteModelOpen, setDeleteModel] = useState(false)
  const [OpenAddMember, setAddMember] = useState(false)
  const [teamId, setTeamId] = useState()
  const [isActive, setIsActiveValue] = useState(1)

  const teamsChange = async () => {
    const response = await axios.get(`https://ems-frontend-air2.vercel.app/api/teams/${isActive}`)
    if (response.data.success) {
      console.log(response.data.teams)
      const teamdetails = response.data.teams.map((item) => ({
        id: item._id,
        name: item.name,
        updatedAt: item.updatedAt,
        team: item.user ? item.user.length : 0
      }))
      setTeams(teamdetails)
    }
  }

  const filtering = (value) => {
    setSearchValue(value)
    const filteredteams = teams.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredTeams(filteredteams)
  }
  useEffect(() => {
    teamsChange()
  }, []);

  useEffect(()=>{
    teamsChange()
  },[isActive])
  useEffect(() => {
    filtering(searchValue)
  }, [teams]);

  const onAddClick = () => {
    setTeamModel(true)
  }
  const onEditClick = (team) => {
    console.log(team)
    setCurrentTeam(team)
    setTeamModel(true)
  }
  const addTeam = async (teamname) => {
    const response = await axios.post('https://ems-frontend-air2.vercel.app/api/teams/addteam', { teamname })

    if (response.data.success) {
      setTeamModel(false)
      teamsChange()
    }
  }
  const editTeam = async (teamname) => {
    const response = await axios.put(`https://ems-frontend-air2.vercel.app/api/teams/editteam/${currentTeam.id}`, { teamname })
    if (response.data.success) {
      setTeamModel(false)
      setCurrentTeam(null)
      teamsChange()
    }
  }

  const onDeleteClick = async (id) => {
    console.log(id)
    setDeleteId(id)
    setDeleteModel(true);
  }
  const setIsDelete = async (value) => {
    console.log(value)
    if (value) {
      const response = await axios.delete(`https://ems-frontend-air2.vercel.app/api/teams/deleteteam/${deleteId}`)
      if (response.data.success) {
        teamsChange()
        setDeleteModel(false);
      }

    }
    else {
      setDeleteModel(false);
    }
  }

  const closeMemberPopup = () => {
    setAddMember(false)
    teamsChange()
  }
  const columns = [
    {
      name: 'Team Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Team Length',
      selector: (row) => row.team,
      sortable: true,
    },
    {
      name: 'Updated Time',
      selector: (row) => new Date(row.updatedAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button className="btn mr-2" style={{backgroundColor:'#f39c12',color:'white'}} onClick={() => { onEditClick(row) }}>Edit</button>
          <button className="btn mr-2"  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={() => { onDeleteClick(row.id) }}>Delete</button>
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded" onClick={() => { setTeamId(row.id); setAddMember(true) }}>Add Member</button>
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
      {OpenAddMember && <AddMember closeMemberPopup={closeMemberPopup} teamId={teamId} />}
      {deleteModelOpen && <DeleteModel setIsDelete={setIsDelete} />}
      {teamModel && <AddEditTeams setTeamModel={setTeamModel} addTeam={addTeam} currentTeam={currentTeam} setCurrentTeam={setCurrentTeam} editTeam={editTeam} />}
      <div className='row items-center justify-between m-3'>
        <div className='d-flex align-items-center w-50 justify-content-between'>
          <input placeholder='Search by user name,email' className='form-control w-50' value={searchValue} onChange={(e) => filtering(e.target.value)} />
          <select className='form-control w-25' value={isActive} onChange={(e) => { setIsActiveValue(e.target.value) }}>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded float-end add-team-btn' style={{ width: '150px' }} onClick={() => onAddClick()}> + Add Teams</button>
      </div>
      {filteredTeams && filteredTeams.length > 0 ?
        <DataTable
          columns={columns}
          data={filteredTeams}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 20]}
          customStyles={customStyles}
          striped
        />
        : 'No Teams Found'}
    </div>
  );
}
