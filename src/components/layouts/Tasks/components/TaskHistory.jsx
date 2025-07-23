import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import useTaskHistory from '../hooks/useTaskHistory'
import History from 'assets/neo_icons/Menu/History.svg?react';
import TaskCreated from 'assets/neo_icons/Menu/TaskCreated.svg?react';
import Tag from 'assets/neo_icons/Menu/Tag.svg?react';
import ActionRecommended from 'assets/neo_icons/Menu/ActionRecommended.svg?react';
import ActionTaken from 'assets/neo_icons/Menu/ActionTaken.svg?react'; 
import TypographyNDL from 'components/Core/Typography/TypographyNDL';

const TaskHistory = forwardRef((props, ref) => {  
    const [taskHistory, setTaskHistory] = useState([]) 
    const { TaskHistoryLoading, TaskHistoryData, TaskHistoryError, getTaskHistory } = useTaskHistory();

    useImperativeHandle(ref, () => ({
        historyList: (id, task) => fetchHistory(id, task)
    }))
    useEffect(() => {
        if (!TaskHistoryLoading && !TaskHistoryError && TaskHistoryData && TaskHistoryData.length > 0) {
            setTaskHistory(TaskHistoryData)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TaskHistoryData])
    const icons = {
        "action taken": <ActionTaken stroke="#007BFF" />, "priority": <Tag stroke="#007BFF" />, "action recommended": <ActionRecommended stroke="#007BFF" />,
        "task created": <TaskCreated stroke="#007BFF" />
    }
    const fetchHistory = (id, task) => {
        getTaskHistory(id) 
    } 
   
    return (
        <div style={{height : "100vh"}}> 
            
            <div style={{marginTop : 10,paddingLeft:"20px"}}>
            {
                taskHistory && taskHistory.length > 0 ? (
                    taskHistory.map((val,index) => {
                        console.log(val.action,"val.action")
                        if (val.action === 'task created'){
                            val.action = 'Created this task'
                            val.value =''
                        }
                        if (val.action === 'priority'){
                            val.action = 'Changes Priority to'
                        }
                        if (val.action === 'assingee'){
                            val.action = 'Assigned this task to'
                        }
                        if (val.value === 'Completed'){
                            val.action = 'Closed this task as'
                        }
                        const isAlreadyFormatted = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s\d{4}\b/.test(val.action_time);

                        if (!isAlreadyFormatted && typeof val.action_time === 'string') {
                        const datePart = val.action_time.split(' - ')[1];
                        const [day, month, year] = datePart.split('/');

                        const formattedDate = new Date(`${month}/${day}/${year}`);

                        val.action_time = formattedDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        });
                        }
                        return (
                            <ol key={index+1} style={{height:"60px"}} class="relative text-secondary-text border-l border-gray-200 top-5 flex dark:border-gray-700 dark:text-gray-400">
                                <li class="pb-5 pl-5  flex items-center">
                                    <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 dark:bg-blue-200 rounded-full -left-4 ">
                                        {icons[val.action] ? icons[val.action] : <History stroke={"#007BFF"} />}
                                    </span>
                                   
                                    <div class="font-medium leading-tight ml-1 font-geist-sans">
                                        <TypographyNDL value={val.user + " " + val.action} variant='label-01-s'   />
                                        
                                        {val.action.includes('Priority') ? (
                                            val.value && 
                                        <div class={`font-medium font-geist-sans leading-tight ml-1 inline-flex items-center justify-center gap-4 px-3 py-2 rounded-full text-primary-bg ${val.value.toLowerCase() === 'low' ? 'bg-[#FFC300]' : val.value.toLowerCase() === 'medium' ? 'bg-[#FF5733]' : val.value.toLowerCase() === 'high' ? 'bg-danger-tertiary-bg' : ''} text-[16px] font-normal leading-[22px]`}>{val.value}</div>
                                        ) : (
                                            val.value && 
                                        <span class={`font-medium font-geist-sans ml-1 ${val.action.includes('Assigned') ? 'text-primary-text' : 'text-secondary-text'} text-[16px] font-normal leading-[22px]`}>
                                        {val.value }
                                        </span>
                                        )}
                                        <TypographyNDL value={val.action_time} style={{paddingTop:"4px"}} variant='paragraph-xs' mono color='tertiary'   />

                                         
                                    </div>

                                  
                                </li>

                            </ol>
                        )

                    })
                ) : "Loading...."
            }
            </div>
        </div>


       


    )

})
export default TaskHistory;
