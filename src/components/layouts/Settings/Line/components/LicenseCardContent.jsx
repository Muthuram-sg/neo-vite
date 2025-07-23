import React, { useState , useEffect} from "react";
import CustomCardHeader from './NewCardHeader'
import Typography from "components/Core/Typography/TypographyNDL";
import LicenseEditComp from "./LicenseEditComp";
import ModalNDL from "components/Core/ModalNDL";
const LicenseCardContent = (props) => {
  const [model, setModel] = useState(false)

  const handleEditfunction = (value) => {
  
    setModel(true)

  };

  function handleDialogClose() {
    setModel(false)
  }

  const handleSaveFunction = (date,ExpiryRem) => {
    console.log(date,ExpiryRem,"vals")
    props.onHandleConfirmSave(date,ExpiryRem);
    
  }
  function handleExpiry(type){
    
    if(type === "expiryDate"){
      const hasEmptyObject = props.updatedLicenceData.some(
        obj => Object.keys(obj).length === 0 && obj.constructor === Object
      );
      if(hasEmptyObject){ //Table value
        if(props.LicenseData && props.LicenseData.length > 0){
          if(props.LicenseData && props.LicenseData[0] && props.LicenseData[0].expiry_date){
            const dateStr = props.LicenseData[0].expiry_date;
                const date = new Date(dateStr);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = date.toLocaleDateString('en-US', options);

                console.log(formattedDate,"formattedDate"); // August 11, 2024
                return formattedDate 

          }
          
        }
        else{
          return "Expiry Date not updated"
        }
          
      }
      else{//Edited Table value
        if(props.updatedLicenceData && props.updatedLicenceData[0] && props.updatedLicenceData[0].expiry_date){
          const dateStr = props.updatedLicenceData[0].expiry_date;
          const date = new Date(dateStr);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-US', options);

          console.log(formattedDate,"formattedDate"); // August 11, 2024
          return formattedDate 
        }
        else{
          return "Expiry Date not updated"
        }
      }
    }
    else if(type === "expiryRemainder"){
      const hasEmptyObject = props.updatedLicenceData.some(
        obj => Object.keys(obj).length === 0 && obj.constructor === Object
      );
      if(hasEmptyObject){ //Table value
        if(props.LicenseData && props.LicenseData.length > 0){
            return props.LicenseData && props.LicenseData[0] && props.LicenseData[0].expiry_remainder + " days"
        }
        else{
          return "Expiry Reminder details not updated"
        }
         
      }
      else{//Edited Table value
          return props.updatedLicenceData && props.updatedLicenceData[0] && props.updatedLicenceData[0].expiry_remainder ? props.updatedLicenceData[0].expiry_remainder  + " days" : "Expiry Reminder details not updated"
      }
    }
   else if(type === "status"){
    const hasEmptyObject = props.updatedLicenceData.some(
      obj => Object.keys(obj).length === 0 && obj.constructor === Object
    );
    if(hasEmptyObject){ //Table value
      if(props.LicenseData && props.LicenseData.length > 0){
        if(props.LicenseData && props.LicenseData[0] && props.LicenseData[0].expiry_date){
          const dateStr = props.LicenseData[0].expiry_date;
              const date = new Date(dateStr);
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              const formattedDate = date.toLocaleDateString('en-US', options);

              console.log(formattedDate,"formattedDate"); 
              const expiryDate = new Date(formattedDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
      
                if (today >= expiryDate) {
                 return "Expired";
                } else {
                  return "Active";
                }

        }
        
      }
      else{
        return "Expiry Date not updated"
      }
        
    }
    else{//Edited Table value
      if(props.updatedLicenceData && props.updatedLicenceData[0] && props.updatedLicenceData[0].expiry_date){
        const dateStr = props.updatedLicenceData[0].expiry_date;
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        console.log(formattedDate,"formattedDate"); // August 11, 2024
        const expiryDate = new Date(formattedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

          if (today >= expiryDate) {
           return "Expired";
          } else {
            return "Active";
          }
      }else{
        return "Expiry Date not updated"
      }
    }
   }
  }
console.log(props.updatedLicenceData,props.LicenseData,"props")
function getColor(){
  let status = handleExpiry("status")
  return status === "Active" ? "success" : "danger"
}
  return (
    
    <div >
     
    <div className="h-10" >
      <CustomCardHeader onhandleEdit={() => handleEditfunction()} isSuperAdmin={props.isSuperAdmin} isLicenseModel />
      </div>
      <Typography value={"Status"} variant="paragraph-xs" color='secondary' />
      <div className="mt-0.5" />

      <Typography color={getColor()} value={handleExpiry("status")} variant="lable-01-s"  />
      <div className="mt-4" />
      <div >
            <Typography value={"Expiry Date"} variant="paragraph-xs" color='secondary' />
      <div className="mt-0.5" />

            <Typography  value={handleExpiry("expiryDate")} variant="lable-01-s" />
      </div>
      <div className="mt-4" />
      <div >
            <Typography value={"Expiry Reminder"} variant="paragraph-xs" color='secondary' />
      <div className="mt-0.5" />
            <Typography  value={handleExpiry("expiryRemainder")} variant="lable-01-s" />
      </div>

      <ModalNDL disableEnforceFocus onClose={() => handleDialogClose()} aria-labelledby="entity-dialog-title" open={model}>
        <LicenseEditComp
          dialogMode={props.dialogMode}
          Editedvalue={props.Editedvalue}
          handleDialogClose={handleDialogClose}
          value={props}
          handleSaveFunction={handleSaveFunction}
          
        />
      </ModalNDL>

    </div>
  );
};
const isRender = (prev, next) => {
  return   prev.backgroundColor !== next.backgroundColor ||
    prev.LicenseData !== next.LicenseData ||
    prev.updatedLicenceData !== next.updatedLicenceData ||
    prev.headPlantid !== next.headPlantid  || prev.isSuperAdmin !== next.isSuperAdmin 
    ? false
    : true;
};
export default React.memo(LicenseCardContent, isRender);
