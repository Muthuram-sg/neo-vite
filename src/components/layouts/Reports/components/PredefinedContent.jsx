import React, { useState, useRef } from "react";
import Button from "components/Core/ButtonNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import { useTranslation } from 'react-i18next';



export default function PredefindedContent(props) {
  const { t } = useTranslation();
  const titleRef = useRef()
  const [accessType, setaccessType] = useState('')
  const [sharedUserList, setsharedUserList] = useState([])
  const [checkReportName, setcheckReportName] = useState({iserror: false, msg: ""})
  const [checkReportAccess, setcheckReportAccess] = useState(false)
  const [checkReportShared, setcheckReportShared] = useState(false)




  const handleContineReport = () => {
    // console.log(props.ReportList,"props.ReportList")
    if (titleRef.current.value === '') {
      setcheckReportName({iserror:true,msg:"Please Enter Report Name"})
      return false
    }else if(props.ReportList && props.ReportList.some((item) => item.name === titleRef.current.value)){
      setcheckReportName({iserror:true,msg:"Report Name Already Exist"})
      return false
    } else {
      setcheckReportName({iserror:false,msg:""})
    }

    if (accessType === '') {
      setcheckReportAccess(true)
      return false
    } else {
      setcheckReportAccess(false)
    }

    if (accessType && accessType === "shared" && sharedUserList.length ===  0) {
      setcheckReportShared(true)
      return false
    } else {
      setcheckReportShared(false)
    }
    props.handleContineReport(titleRef.current.value, accessType, sharedUserList)
  }

  const handleFormModelClose = () => {
    props.handleFormModelClose()
  }


  const renderInfoText=()=>{
  if(accessType === "public"){
    return "This Report is set to public, visible to everyone in the line. Keep your insights open and accessible to everyone."
  }else if(accessType === "private"){
    return  "This Report is set to private, visible only to you. Keep your insights secure and accessible only to yourself."
  }else if(accessType ===  "shared"){
    return "This Reportis shared with selected users. Control who can view your insights and collaborate effectively with your team."
  }else {
   return "Select an access level to set visibility for this Report"
  }
  }
  return (
    <React.Fragment>
      <ModalHeaderNDL>
        <div className='flex flex-col gap-0.5'>
          <TypographyNDL variant="heading-02-xs" value={"New Report"} />
          <TypographyNDL variant="paragraph-xs" color="tertiary" value={"Create a personalized Report for tailored monitoring and insights."} />
        </div>
      </ModalHeaderNDL>
      <ModalContentNDL>
        <InputFieldNDL
          id="newReportName"
          defaultValue={""}
          inputRef={titleRef}
          placeholder={t("NewReport")}
          label={t("Reportname")}
          error={checkReportName.iserror}
          helperText={checkReportName.iserror ? checkReportName.msg  : "This will appear in the overview"}
        />
        <div className='mt-3' />
        <SelectBox
          id="accesstype"
          auto={false}
          options={[{ id: "private", name: "Private" }, { id: "public", name: "Public" }, { id: "shared", name: "Shared" }]}
          isMArray={true}
          keyValue={"name"}
          label={"Access"}
          placeholder={t('select Access Here')}
          keyId={"id"}
          value={accessType}
          info={renderInfoText()}
          onChange={(e) => setaccessType(e.target.value)}
          error={checkReportAccess}
          msg={"Please Select Access Type"}


        />
        {
          accessType && accessType === 'shared' &&
          <div className='mt-3' >
            <SelectBox
              id="userSelect"
              auto={true}
              multiple={true}
              options={props.UserOption}
              isMArray={true}
              keyValue={"value"}
              label={"Share with"}
              placeholder={t('Select User')}
              keyId={"id"}
              value={sharedUserList}
              info={"Select users to give access."}
              // inputRef={aggregationRef} 
              onChange={(e) => setsharedUserList(e)}
              error={checkReportShared}
              msg={"Please Select users to give access."}


            />
          </div>
        }

      </ModalContentNDL>
      <ModalFooterNDL>
        <Button
          type='secondary'
          value={t("Cancel")}
          onClick={handleFormModelClose}
        />
        <Button value={"Continue"} onClick={handleContineReport} />
      </ModalFooterNDL>

    </React.Fragment>

  )
}