import React, { useEffect, useState} from 'react'
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL'
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL'
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL'
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import DatePickerNDL from "components/Core/DatepickerNDL";
import Button from 'components/Core/ButtonNDL'
import { useTranslation } from "react-i18next";
const LicenseEditComp = (props) => {
  const { t } = useTranslation();
  const [date, setdate] = useState({ value: null, isValid: false })
  const [, setdatepopper] = useState(null)
  const [ExpiryRem,setExpiryRem] =useState('')
  const [options]=useState([{id:"7",name:"7 days"},{id:"15",name:"15 days"},{id:"30",name:"30 days"}])
  const [isConfirmationmsg,setisConfirmationmsg] = useState(false)
  const [isRemainder,setisRemainder] = useState(false)
  const [isExpiryDate,setisExpiryDate] = useState(false)

  useEffect(() => {
    // getLicenseData(props.value.headPlantid)
    if(props.value.LicenseData && props.value.LicenseData.length > 0  ){
      setdate({value : props.value.LicenseData[0].expiry_date,isValid : true})
      setExpiryRem(props.value.LicenseData[0].expiry_remainder.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.value])


  function handleExpiryReminder(e,op) {
console.log(e,op,"e,opt")
setExpiryRem(e.target.value)
   
  }
  const handleDialogClosefn = () => {
    props.handleDialogClose();



  }
  const handlesaveClick = () => {
    props.handleSaveFunction(date,ExpiryRem)
   
    setisConfirmationmsg(false)
    props.handleDialogClose();

  };
  const handledateclick = (e) => {
    setdatepopper(e.currentTarget)
}

const handleConfirmDialog=()=>{
  if(!date.isValid){
    setisExpiryDate(true)
    return false
  }else{
    setisExpiryDate(false)
  }
  if(!ExpiryRem){
    setisRemainder(true)
    return false
  }else{
    setisRemainder(false)
  }
  setisConfirmationmsg(true)

}

  return (
    <div>
      <React.Fragment>
        <ModalHeaderNDL>
          <TypographyNDL variant="heading-02-s" model value={isConfirmationmsg ? "Confirmation" :"Edit License Information"} />
        </ModalHeaderNDL>
        <ModalContentNDL>
          {
            isConfirmationmsg ? 
            <TypographyNDL value="You are about to change the license expiry date. Do you want to proceed?" variant="lable-01-m" />
          :
          <React.Fragment>
            <TypographyNDL  variant="paragraph-xs" >
            Expiry Date<span style={{ color: 'red' }}> *</span>
            </TypographyNDL>
           {/* <span className="block mb-2 text-[14px] font-geist-sans  leading-[18px] font-medium text-Text-text-primary dark:text-Text-text-primary-dark my-2">Expiry Date<span style={{ color: 'red' }}>*</span></span> */}
  <DatePickerNDL
                                           id="Date-picker"
                                           onChange={(e) => {
                                               setdate({value:e,isValid: true});
                                              }} 
                                           onClick={handledateclick}
                                           startDate={date.value ? new Date(date.value) : date.value}
                                           dateFormat="dd/MM/yyyy"
                                           placeholder={"Select Expiry date"}
                                           customRange={false}
                                           label={"Expiry date"}
                                           minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                           error={isExpiryDate}
                                           helperText={isExpiryDate ? "Select Expiry date" : null}
                                           
                                  />
      <div className="mt-3" />
         
          
            <div>
             
              <SelectBox
                label={"Expiry Reminder"}
                id="select-part-signal"
                edit={true}
                mandatory
                options={options}
                isMArray={true}
                checkbox={false}
                value={ExpiryRem}
                onChange={(e, option) => handleExpiryReminder(e, option)}
                keyValue="name"
                keyId="id"
                error={isRemainder}
                msg={'Please Select Expiry Remainder'}
              />
            </div>
          </React.Fragment>
          }
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button type="secondary" value={t('Cancel')}  onClick={() => handleDialogClosefn()} />
          {
            isConfirmationmsg ?
              <Button type="primary" value={t('Proceed')}  onClick={() => handlesaveClick()} />
              :
              <Button type="primary" value={t('Update')}  onClick={() => handleConfirmDialog()} />

          }


        </ModalFooterNDL>
      </React.Fragment >
    </div>
  )
}

export default LicenseEditComp
