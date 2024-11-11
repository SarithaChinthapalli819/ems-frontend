import React, { useEffect, useState } from 'react';

export default function AddEditTeams({ setTeamModel, addTeam, currentTeam, setCurrentTeam,editTeam }) {
    const [team, setteam] = useState()
    const changeHandler = (e) => {
        setteam(e.target.value)
    }
    const submitHandler = (e) => {
        e.preventDefault();
        if (currentTeam != null) {editTeam(team)}
        else {addTeam(team)}
    }
    useEffect(() => {
        if (currentTeam != null) setteam(currentTeam.name)
    }, [currentTeam])
    return (
        <div className='notemodal-backdrop'>
            <div className="notemodal-content" >
                <form>
                    {currentTeam ? <h4>Update Team</h4> : <h4>Add Team</h4>}
                    <label className='form-label'>Name:</label>
                    <input className='form-control' value={team} onChange={(e) => changeHandler(e)} />
                    {currentTeam ? <button className='btn btn-primary mt-2' onClick={(e) => submitHandler(e)}>Update Team</button> : <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2' onClick={(e) => submitHandler(e)}>Add Team</button>}<br />
                    <button className='btn mt-2'  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={() => { setCurrentTeam(null); setTeamModel(false) }}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
