import React, { useEffect, useState, useRef } from "react";
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import AddLight from 'assets/neo_icons/Menu/newMenuIcon/button_plus.svg?react';
import useAddReasonTag from "../hooks/useAddReasonTag";
import useReasonTags from "../hooks/useReasonTags";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import CustomSwitchNDL from "components/Core/CustomSwitch/CustomSwitchNDL";
import AddReasonTagModel from "./AddReasonTagModel";
import RadioNDL from "components/Core/RadioButton/RadioButtonNDL";


export default function AddReason(props) {
    const { t } = useTranslation();
    const [tagsname, setTagsname] = useState([])
    const [dialogbox, setDialogbox] = useState(false);
    const [CheckDatadt, setCheckDatadt] = useState(false);
    const [, setSelectdrop] = useState('');
    const [wOIDval, setWOIDval] = useState('');
    const [, setEditreasonid] = useState('');
    const [typeReasonactive, setTypeReasonactive] = useState('')
    const [typeReasoninactive, setTypeReasoninactive] = useState('')
    const reasonsref = useRef();
    const HMIref = useRef()
    const [includeOEEConfirm, setIncludeOEEConfirm] = useState(true);
    const [textInputreason, setTextInputreason] = useState('')
    const [reasontaginputreason, setReasonTagInputReason] = useState('');
    const [reasonCategeries, setReasonCategeries] = useState('');
    const [tagdialog, settagdialog] = useState(false);
    console.log(props.Reasontags,"props.Reasontags")
    const [reasontags, setreasontags] = useState(props.Reasontags)
    const [invalidtagname, setinvalidtagname] = useState('')
    const [reasonType,setreasonType] = useState('')
    const [isMapReason,setisMapReason] = useState(false)
    const [isErrorHmi,setisErrorHmi] = useState(false)
    const [noTag, setnoTag] = useState(false);
    const [isDuplicateHmi,setisDuplicateHmi] = useState(false)
    const [EditHmiValue,setEditHmiValue] = useState('')

    
    


    const { AddReasonTagLoading, AddReasonTagData, AddReasonTagError, getAddReasonTag } = useAddReasonTag()
    const { ReasonTagsListLoading, ReasonTagsListData, ReasonTagsListError, getReasonTags } = useReasonTags()



   const  reasonOption=[
        {id:'Downtime',name:t('Downtime')},
        {id:'Quality',name:t('Quality')},
        {id:'Performance',name:t('Performance')},
        {id:'Others',name:t('Others')}
    ]


    useEffect(() => {
// console.log(reasontags,"reasontags")
        filterreasontags(props.Reasontags)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.Reasontags.length, props.selectedReason, CheckDatadt])


    const filterreasontags = (list) => {

        if (list) {
            let ids = [];
            if (props.selectedReason === "Downtime") {
                ids.push("17", "3");
            } else if (props.selectedReason === "Quality") {
                ids.push("2", "18");
            } else if (props.selectedReason === "Performance") {
                ids.push("16");
            } else if (props.selectedReason === "Others") {
                ids.push("10");
            }
            // console.log(list,"list")

            var temp = list.filter(val => ids.findIndex(item => Number(item) === Number(val.reason_type)) >= 0)
            // console.log(temp,'temp')
            setreasontags(temp)
        }
    }
    useEffect(() => {

        if (!ReasonTagsListLoading && !ReasonTagsListError && ReasonTagsListData) {
            // props.setreasontags(ReasonTagsListData)
            // setreasontags(ReasonTagsListData)
            // console.log(ReasonTagsListData,"ReasonTagsListData")
            filterreasontags(ReasonTagsListData)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ReasonTagsListLoading, ReasonTagsListData, ReasonTagsListError])

    useEffect(() => {

        if (!AddReasonTagLoading && !AddReasonTagError && AddReasonTagData) {

            getReasonTags(props.headPlant)
            settagdialog(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddReasonTagLoading, AddReasonTagData, AddReasonTagError])



    useEffect(() => {
        if (props.dialogModebox === "edit") {
            
            setTextInputreason("")
            setReasonCategeries("")
            setReasonTagInputReason("")
            setEditreasonid(props.editvalues.reason_type_id)
            // setreasonType(props.selectedReason)
            setTimeout(()=>{
                reasonsref.current.value = props.editvalues.reason
            },200)
            let reasonTagsarr = []
            if (props.editvalues.reason_tag) {
                // eslint-disable-next-line array-callback-return
                props.editvalues.reason_tag.map(val => {
                    var filtered = reasontags.filter(x => x.id === val)
                    if (filtered.length > 0) reasonTagsarr.push(filtered[0])
                })
            }
            if(props.editvalues.hmi){
                setisMapReason(true)
                setTimeout(()=>{
                    HMIref.current.value = props.editvalues.hmi
                },300)
                setEditHmiValue(props.editvalues.hmi)

            }else{
                setisMapReason(false)
                setTimeout(()=>{
                    HMIref.current.value = ''
                },300)
                setEditHmiValue('')


            }
          console.log(reasonTagsarr,"reasonTagsarr")
            setTagsname(reasonTagsarr)
            setIncludeOEEConfirm(props.editvalues.include_in_oee)
            setSelectdrop(props.editvalues.prod_reason_type.reason_type)
            setWOIDval(props.editvalues.id)
            setDialogbox(props.Dialog)
            if (props.editvalues.prod_reason_type.reason_type === "Unplanned Downtime"  || props.editvalues.prod_reason_type.reason_type === "Planned Downtime") {
                setTypeReasonactive("Planned")
                setTypeReasoninactive("Unplanned")
            }else if (props.editvalues.prod_reason_type.reason_type === "Rejected Quality"  || props.editvalues.prod_reason_type.reason_type === "Scrapped Quality") {
                setTypeReasonactive("Scrap")
                setTypeReasoninactive("Reject")
            } 

            setCheckDatadt(props.CheckDatadt)

        } else if (props.dialogModebox === "delete") {
            setWOIDval(props.editvalues.id)
            setDialogbox(props.Dialog)
            setCheckDatadt(props.CheckDatadt)
            setTextInputreason("")
            setReasonCategeries("")
            setReasonTagInputReason("")

            let reasonTagsarr = []
            if (props.editvalues.reason_tag) {
                // eslint-disable-next-line array-callback-return
                props.editvalues.reason_tag.map(val => {
                    var filtered = reasontags.filter(x => x.id === val)
                    if (filtered.length > 0) reasonTagsarr.push(filtered[0])
                })
            }
         
            setTagsname(reasonTagsarr)

        } else {
            setTextInputreason("")
            setReasonCategeries("")
            setReasonTagInputReason("")
            setTagsname([])
            if (props.selectedReason === "Downtime") {
                setTypeReasonactive("Planned")
                setTypeReasoninactive("Unplanned")
                setCheckDatadt(false)
            } else {
                setTypeReasonactive("Scrap")
                setTypeReasoninactive("Reject")
                setCheckDatadt(false)
            }
            // setDialogbox(props.Dialog)
            setIncludeOEEConfirm(true)
            // setTagsname([])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.Dialog])

    const handleDialogClosefn = () => {
        if (dialogbox === true) {
            setDialogbox(false);
            props.dialogfns(false);
        } else {
            props.dialogfns(true);
            setDialogbox(true);
        }
        props.handleDialogClosefn()
    }

    const createOrderfn = () => {

        let ids;
        // console.log(props.Tags,"props.Tags")
        let DuplicateHmi = props.Tags.filter(x=>x.hmi === (isMapReason ? Number(HMIref.current.value) : ''))
        if (props.selectedReason === "Downtime" && CheckDatadt) {
            ids = "17";
        } else if (props.selectedReason === "Downtime" && !CheckDatadt) {
            ids = "3";
        } else if (props.selectedReason === "Quality" && CheckDatadt) {
            ids = "2";
        } else if (props.selectedReason === "Quality" && !CheckDatadt) {
            ids = "18";
        } else if (props.selectedReason === "Performance") {
            ids = "16";
        } else if (props.selectedReason === "Others") {
            ids = "10";
        }
    
        // const SetTags= ({setTags}) => {
        //     const [inputValue, setInputValue] = useState("true");
        // }

        if(isMapReason && DuplicateHmi.length > 0 && props.dialogModebox !== "edit"){
         setisDuplicateHmi(true)
         return false
        }else{
         setisDuplicateHmi(false)

        }


        if(props.dialogModebox === "edit" && isMapReason && EditHmiValue){
            if(EditHmiValue !== Number(HMIref.current.value)){
             let DuplicateHmiEdit = props.Tags.filter(x=>x.hmi === Number(HMIref.current.value))
             if(DuplicateHmiEdit.length > 0){
                setisDuplicateHmi(true)
                return false
               }else{
                setisDuplicateHmi(false)
       
               }

            }

        }
        



        if(isMapReason && HMIref.current && HMIref.current.value === ''){
            setisErrorHmi(true)
            return false
        }else{
            setisErrorHmi(false)

        }

        

        if (props.dialogModebox === "edit") {
            if (reasonsref.current.value && tagsname.length > 0) {
                  
                props.callfunctionsupdate({ "value": reasonsref.current.value, "reasonTypedt": ids, "WOID": wOIDval, "include_in_oee": includeOEEConfirm, "reason_tag": "{" + tagsname.map(val => { return val.id }).toString() + "}",hmi:isMapReason ? HMIref.current.value : null })
            } 
            else if(!props.selectedReason){
                setReasonCategeries("Select a Reason categories")
            }
            else if (!reasonsref.current.value) {
                setTextInputreason(t("Enter Reason Name"))
            } else if (tagsname.length === 0) {
                setReasonTagInputReason(t("Select a Reason Tag"))
            }
        } else if (props.dialogModebox === "delete") {
            props.deleteselected(wOIDval, tagsname)
        } else {
            if (reasonsref.current.value && tagsname.length > 0) {
               
                props.callfunctions({ "value": reasonsref.current.value, "reasonTypedt": ids, "include_in_oee": includeOEEConfirm, "reason_tag": "{" + tagsname.map(val => { return val.id }).toString() + "}",hmi:isMapReason ? HMIref.current.value : null })
            }
            else if(!props.selectedReason){
                setReasonCategeries("Select a Reason categories")
            }
            else if (!reasonsref.current.value) {
                setTextInputreason("Enter Reason Name")
            } else if (tagsname.length === 0) {
                setReasonTagInputReason(t("Select a Reason Tag"))
            }
           
        }


    }

    const handleOnlineStatusDt = () => {
        setCheckDatadt(!CheckDatadt);
    };
    const handleOnlineStatusDtOEE = (event) => {
        setIncludeOEEConfirm(event.target.checked);
    }
    const handleAddTag = () => {
        setinvalidtagname("")
        settagdialog(true)
    }
    const saveTag = (tag,ids) => {
        
        getAddReasonTag(tag , props.user, props.headPlant, ids)
            // let ids;
            // if(tag ===""){
            //     setnoTag(true)
            // }else{
            //     if (props.selectedReason === "Downtime" && CheckDatadt) {
            //         ids = "17";
            //     } else if (props.selectedReason === "Downtime" && !CheckDatadt) {
            //         ids = "3";
            //     } else if (props.selectedReason === "Quality" && CheckDatadt) {
            //         ids = "2";
            //     } else if (props.selectedReason === "Quality" && !CheckDatadt) {
            //         ids = "18";
            //     } else if (props.selectedReason === "Performance") {
            //         ids = "16";
            //     } else if (props.selectedReason === "Others") {
            //         ids = "10";
            //     }

    
            //     var present = props.Reasontags.findIndex(val => val.reason_tag.toLowerCase() === tag .trim().toLowerCase())
            //     if (present >= 0 || tag  ==="") props.duplicatetag(tag ===""? true:false)
            //     else getAddReasonTag(tag , props.user, props.headPlant, ids)
            // }
          




    }
    const handleTagDialogClose = () => {
        setnoTag(false)
        settagdialog(false) 
    }
    const handlereasontagchange = (e) => {
        if (e) setTagsname(e)
    }

    let headingText = '';

    if (props.dialogModebox === "delete") {
      headingText = t("Delete reason");
    } else if (props.dialogModebox === "edit") {
      headingText = t("Edit Reason");
    } else {
      switch (props.selectedReason) {
        case "Downtime":
          headingText = t("Add ") + t('Downtime') + " " + t('Reason');
          break;
        case "Quality":
          headingText = t("Add ") + t('Quality') + " " + t('Reason');
          break;
        case "Performance":
          headingText = t("Add ") + t('Performance') + " " + t('Reason');
          break;
        case "Others":
          headingText = t("Add ") + t('other') + " " + t('Reason');
          break;
        default:
          headingText = t("Add ") + t('Downtime') + " " +t('Reason');
          break;
      }
    }
    
    let reasonOpt=reasontags ? reasontags : []

    const shouldRenderSwitch = (
        (props.selectedReason === "Downtime" || props.selectedReason === "Quality") ||
        (props.dialogModebox === "edit" && props.editvalues.reason_type_id !== 16 && props.editvalues.reason_type_id !== 10)
      );

      let buttonValue = '';

      if (props.dialogModebox === "delete") {
        buttonValue = t("Delete");
      } else if (props.dialogModebox === "create") {
        buttonValue = t("Save");
      } else if (props.dialogModebox === "edit") {
        buttonValue = t("Update");
      }
      
    const handleTypeChange =(e)=>{
        props.handleTypeChange(e)
    }
    const handleMaptheReason=(e)=>{
        setisMapReason(e.target.checked)
    }

    const numberInputOnWheelPreventChange = (e) => {
        // Prevent the input value change
        e.target.blur()
    
        // Prevent the page/container scrolling
        e.stopPropagation()
    
        // Refocus immediately, on the next tick (after the current function is done)
          setTimeout(() => {
            e.target.focus()
        }, 0)
    }

    const isDanger = props.dialogModebox === "delete";  
    
    const handleHmiChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); 
        if (value.length > 10) {
            value = value.slice(0, 10); 
     
        }
        e.target.value = value;
        
    };
 
    
    return (
        <React.Fragment> 
            <React.Fragment> 
                <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" color="primary"  model value={headingText}/>
               {/* { props.dialogModebox === "create" && (
    <TypographyNDL 
      variant="paragraph-xs" 
      color="tertiary" 
      model 
      value={"Personalize your factory's identity, location, and business hierarchy  "} 
    />
    
  )}        */}
               </ModalHeaderNDL>
                <ModalContentNDL>
            
                {props.dialogModebox === "delete" ? <TypographyNDL variant='paragraph-s' color='secondary' value={t("Do you really want to delete the reason? This would delete all the associated outage and quality defect reasons as well. And it is not reversible.")} />:
                        <React.Fragment>
                            {props.dialogModebox  !== 'edit' &&
                            <div className={'mb-3'}>

                            <SelectBox
                                    id="combo-Reason"
                                    label={t("Category")}
                                    placeholder={t("Select Reason Type")}
                                    options={reasonOption}
                                    onChange={handleTypeChange}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    value={ props.selectedReason}
                                    error={reasonCategeries}
                                    msg={reasonCategeries}
                                    mandatory
                                    // btnProps={<Button onClick={(e) => { e.stopPropagation(); handleAddTag() }} icon={AddLight} type={"ghost"} />}
                                />
                            </div>

                            }
                            {
                                    shouldRenderSwitch && 
                                    <div className="mb-3 flex items-left gap-2">
                                    <RadioNDL nopadding name={t(typeReasonactive)} labelText={t(typeReasonactive)} id={typeReasonactive} checked={!CheckDatadt} onChange={handleOnlineStatusDt} />
                                    <RadioNDL nopadding name={t(typeReasoninactive)} labelText={t(typeReasoninactive)} id={typeReasoninactive} checked={CheckDatadt} onChange={handleOnlineStatusDt} />
           </div>
                //                     <div className="mb-2">
                // <CustomSwitch
                //     id={"switch"}
                //     switch={true}
                //     checked={CheckDatadt}
                //     onChange={handleOnlineStatusDt}
                //     primaryLabel={t(typeReasonactive)}
                //     secondaryLabel={t(typeReasoninactive)}
                //     size="small"
                //     />
                 
                //    </div>
                                }
                            <div className="mb-3">

                            <InputFieldNDL
                                id={"dtreson-name"}
                                label={t("Reason Name")}
                                placeholder={t("Type here")}
                                size={"small"} 
                                inputRef={reasonsref}
                                error={textInputreason}
                                helperText={textInputreason}
                                mandatory
                            //onChange={handlereasonnameDt}
                            />
                            </div>
                            <div className={"flex justify-between items-end gap-2 mb-3"}>
                                <div style={{width:'83%'}}>
                                <SelectBox
                                    id="combo-Reason"
                                    label={t("Reason Tag")}
                                    placeholder={t("Select a Tag")}
                                    disableCloseOnSelect={true}
                                    auto={true}
                                    options={reasonOpt}
                                    onChange={( option) => handlereasontagchange(option)}
                                    isMArray={true}
                                    keyValue={"reason_tag"}
                                    keyId={"id"}
                                    value={tagsname}
                                    edit={true}
                                    multiple={true}
                                    error={reasontaginputreason}
                                    msg={reasontaginputreason}
                                    mandatory
                                    // btnProps={<Button onClick={(e) => { e.stopPropagation(); handleAddTag() }} icon={AddLight} type={"ghost"} />}
                                />
                                </div>
                                <Button style={{minWidth:80}} type='tertiary' onClick={(e) => { e.stopPropagation(); handleAddTag() }} icon={AddLight} value={'Add Tag'} />
                            </div>
                            {
                                props.selectedReason === "Downtime" &&
                                <div className="mb-3">

                                    <div className="pb-1">
                                        <CustomSwitchNDL
                                            onChange={handleMaptheReason}
                                            checked={isMapReason}
                                            primaryLabel={"Map this reason to HMI"}
                                        />
                                    </div>
                                    <div  style={{ display: isMapReason ? 'block' : 'none' }}>
                                        <InputFieldNDL
                                            class="noscroll"
                                            id={"dtreson-name"}
                                            label={t("HMI ID")}
                                            placeholder={t("Type here")}
                                            type='number'
                                            size={"small"}
                                            inputRef={HMIref}
                                            error={isErrorHmi || isDuplicateHmi}
                                            helperText={isErrorHmi ? "Please Enter Hmi " : ''}
                                            mandatory
                                            onWheel={numberInputOnWheelPreventChange}
                                        //onChange={handlereasonnameDt}
                                        onChange={handleHmiChange}
                                        />
                                        {
                                            isDuplicateHmi &&
                                            <div className="mt-0.5">
                                            <TypographyNDL value={'Entered HMI is Already Exist or Please Enter Valid HMI value'} color='#DA1E28' variant={'lable-01-s'} style={{marginTop:'4px'}} />
                                            </div>

                                        }

                                    </div>
                                </div>

                            }
               
                        </React.Fragment>
                        }
                    {
                        (props.selectedReason && props.selectedReason === "Downtime" && props.dialogModebox !== "delete" ) && (
                            <div className="pb-2">
                                <CustomSwitch
                                    id={"IncludereasonOEE"}
                                    switch={false}
                                    checked={includeOEEConfirm}
                                    onChange={handleOnlineStatusDtOEE}
                                    primaryLabel={t("Include this reason in OEE")}
                                />
                            </div>
                        )
                    }
                   
                  


                </ModalContentNDL>
                <ModalFooterNDL>
                  
                    <Button type="secondary"  value={t('Cancel')} onClick={() => handleDialogClosefn()} />
                    <Button type="primary"  danger={isDanger} value={buttonValue} onClick={() => { createOrderfn() }} />
                
                </ModalFooterNDL>
            </React.Fragment>
            
            <ModalNDL open={tagdialog} onClose={handleTagDialogClose} > 
                <AddReasonTagModel   
                saveTag={saveTag}
                handleTagDialogClose={handleTagDialogClose}
                invalidtagname={invalidtagname}
                AddReasonTagLoading={AddReasonTagLoading}
                error={noTag}
                CheckDatadt={CheckDatadt}
                selectedReason={props.selectedReason}
                Reasontags={props.Reasontags}
                />
                {/* <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-s" model value={t('Add Unit')}/>           
                </ModalHeaderNDL>
                <ModalContentNDL> 
                    <InputFieldNDL
                        id="tagname"
                        placeholder={t('Tag')}
                        inputRef={tagref}
                        label={t('Tag')}
                        error={noTag}
                        helperText={"please enter the tag name"}
                    /> 

                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button type="secondary"  value={t('Cancel')} onClick={() => handleTagDialogClose()}/>
                    <Button type="primary"   value={t('Save')} loading={AddReasonTagLoading} onClick={() => saveTag()}/>
                </ModalFooterNDL> */}
            </ModalNDL>  
        </React.Fragment>
    )
}

