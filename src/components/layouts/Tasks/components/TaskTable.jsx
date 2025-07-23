import React, { useState, useEffect, useRef } from 'react';
import EnhancedTable from "components/Table/Table";
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { selectedPlant,tasktablesearch,TaskTableCustomization,TaskColumnFilter,TaskHeadCells } from "recoilStore/atoms";
import moment from 'moment'; 
import useTaskList from '../hooks/useTaskList';
import TaskBulkUploadTemplate from './TaskBulkDownloadTemplate';
import TaskFileUploadModel from './taskFileUploadModel';
import DeleteConfirmDialogue from './DeleteConfirmDialogue';
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import Grid from 'components/Core/GridNDL'


function TaskTable(props) {
    const [headPlant] = useRecoilState(selectedPlant);
    const [tableData, setTableData] = useState([]);
    const [disableDelete, setDisableDelete] = useState([]);
    const { TaskListLoading, TaskListData, TaskListError, getTaskList } = useTaskList()
    const [search, setTaskSearch] = useRecoilState(tasktablesearch);
    const [headCells, setheadCells] = useRecoilState(TaskHeadCells)
    const [taskTableCustomization,settaskTableCustomization] = useRecoilState(TaskTableCustomization)
    const [selectedcolnames, setselectedcolnames] = useRecoilState(TaskColumnFilter)
    
    const { t } = useTranslation();
    const dialogRef = useRef();
    const fileUploadRef = useRef();
    const deleteDialogRef = useRef();
    const tableheadCells = [
        {
            id: 'TASK ID',
            numeric: false,
            disablePadding: false,
            label: t('TaskID'),
             
        },

        {
            id: 'TITLE',
            numeric: false,
            disablePadding: false,
            label: t('Title'),

        },
        {
            id: 'TYPE',
            numeric: false,
            disablePadding: false,
            label: t('Type'),
            
        },
        {
            id: 'PRIORITY',
            numeric: false,
            disablePadding: false,
            label: t('priority'),
            
        },
        {
            id: 'ENTITY',
            numeric: false,
            disablePadding: false,
            label: t('Entity'),
            display: "none"
            
        },
        {
            id: 'INSTRUMENT',
            numeric: false,
            disablePadding: false,
            label: t('Instrument'),
            display: "none"

        },
        {
            id: 'INSTRUMENT TYPE',
            numeric: false,
            disablePadding: false,
            label: t('Instrument Type'),
            display: "none"

        },
        {
            id: 'FAULT MODE',
            numeric: false,
            disablePadding: false,
            label: t('FaultMode'),
            
            
        },
        {
            id: 'STATUS',
            numeric: false,
            disablePadding: false,
            label: t('status'),
            
            
        },
        {
            id: 'ASSIGNEE',
            numeric: false,
            disablePadding: false,
            label: t('assignee'),
            
            

        },
        {
            id: 'DUEDATE',
            numeric: false,
            disablePadding: false,
            label: t('dueDate'),
            display: "none",
            

        },

        {
            id: 'REPORTED DATE',
            numeric: false,
            disablePadding: false,
            label: t("Reported Date")
            
            
        },
        {
            id: 'REPORTED BY',
            numeric: false,
            disablePadding: false,
            label: t("ReportedBy"),
            display: "none"

        },
        {
            id: 'ACTION RECOMMENDED',
            numeric: false,
            disablePadding: false,
            label: t("ActionRecommended"),
            display: "none"

        },

        {
            id: 'DESCRIPTION',
            numeric: false,
            disablePadding: false,
            label: t('description'),
            display: "none"

        },
        {
            id: 'ACTION TAKEN',
            numeric: false,
            disablePadding: false,
            label: t('ActionTaken'),
            display: "none"

        },
        {
            id: 'OBSERVED DATE',
            numeric: false,
            disablePadding: false,
            label: t('Observed Date'),
            display: "none"

        },
        {
            id: 'INSTRUMENT STATUS',
            numeric: false,
            disablePadding: false,
            label: t('InstrumentStatus'),
            display: "none"

        },
        {
            id: 'CREATED BY',
            numeric: false,
            disablePadding: false,
            label: t('CreatedBy'),
            display: "none",
            hide:true
          

        },
        {
            id: 'CREATED TIME STAMP',
            numeric: false,
            disablePadding: false,
            label: t('CreatedTimestamp'),
            display: "none",
            hide:true 

        },
        {
            id: 'TASK ATTACHMENTS',
            numeric: false,
            disablePadding: false,
            label: t('TaskAttachments'),
            display: "none",
            hide:true

        }
    ];



    useEffect(() => {
        if(headCells.length === 0){
        setheadCells(tableheadCells)
        setselectedcolnames(tableheadCells.filter(val => !val.hide && val.display !== "none"))
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headCells])
    
    useEffect(() => {
        getTaskList(headPlant.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])
    useEffect(() => {
        if (!TaskListLoading && !TaskListError && TaskListData) {
            processedrows(TaskListData)
        }else{
            processedrows([])

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TaskListData,headPlant])

    const processedrows = (TaskListData) => {
        let temptabledata = []
        let notDelete = [];
        if (TaskListData.length > 0) {
            temptabledata = temptabledata.concat(TaskListData.map((val, index) => {
                if (val) {
                    if (val.taskStatus.id === 3) {
                        notDelete.push(index);
                    }
                   

                return [ val.task_id, val.title, val.taskType.task_type, val.taskPriority.task_level,
                val.entityId && val.entityId.name ? val.entityId.name : "", val.instrument && val.instrument.name ? val.instrument.name : "",
                val.instrument && val.instrument.instrumentTypeByInstrumentType.name ? val.instrument.instrumentTypeByInstrumentType.name : "",
                val.faultModeByFaultMode && val.faultModeByFaultMode.name ? val.faultModeByFaultMode.name : "", val.taskStatus.status, val.userByAssignedFor && val.userByAssignedFor.name ? val.userByAssignedFor.name : "",
                val.due_date ? moment(val.due_date).format('DD/MM/YYYY') : "", val.created_ts
                ? moment(val.created_ts).format('DD/MM/YYYY') : "", val.userByReportedBy? val.userByReportedBy.name : "", val.action_recommended ? val.action_recommended : "", val.description,val.task_feedback_action ? val.task_feedback_action.feedback_action : "--", val.observed_date ? moment(val.observed_date).format('DD/MM/YYYY') : "", val.instrument_status_type && val.instrument_status_type.status_type ? val.instrument_status_type.status_type : "" ]
                }
                else return []
            })
            )
        }
        setTableData(temptabledata)
        setDisableDelete(notDelete)
    }
    const AddTask = () => { props.changeSec('create') };
    const EditTask = (id, value) => { props.changeSec('edit', value) };
    const DeleteTask = (value) => {
        deleteDialogRef.current.openDialog(value)
    }
    const showHistory = (id, value) => {  props.changeSec('history', value) }
    const openTemplateDialog = () => {
        dialogRef.current.openDialog(true);
    }
    const bulkFileUpload = () => {
        fileUploadRef.current.openDialog()
    }
    const handleColChange = (e) => {
        if(e){
            const value = e.map(x => x.id); 
            let newCell = []
            // eslint-disable-next-line array-callback-return
            tableheadCells.forEach(p => {
                let index = value.findIndex(v => p.id === v); 
                if (index >= 0) {
                  newCell.push({ ...p, display:'block' });
                } else {
                  newCell.push({ ...p, display: 'none' });
                }
              });
              
            setheadCells(newCell)
            setselectedcolnames(e);
            
        } 
       
    }
const PageChange=(p,r,atoms)=>{
    settaskTableCustomization(atoms)
}
    return (
        <React.Fragment>
            <TaskBulkUploadTemplate ref={dialogRef} />
            <TaskFileUploadModel getTaskList={() => getTaskList(headPlant.id)} ref={fileUploadRef} />
            <DeleteConfirmDialogue ref={deleteDialogRef} getTaskList={() => getTaskList(headPlant.id)} />
            <Grid container >
                        <Grid item xs={12} sm={12} >
                            <div className ={"float-right w-[200px] mx-4"}>
                                <SelectBox
                                    labelId="filter-column-task"
                                    id="filter"
                                    placeholder={t("Select column")}
                                    disabledName={t("FilterColumn")}
                                    options={tableheadCells.filter(c => !c.hide)}
                                    keyValue={"label"}
                                    keyId={"id"}
                                    value={selectedcolnames}
                                    multiple={true}
                                    onChange={(e) => handleColChange(e)}
                                    selectAll={true}
                                    selectAllText={"Select All"}
                                   
                                />
                                </div>

            <EnhancedTable
                downloadHeadCells ={tableheadCells}
                headCells={headCells}
                data={tableData}
                buttonpresent={t("newTask")}
                download={true}
                search={true}
                SearchValue={search}
                onSearchChange={(e=> setTaskSearch(e))}
                onClickbutton={AddTask}
                actionenabled={true}
                rawdata={TaskListData}
                handleEdit={(id, value) => EditTask(id, value)}
                handleDelete={(id, value) => DeleteTask(value)}
                enableDelete={true}
                enableEdit={true}
                fileUpload={bulkFileUpload}
                fileDownload={openTemplateDialog}
                enableHistory={(id, value) => showHistory(id, value)}
                disableddelete={disableDelete}
                ellipsis = {true}
                rowPerPageSustain={true} 
                TableSustainValue={taskTableCustomization}
                rowsPerPage={taskTableCustomization.rowperpage}
                onPageChange={PageChange}
                page={taskTableCustomization.page}
                order={taskTableCustomization.order}
                orderBy={taskTableCustomization.orderby}
                

            />
            </Grid>
                    </Grid>
        </React.Fragment>
    )
}
export default TaskTable;