// eslint-disable-next-line no-unused-vars
// NOSONAR  -  skip
import React from 'react';
import { useRecoilState } from "recoil";
import { selUserforLine, selUserforLineValid } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import Button from 'components/Core/ButtonNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import configParam from "config";
import gqlQueries from "components/layouts/Queries"
import SelectBox from "components/Core/DropdownList/DropdownListNDL";


export default function ExUserDropDown({validEmail,value,MailVal,options,optionarr,showManualEmailAdd,error,helperText}) {//NOSONAR
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [, setSelectedValue] = useRecoilState(selUserforLine);
    const [, setValid] = useRecoilState(selUserforLineValid);
    const [inputValue, setInputValue] = React.useState(value);
    const [employeeData, setEmployeeDetails] = React.useState(options);//NOSONAR
    const [Mail,setMail] = React.useState(value);
    const [MatchingEmployees,setMatchingEmployees] = React.useState(null); 

   
    React.useEffect(()=>{
        setValid(validEmail)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[validEmail])
    React.useEffect(() => {
        // eslint-disable-next-line no-unused-vars
       
        if (!loading) {
            return undefined;
        }

        if (inputValue === '') {
            return undefined;
        }
    configParam.RUN_GQL_API(gqlQueries.searchUserByMail, { email: `%${inputValue}%` })
      .then((userData) => {
        if (userData !== undefined && userData.neo_skeleton_user && userData.neo_skeleton_user.length > 0) {
            setEmployeeDetails(userData.neo_skeleton_user);
            setMatchingEmployees( userData.neo_skeleton_user.length)
            setLoading(false)           
            
        } else {
            setOpen(false);
            setEmployeeDetails([]); 
            setMatchingEmployees(0)
            setLoading(false);
        }
      });
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);


   
    return ( 
        <React.Fragment>
        {MatchingEmployees === 0 && MatchingEmployees !== null &&
            <div className='flex items-center gap-2'>
                <TypographyNDL variant="lable-01-s" color="secondary" value={"Note :" + t('noEmployeesAvailable')} />
                    <div className='flex items-center gap-2'>
                    <Button type="ghost" value={t('Yes')} onClick={() => showManualEmailAdd()}/>
                    <Button type="ghost" danger value={t('No')} onClick={() => setMatchingEmployees(null)}/> 
                    </div>
                   
                
            </div>
        }
        <SelectBox
            labelId="user-role"
            label={t("Email")}
            id="user-Email"
            auto={true}
            open={open}
            mandatory
            onOpen={(e) => {
               
                    setOpen(true); 
            }}
            onClose={(e) => {
            
                    setOpen(false); 
                setLoading(false);
            }}
            value={Mail}

            multiple={false}
            options={employeeData}
            isMArray={true}
            checkbox={false}
            onChange={(event, data) => {
                let newValue = data.filter(x=> x.id === event.target.value)
               
                setValid(true)
                setSelectedValue(newValue);
                setMail(event.target.value)
                MailVal(event.target.value)
                optionarr(employeeData)
            }}
            onInputChange={(e) => {
              
                if (e.target.value.length > 2) { 
                    setInputValue(e.target.value);
                    setLoading(true);
                }
            }}
            keyValue="email"
            keyId="id" 
            isSearch={true}
            error={error}
            msg={error ? helperText : ""}
        /> 
       
        </React.Fragment>
    );
}
