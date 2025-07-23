import React, { useState, useRef, useEffect } from 'react';
import TaskTable from './components/TaskTable'
import TaskForm from './components/TaskForm'
import TaskHistory from './components/TaskHistory'
import { useRecoilState } from 'recoil';
import { selectedPlant } from 'recoilStore/atoms'; 
import { useLocation } from "react-router-dom";

function Tasks(props) {
    const [section, setSection] = useState('table');
    const [headPlant] = useRecoilState(selectedPlant)
    const historyRef = useRef();
    const formRef = useRef(); 

    const location = useLocation();
    let appUrl = window.location.href;

    useEffect(() => {
        if (!appUrl.includes("form")) {
        setSection('table');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        if (location.state && location.state.description && location.state.obdate) changeSection('create', { title: location.state.title, desc: location.state.description, date: location.state.obdate, additional: location.state.additional })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state])

    const changeSection = (sect, value) => {
        setSection(sect);
        if (value) {
            setTimeout(() => {
                if (sect === 'edit') {
                    formRef.current.bindValue(value)
                } else if (sect === 'create') {
                    formRef.current.createTask(value)
                } else {
                    historyRef.current.historyList(value.id, value.task_id)
                }
            }, [500])
        }

    }
    

    useEffect(() => { 
        if (appUrl.includes("form")) {
            let dataFromAlarm = localStorage.getItem("createTaskFromAlarm")
            if (dataFromAlarm !== "") {
                let data = JSON.parse(dataFromAlarm) 
                changeSection('create', { title: data.state.title, desc: data.state.description, date: data.state.obdate, additional: "" })

            }
        } 
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderTaskPage =()=>{
        if(section === 'table'){
            return(
                <TaskTable changeSec={changeSection} />

            )
        }else{
            if(section === 'history'){
           return     <TaskHistory changeSec={changeSection} ref={historyRef} />
            }else{
           return  <TaskForm ref={formRef} changeSec={changeSection} section={section} />
            }
        }
    }
    return (
        <div className="py-4">
            {renderTaskPage()}
             </div>
    )
}
export default Tasks