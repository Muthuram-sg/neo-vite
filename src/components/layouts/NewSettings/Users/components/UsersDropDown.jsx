import React from 'react';
import Button from 'components/Core/ButtonNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"; 
import { useRecoilState } from "recoil";
import { selUserforLine, selUserforLineValid } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import configParam from "config"; 
 

export default function UsersDropDown(props) {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [selectedValue, setSelectedValue] = useRecoilState(selUserforLine);
    const [valid, setValid] = useRecoilState(selUserforLineValid);
    const [searchType, setSearchType] = React.useState({ q: 'likesgid', n: 'sgid' });
    const [inputValue, setInputValue] = React.useState('');
    const [employeeData, setEmployeeDetails] = React.useState(props.option);
    const [MatchingEmployees,setMatchingEmployees] = React.useState(null); 

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        if (inputValue === '') {
            return undefined;
        }
        
        let url = '/employee/' + searchType.q;
        let obj1 = {};
        obj1[searchType.n] = inputValue;
        configParam
            .RUN_REST_API(url, obj1)
            .then((response) => {
                if (Array.isArray(response.data)) { 
                    if (active) {
                        let arr = response.data.map(val=>{
                            return {...val,id: val.SGID ,name: val.Name+" ("+val.SGID+")"}
                        })
                        setEmployeeDetails(arr);
                       
                        setMatchingEmployees(response.data.length)
                        setLoading(false)
                        
                    }
                    else {
                        setEmployeeDetails([]);
                        setOpen(false);
                        setMatchingEmployees(0)
                    }
                } else {
                    setEmployeeDetails([]);
                    setMatchingEmployees(0)
                    setOpen(false);
                }
            }).catch(error => console.log('profile error', error));


      

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue, loading, searchType.n, searchType.q]);

    React.useEffect(() => {
        if (!open) {
         
            setInputValue('')
        }
    }, [open]);

    let value;

            if (selectedValue && Object.keys(selectedValue).length !== 0) {
                value = selectedValue.SGID;
            } else {
                value = "";
            }

    return (
        <React.Fragment>
        {MatchingEmployees === 0 && MatchingEmployees !== null &&
            <div className='mt-3 mb-3 flex items-center gap-2' >
                <TypographyNDL variant="lable-01-s" color="secondary" value={"Note :" + t('noEmployeesAvailable')} />
            <div className='flex items-center gap-2' >
                    <Button type="ghost" value={t('Yes')} onClick={() => props.showManualUserAdd()}/>
                    <Button type="ghost" danger value={t('No')} onClick={() => setMatchingEmployees(null)}/> 
                </div>
            </div>
        }
        <SelectBox
            labelId="user-role"
            label={t('User')}
            id="get-hrms-users"
            auto={true}
            mandatory
            open={open}
            onOpen={(e) => {
               
                    setOpen(true); 
            }}
            onClose={(e) => {
              
                    setOpen(false); 
                setLoading(false);
            }}
            value={value}

            multiple={false}
            options={employeeData}
            isMArray={true}
            checkbox={false}
            onChange={(event, data) => {
                let newValue = data.filter(x=> x.id === event.target.value)

                setValid(true)
                setSelectedValue(newValue[0]);
                props.optionarr(employeeData)
            }}
            onInputChange={(e) => {
               
                if (e.target.value.length > 2) {
                    if (isNaN(e.target.value.charAt(0)) && !isNaN(e.target.value.substring(1))) {
                        setSearchType({ q: 'likesgid', n: 'sgid' })
                    }
                    else {
                        setSearchType({ q: 'likename', n: 'name' })
                    }
                    setInputValue(e.target.value);
                    setLoading(true);
                }
            }}
            keyValue="name"
            keyId="SGID" 
            isSearch={true}
        /> 
        <span style={{color:'red'}}>{!valid ? t('SelectUser') : ""}</span>

        
       
        </React.Fragment>
    );
}
