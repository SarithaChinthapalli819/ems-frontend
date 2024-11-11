import React from 'react';

export default function DeleteModel({setIsDelete}) {
  return (
    <div className='notemodal-backdrop'>
      <div className="notemodal-content" style={{width:"300px"}}>
        <h4>Are You Sure To Delete?</h4>
        <div className='text-center mt-4'>
            <button className='btn btn-success mr-2' onClick={()=>setIsDelete(true)}>Yes</button>
            <button className='btn'  style={{backgroundColor:'#e74c3c',color:'white'}} onClick={()=>setIsDelete(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
