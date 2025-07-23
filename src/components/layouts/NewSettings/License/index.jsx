/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import useTheme from "TailwindTheme";  
import "components/style/customize.css";
import { useRecoilState } from "recoil";
import {
  userDefaultLines,
  selectedPlant,
  selectedPlantIndex,
  snackToggle,
  snackMessage,
  snackType,
  user
} from "recoilStore/atoms";
import useSaveLineDetails from "./hooks/useUpdateLine";
import { useEffect } from "react";
import LicenseCardContent from "./components/LicenseCardContent";
import { useTranslation } from "react-i18next";
import useUpdateLicensing from "./hooks/useUpdateLicensing"
import useAddLicense from "./hooks/useAddLicense"
import useGetLicence from "./hooks/useGetLicence"
import useGetAlarmSMSUser from "components/layouts/Alarms/hooks/useGetAlarmSMSUser";

export default function LicenceComponent(props) {
  const [headPlant,] = useRecoilState(selectedPlant);
  const [curruser] = useRecoilState(user);
  const [licenseData, setLicenseData] = useState([{}])
  const [isSuperAdmin, setisSuperAdmin] = useState(false)
  const { AlarmSMSUserLoading, AlarmSMSUserData, AlarmSMSUserError, getAlarmSMSUser } = useGetAlarmSMSUser()
  const { outLicenseUpdateLoading, outLicenseUpdateData, outLicenseUpdateError, getSaveLicenseDetails } = useUpdateLicensing()
  const { LicenseLoading, LicenseData, LicenseError, getLicenseData } = useGetLicence()
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const { addLicenseLoading, addLicenseData, addLicenseError, getAddLicense } = useAddLicense()
  const theme = useTheme();
  const { t } = useTranslation();

useEffect(() => {
getLicenseData(headPlant.id)
setLicenseData([{}])
getAlarmSMSUser()

// eslint-disable-next-line react-hooks/exhaustive-deps
},[headPlant])


  
  useEffect(()=>{
    if(!AlarmSMSUserLoading && AlarmSMSUserData  &&  !AlarmSMSUserError){
      let isAccesableUser = AlarmSMSUserData.filter(x=>x.user_id === curruser.id && x.is_enable) 
      console.log(isAccesableUser,'isAccesableUser')
      if(isAccesableUser.length > 0){
        setisSuperAdmin(true)
      }else{
        setisSuperAdmin(false)

      }

    }
  },[AlarmSMSUserLoading,  AlarmSMSUserData , AlarmSMSUserError])

  
  const callsavelines = (date,ExpiryRem) => {
    // console.log(date,ExpiryRem,LicenseData,"vals")
    if (
      date && date.value &&
      ExpiryRem && ExpiryRem !== ''
    ) 
    {
        let ExpiryDate = new Date(date.value).toISOString().replace('Z', '+05:30')
        const ExpiryRemainder = parseInt(ExpiryRem.match(/\d+/)[0], 10);
        console.log(ExpiryDate,ExpiryRemainder,LicenseData,"save")
        if(LicenseData.length > 0){
          getSaveLicenseDetails(LicenseData[0].line_id,ExpiryDate,ExpiryRemainder)
        }
        else if(LicenseData.length === 0){
           getAddLicense(headPlant.id,ExpiryDate,ExpiryRemainder)
        }
    } else {
      console.log("NEW MODEL", "IDT", "undefined", "Line Setting", new Date());
    }
  };

useEffect(() => {
if(!addLicenseLoading && addLicenseData && addLicenseData.insert_neo_skeleton_licensing_table && addLicenseData.insert_neo_skeleton_licensing_table.returning && !addLicenseError){
  let data = addLicenseData.insert_neo_skeleton_licensing_table.returning;
  if(data.length >= 1){
    let temp1 = data.map(x=>{
      return {expiry_date:x.expiry_date,expiry_remainder :x.expiry_remainder}
    })
    SetMessage("License Details Updated");
    SetType("success");
    setOpenSnack(true);
    setLicenseData(temp1)
    getLicenseData(headPlant.id)
  }
}
},[addLicenseLoading, addLicenseData, addLicenseError])

  useEffect(() => {
    if (
      outLicenseUpdateData &&
      outLicenseUpdateData.update_neo_skeleton_licensing_table &&
      outLicenseUpdateData.update_neo_skeleton_licensing_table.affected_rows > 0 &&
      !outLicenseUpdateError &&
      !outLicenseUpdateLoading
    ) {
      let data = outLicenseUpdateData.update_neo_skeleton_licensing_table;
      if (data.affected_rows >= 1) {
         let temp1 = JSON.parse(JSON.stringify(licenseData));
        temp1[0].expiry_date = data.returning[0].expiry_date;
        temp1[0].expiry_remainder = data.returning[0].expiry_remainder;

        SetMessage("License Details Updated");
        SetType("success");
        setOpenSnack(true);
        setLicenseData(temp1)
        getLicenseData(headPlant.id)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outLicenseUpdateData]);

  return (
    <React.Fragment>
        <div>
          <LicenseCardContent 
            backgroundColor={theme.palette.background.default}
            color={theme.palette.secondaryText.main}
            headPlantid={headPlant.id}
            onHandleConfirmSave={callsavelines}
            LicenseData={LicenseData}
            updatedLicenceData={licenseData}
            isSuperAdmin={isSuperAdmin}
          />
        </div>
    </React.Fragment>
  );
}
