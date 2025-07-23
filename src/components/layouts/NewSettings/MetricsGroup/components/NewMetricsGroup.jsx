import React, { useEffect, useState, useRef } from "react";
import Grid from 'components/Core/GridNDL'
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import useTheme from "TailwindTheme";
import { useRecoilState } from "recoil";
import Checkboxs from 'components/Core/CustomSwitch/CustomSwitchNDL'
import useInstrumentList from 'Hooks/useInstrumentList';
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";
import useAddGroupMetric from "components/layouts/NewSettings/MetricsGroup/hooks/useAddGroupMetric.jsx"
import useDeleteGroupMetric from "components/layouts/NewSettings/MetricsGroup/hooks/useDeleteGroupMetric.jsx"
import useEditGroupMetric from "components/layouts/NewSettings/MetricsGroup/hooks/useEditGroupMetric.jsx"
import { snackToggle, snackMessage, snackType, user, selectedPlant } from "recoilStore/atoms";
import useGetGroupMetric from "components/layouts/NewSettings/MetricsGroup/hooks/useGetGroupMetric.jsx"
    // eslint-disable-next-line react-hooks/exhaustive-deps
export default function NewMetricsGroup(props) {
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const [InstrumentList, setInstrumentList] = useState([]);
    const useThemes = useTheme();
    const [pairs, setPairs] = useState([{ instrument: null,instrument_name: '', metrics: [] }]);
    const [finalJson, setFinalJson] = useState([]);
    const [ checked, setchecked ]= useState(false);
    const [accessType, setAccessType] = useState(1);
    const [access, setAccess] = useState('public');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedUsers, setselectedUsers]= useState([]);  
    const [userOptions, setUserOptions] = useState([]); 
    const [totalMetricsCount, settotalMetricsCount] = useState([]); 
    const [savebuttonDisabled, setSaveButtonDisabled] = useState(false);
    const [checkboxDisabled, setCheckboxDisabled] = useState(false);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [groupName, setGroupName] = useState('');
    const [upperLimit, setUpperLimit] = useState(0);
    const [lowerLimit, setLowerLimit] = useState(0);
    const [currUser] = useRecoilState(user);
    const [editId, seteditId] = useState('')
    const [owner, setowner]= useState(true)
    const {GroupMetricLoading, GroupMetricData, GroupMetricError, getGroupMetrics} = useGetGroupMetric();
    const { instrumentListLoading, instrumentListData, instrumentListError, instrumentList } = useInstrumentList();
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
    const { CreateMetricsGroupLoading,  CreateMetricsGroupData , CreateMetricsGroupError,getCreateMetricsGroup }= useAddGroupMetric();
    const { DeleteGroupMetricLoading, DeleteGroupMetricData, DeleteGroupMetricError, getDeleteGroupMetric } = useDeleteGroupMetric()
    const { UpdateMetricsGroupLoading,  UpdateMetricsGroupData , UpdateMetricsGroupError,getUpdateMetricsGroup } = useEditGroupMetric ()

    const handleAddNewPair = () => {
        setPairs(prevPairs => [...prevPairs, { instrument: null,instrument_name:'', metric: null }]);
    };

    const removeIns = (index) => {
        setPairs((prevPairs) => prevPairs.filter((_, i) => i !== index));
    };       

    const handleAccessChange = (option) => {
        setAccessType(option.target.value)
        if(option.target.value === 1){
            setAccess("public"); 
        } else   if(option.target.value === 2){
            setAccess("private"); 
        } else   if(option.target.value === 3){
            setAccess("shared"); 
        }
    };    

    const handleDialogClosefn = () => {
        props.handleDialogClose();
    }

    const handleShareWithChange = (option) => {
        setselectedUsers(option)
    }

    useEffect(() => {
        instrumentList(props.headPlant.id);
        getUsersListForLine(props.headPlant.id);
    }, [props.headPlant])

    useEffect(() => {
        if (!instrumentListLoading && instrumentListData && !instrumentListError) {
            setInstrumentList(instrumentListData); 
        }
    }, [instrumentListLoading, instrumentListData, instrumentListError]);

    const handleInstrumentChange = (index, selectedInstrument) => {
        const instrument = InstrumentList.find(inst => inst.id === selectedInstrument.target.value) || {};
        const instrumentName = instrument.name || "Unknown Name";
        const updatedPairs = [...pairs];
        updatedPairs[index].instrument = selectedInstrument.target.value;
        updatedPairs[index].instrument_name = instrumentName
        updatedPairs[index].metrics = []; 
        setPairs(updatedPairs);
    }; 
    
    const handleMetricChange = (index, selectedMetrics) => {
        
        const updatedPairs = [...pairs];
        
        updatedPairs[index].metrics = selectedMetrics.map(option => ({
            id: option.id,
            name: option.name,
            key: option.key
        }));
        setPairs(updatedPairs);
    };

    useEffect(() => {
        getGroupMetrics(headPlant.id)
    }, [headPlant])

    useEffect(() => {
        if (!GroupMetricLoading && GroupMetricData && !GroupMetricError) {
    
            const groupExists = GroupMetricData.some(item => item.grpname === groupName);
    
            if (groupExists && props.dialogMode !== "edit") {
                setSaveButtonDisabled(true)
                SetMessage('Group name already exists');
                SetType("info");
                setOpenSnack(true);
            } else {
                setSaveButtonDisabled(false)
            }
        }
    }, [GroupMetricLoading, GroupMetricData, GroupMetricError, groupName]);   

    const getMetricsOptions = (instrumentId) => {
        const instrument = InstrumentList.find(inst => inst.id === instrumentId);
        return instrument ? instrument.instruments_metrics.map(m => ({
            id: m.metric.id,
            name: m.metric.title,
            key: m.metric.name
        })) : [];
    };

    useEffect(() => {
        const updatedJson = pairs.map((pair) => ({
            instrument: {
                id: pair.instrument,
                name: pair.instrument_name
            },
            metrics: (pair.metrics || []).map(metric => ({
                id: metric.id,
                name: metric.name,
                key: metric.key
            }))
        }));
        setFinalJson(updatedJson);
    
        const totalMetricsCount = updatedJson.reduce((acc, pair) => acc + pair.metrics.length, 0);
        settotalMetricsCount(totalMetricsCount);
        setButtonDisabled(totalMetricsCount >= 10);
        const allMetricsIdentical = updatedJson.length > 1 && updatedJson.every(
            pair => JSON.stringify(pair.metrics) === JSON.stringify(updatedJson[0].metrics)
        );
        
        setCheckboxDisabled(!allMetricsIdentical);
        if (!checked && !allMetricsIdentical) {
            setchecked(false);
            setUpperLimit(0)
            setLowerLimit(0)
        }        
    }, [pairs]);    

    useEffect(()=>{
        if(totalMetricsCount >= 11){
            setSaveButtonDisabled(totalMetricsCount >= 11)
        SetMessage('Total metrics should be upto 10')
        SetType("warning")
        setOpenSnack(true)
    } else {
        setSaveButtonDisabled(false)
    }
    },[totalMetricsCount])

    useEffect(() => {
        if (!UsersListForLineLoading && UsersListForLineData && !UsersListForLineError) {
    
            const transformedData = UsersListForLineData.map(user => ({
                id: user.userByUserId.id,                 
                name: user.userByUserId.name,  
            }));
    
            setUserOptions(transformedData); 
        }
    }, [UsersListForLineLoading, UsersListForLineData, UsersListForLineError]);

    const handleGroupNameChange = (event) => {
        setGroupName(event.target.value);
    }  

    const handleUpperLimit = (event) => {
        setUpperLimit(event.target.value);
    }  

    const handleLowerLimit = (event) => {
        setLowerLimit(event.target.value);
    }  
    
    const DeleteGroupMetric = () => {
        getDeleteGroupMetric(editId)
    }

    const onClickHandler = () => { 
        
        let message = "Please fill in the following required fields: ";
        let isFieldMissing = false;
        
        if (groupName.length === 0) {
            message += "Group Name, ";
            isFieldMissing = true;
        }
        
        if (
            Array.isArray(pairs) &&
            pairs.length > 0 &&
            pairs.some(pair => pair.instrument === '' || pair.instrument === null)
        ) {
            message += "Instrument, ";
            isFieldMissing = true;
        }
        
        if (
            Array.isArray(pairs) &&
            pairs.length > 0 &&
            pairs.some(pair => 
                Array.isArray(pair.metrics) &&
                (pair.metrics.length === 0 || pair.metrics.some(metric => metric.id === '' || metric.id === null))
            )
        ) {
            message += "Metric ID, ";
            isFieldMissing = true;
        }        
        
        if (checked === true && (upperLimit === 0 || lowerLimit === 0)) {
            message += "Upper/Lower Limit, ";
            isFieldMissing = true;
        }
        

        if (isFieldMissing) {
            message = message.slice(0, -2);
            SetMessage(message);  
            SetType("warning");
            setOpenSnack(true);
            return;
        }          
        
        if(isFieldMissing === false){
          
        const metricsObject = finalJson.reduce((acc, item) => {
            const instrumentId = item.instrument.id;
            
            const metrics = item.metrics.reduce((metricsAcc, metric) => {
                metricsAcc[metric.id] = {
                    name: metric.name,
                    key: metric.key
                };
                return metricsAcc;
            }, {});
            
            acc[instrumentId] = {
                id: instrumentId,
                metrics: metrics
            };
            
            return acc;
        }, {});
    
        const requestAddBody = {
            grpname: groupName,
            access: access,
            metrics: metricsObject,
            updated_by: currUser.id,
            created_by: currUser.id,
            updated_ts: new Date().toISOString(),
            shared_users: selectedUsers,
            group_limit: checked,
            upper_limit: upperLimit,
            lower_limit: lowerLimit,
            line_id: props.headPlant.id,
            ...(props.dialogMode === "edit" && { id: editId })
        };

        
        const requestEditBody = {
            grpname: groupName,
            access: access,
            metrics: metricsObject,
            updated_by: currUser.id,
            updated_ts: new Date().toISOString(),
            shared_users: selectedUsers,
            group_limit: checked,
            upper_limit: upperLimit,
            lower_limit: lowerLimit,
            line_id: props.headPlant.id,
            ...(props.dialogMode === "edit" && { id: editId })
        };
    
        if (props.dialogMode === "edit") {
            getUpdateMetricsGroup(requestEditBody);
        } else if (props.dialogMode === "create") { 
            getCreateMetricsGroup(requestAddBody);
        }
    }
    };
    
    useEffect(()=>{
        if (!CreateMetricsGroupLoading && CreateMetricsGroupData && !CreateMetricsGroupError) {
            SetMessage(`Your group ${CreateMetricsGroupData} created successfully`); 
            SetType("success");
            setOpenSnack(true);
            props.handleDialogClose();
            props.triggerTableData();
        }        
          if ((CreateMetricsGroupLoading && !CreateMetricsGroupData && CreateMetricsGroupError)) {
            SetMessage(t("Error occured"))
            SetType("error")
            setOpenSnack(true)
          }
    },[CreateMetricsGroupLoading,  CreateMetricsGroupData , CreateMetricsGroupError])

    useEffect(()=>{
        if(!UpdateMetricsGroupLoading && UpdateMetricsGroupData  && !UpdateMetricsGroupError){
            SetMessage(`Your group ${UpdateMetricsGroupData} updated successfully`); 
            SetType("info")
            setOpenSnack(true)
            props.handleDialogClose()
            props.triggerTableData()
        }
    },[UpdateMetricsGroupLoading,  UpdateMetricsGroupData , UpdateMetricsGroupError])

    useEffect(()=>{
        if(!DeleteGroupMetricLoading && DeleteGroupMetricData && !DeleteGroupMetricError){
            SetMessage(`Your group ${DeleteGroupMetricData} deleted successfully`); 
            SetType("error")
            setOpenSnack(true)
            props.handleDialogClose()
            props.triggerTableData()
        }
    },[DeleteGroupMetricLoading, DeleteGroupMetricData, DeleteGroupMetricError])

    useEffect(() => {
        if (props.dialogMode === "delete") {
            if(props.editValue.updated_by === currUser.id){
                setowner(true)
            } else {
                setowner(false)
            }
            seteditId(props.editValue.id);
        } else if (props.dialogMode === "edit") {
            if (props.editValue) {
                seteditId(props.editValue.id);
                setGroupName(props.editValue.grpname);
    
                if (props.editValue.access === "public") {
                    setAccessType(1);
                    setAccess("public")
                } else if (props.editValue.access === "private") {
                    setAccessType(2);
                    setAccess("private")
                } else if (props.editValue.access === "shared") {
                    setAccessType(3);
                    setAccess("shared")
                }
    
                setselectedUsers(props.editValue.shared_users);
                setchecked(props.editValue.group_limit);
                setUpperLimit(props.editValue.upper_limit);
                setLowerLimit(props.editValue.lower_limit);
    
                const updatedPairs = Object.keys(props.editValue.metrics).map(key => {
                    const metricEntries = props.editValue.metrics[key].metrics; 
                    const metricsArray = Object.keys(metricEntries).map(metricKey => ({
                        id: parseInt(metricKey, 10),
                        name: metricEntries[metricKey].name, 
                        key: metricEntries[metricKey].key, 
                    }));
    
                    return {
                        instrument: key,
                        metrics: metricsArray,
                    };
                });
                setPairs(updatedPairs);
            }
        }
    }, [props.dialogMode]);    

    let title;

    if (props.dialogMode === "delete" && owner === false){
        title = "Ownership";
    } else  if (props.dialogMode === "delete") {
        title = "Are you sure want to delete?";
    } else if (props.dialogMode === "edit") {
    title = "Edit Group Metric";
    } else {
    title = t("Add Group Metric");
    }

    return (
        <React.Fragment>
        <ModalHeaderNDL>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TypographyNDL variant="heading-02-xs" model value={title} />
               
            </div>
        </ModalHeaderNDL>
            <ModalContentNDL>
            {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                props.dialogMode === "delete" ? (
                    owner === false ? (
                    <React.Fragment>
                        <TypographyNDL variant="paragraph-xs" color="secondary" value="Only the owner of the group can delete the group" />
                    </React.Fragment>
                    ) : (
                    <React.Fragment>
                        <TypographyNDL variant="paragraph-s" color="secondary" value={`Do you really want to delete the group ${props.editValue.grpname}? This action cannot be undone.`} />
                    </React.Fragment>
                    )
                ) : 
                <React.Fragment>
                    <div className="pr-2">
                <Grid container spacing={3}>
                    <Grid item lg={12}>
                        <InputFieldNDL
                            id={"gateway-id"}
                            label={t("Group Name")}
                            placeholder={t("Group Name")}
                            size={"small"}
                            value={groupName}
                            onChange={handleGroupNameChange}
                            helperText={"This will appear in the hierarchy"}
                        />
                    </Grid>
                    <Grid item lg={12}>
                        <SelectBox
                            id={`access`}
                            label={"Access"}
                            edit={true}
                            auto={false}
                            value={accessType}
                            options={[
                                { id: 1, name: 'Public' },
                                { id: 2, name: 'Private' },
                                { id: 3, name: 'Shared' }
                            ]}
                            isMArray={false}
                            keyValue={"name"}
                            keyId={"id"}
                            onChange={(option) => handleAccessChange(option)}
                            info={accessType === 1 ? "This metric group is set to public, visible to everyone in the line. Keep your insights open and accessible to everyone." :accessType === 2  ?  'This metric group is set to public, visible to everyone in the line. Keep your insights open and accessible to everyone.' : 'This metric group is shared with selected users. Control who can view your insights and collaborate effectively with your team.'}

                        />

                        <div className="pt-1 pb-1">
                            
                            {accessType === 3 && (
                                <div className="pt-2 pb-2">
                                    <SelectBox
                                        id="shareWith"
                                        label={"Share with"}
                                        edit={true}
                                        auto={true}
                                        options={userOptions}
                                        isMArray={true}
                                        keyValue={"name"}
                                        keyId={"id"}
                                        multiple={true}
                                        value={selectedUsers}
                                        onChange={(option) => handleShareWithChange(option)}
                                        info={"Select users to give access."}
                                    />
                                </div>
                            )}
                        </div>
                    </Grid>
                    <Grid item lg={12}>
                        <div className="pairs-container">
                        {pairs.map((pair, index) => {
                        const selectedInstruments = pairs
                            .slice(0, index)
                            .map(p => p.instrument)
                            .filter(id => id);

                        const filteredInstrumentList = InstrumentList.filter(
                            instrument => !selectedInstruments.includes(instrument.id)
                        );

                        return (
                            <div 
                                key={index} 
                                className="pair-item" 
                                style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}
                            >
                                <div style={{"min-width": "280px"}}>
                                <SelectBox
                                    id={`instrument-select-${index}`}
                                    label={"Instrument"}
                                    edit={true}
                                    auto={true}
                                    options={filteredInstrumentList.map(instrument => ({
                                        id: instrument.id,
                                        name: instrument.name
                                    }))}
                                    isMArray={false}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    value={pair.instrument}
                                    onChange={(option) => handleInstrumentChange(index, option)}
                                    // style={{ width: '300px' }}
                                />
                                </div>
                                <div style={{"min-width": "280px"}}>
                                <SelectBox
                                    id={`metric-select-${index}`}
                                    label={"Metric"}
                                    edit={true}
                                    auto={true}
                                    options={getMetricsOptions(pair.instrument)}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    multiple={true}
                                    value={pair.metrics}
                                    onChange={(options) => handleMetricChange(index, options)}
                                    // style={{ width: '300px' }} 
                                />
                                </div>
                                {pairs.length > 1 && (
                                    <div className="pt-5">
                                        <Button
                                            type="ghost"
                                            danger
                                            icon={Delete}
                                            stroke={useThemes.colorPalette.genericRed}
                                            onClick={() => removeIns(index)}
                                            style={{ padding: '0', minWidth: '32px' }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    type="tertiary"
                                    value={t('Add new')}
                                    icon={Plus}
                                    onClick={() => handleAddNewPair()}
                                    style={{ marginTop: "10px" }}
                                    disabled={buttonDisabled}
                                />
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <div className="pt-5 pb-5">
                    <TypographyNDL
                        variant="paragraph-xs"
                        color="secondary"
                        value={t("Note: Add up to 10 metrics total, using either a mix of 10 instruments with 10 unique metrics or 1 instrument with 10 metrics.")}
                    />
                </div>
                <div className="pt-5 pb-5">
                    <Checkboxs 
                        disabled={checkboxDisabled} 
                        checked={checked}
                        primaryLabel="Set Group Limit"
                        description="Check this to set a common limit for the group. This limit won’t affect individual alarms."
                        onChange={(e) => (setchecked(!checked), setUpperLimit(0), setLowerLimit(0))}
                    />
                </div>
                {checked && (
                    <div className="pt-5 pb-5">
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <InputFieldNDL
                                id={"upper-limit"}
                                label={t("Upper Limit")}
                                placeholder={t("Upper Limit")}
                                size={"small"}
                                value={upperLimit}
                                onChange={handleUpperLimit}
                                style={{ flexGrow: 1, minWidth: '300px' }}
                            />
                            <InputFieldNDL
                                id={"lower-limit"}
                                label={t("Lower Limit")}
                                placeholder={t("Lower Limit")}
                                size={"small"}
                                value={lowerLimit}
                                onChange={handleLowerLimit}
                                style={{ flexGrow: 1, minWidth: '300px' }}
                            />
                        </div>
                    </div>
                )}
                </div>
            </React.Fragment>
            
                            }
            </ModalContentNDL>
            <ModalFooterNDL>
                
            {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                owner === true ? (
                    props.dialogMode === "delete" ? (
                    <React.Fragment>
                        <Button type="secondary" value={t('Cancel')} onClick={() => handleDialogClosefn()} />
                        <Button type="primary" danger value={t("Delete")} onClick={DeleteGroupMetric} />
                    </React.Fragment>
                    ) : (
                    <React.Fragment>
                        <Button type="secondary" value={t('Cancel')} onClick={() => handleDialogClosefn()} />
                        <Button type="primary" value="Save" disabled={savebuttonDisabled || CreateMetricsGroupLoading || UpdateMetricsGroupLoading} onClick={onClickHandler} />
                    </React.Fragment>
                    )
                ) :
                <React.Fragment>
                <Button type="secondary" value={t('Cancel')} onClick={() => handleDialogClosefn()} />
            </React.Fragment>
                }
            </ModalFooterNDL>
        </React.Fragment >
    )
            }

