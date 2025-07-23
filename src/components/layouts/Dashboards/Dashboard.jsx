import React,{forwardRef,useRef,useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom'
import DashboardContent from './Content/DashboardContent';
import DashboardHeader from './Headers/DashboardHeader';
import { currentPage,snackToggle,snackMessage,snackType } from "recoilStore/atoms";


import { useRecoilState } from "recoil";
const Dashboard = forwardRef((props,ref)=>{
    const mainContentref = useRef();
    const [, setCurPage] = useRecoilState(currentPage);
    const [modalOpen,setModalOpen] = useState(false)
    const [selectedOfflineType, setSelectedOfflineType] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [, setOpenSnack] = useRecoilState(snackToggle);
        const [, SetMessage] = useRecoilState(snackMessage);
        const [, SetType] = useRecoilState(snackType);
    let asset = queryParams.get('asset');
    
  
    useEffect(() => {
      console.log(asset,"asset parent")
        setCurPage("dashboard");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      const handleModal = (val) => {
        setModalOpen(val)
      }

      const handleSnackbar = (message, type) => {
        SetMessage(message);
        SetType(type);
        setOpenSnack(true)
    }

    const handleTriggerDashboard =()=>{
      mainContentref.current.getUpdatedDashBoard()
    }

    return(
        // Dashboard Header component
        <React.Fragment>
            <DashboardHeader getSelectedOfflineType={(val)=>setSelectedOfflineType(val)} refresh={()=>mainContentref.current.Refresh() } getUpdatedDashBoard={()=>mainContentref.current.getUpdatedDashBoard()} handleSnackbar={handleSnackbar} handleModal={handleModal} handleTriggerDashboard={handleTriggerDashboard} />
            <DashboardContent ref={mainContentref} selectedOfflineType={selectedOfflineType} handleSnackbar={handleSnackbar} modalOpen={modalOpen}/>
        </React.Fragment>
    )
})
export default Dashboard;