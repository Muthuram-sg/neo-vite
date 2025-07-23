import React, { forwardRef, useRef } from 'react';
import 'reactflow/dist/style.css';
import { useNavigate } from 'react-router-dom'; 

import ScadaHeader from './Headers/ScadaHeader';

//import ScadaDashboardres from './Content/Scadadashboardresponsive';
import ScadaDash from './Content/ScadaDash';

const Scada = forwardRef((props,ref)=>{
  const mainContentref = useRef();
  const saveRef = useRef()

  const handleSave = ()=>{
    saveRef.current.Save();

  }
  


  return (
    <>
      <ScadaHeader ref={saveRef} refresh={() => mainContentref.current.Refresh()} getScadaViewList={(h,u)=>mainContentref.current.getScadaViewList(h,u)}/>
    
      <ScadaDash ref={mainContentref} handleSave={()=>handleSave()} DeleteDialog={(e)=>saveRef.current.openDialog(e)}/>
   
    
    </>
  );
});

export default Scada;