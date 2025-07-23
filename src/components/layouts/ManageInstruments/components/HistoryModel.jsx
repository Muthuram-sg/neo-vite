import React, { useState, forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import History from 'assets/neo_icons/Menu/History.svg?react';
import useGetHistory from '../hooks/useGetHistory'
import Button from 'components/Core/ButtonNDL';
import { selectedPlant } from 'recoilStore/atoms';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";

const HistoryModel = forwardRef(({ onClose, name, metric, id }, ref) => {
    const { t } = useTranslation();
    const [alarmHistory, setalarmHistory] = useState([])
    const [headPlant] = useRecoilState(selectedPlant)
    const { HistoryLoading, HistoryData, HistoryError, getHistory } = useGetHistory();
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();

    useEffect(() => {
        if (!HistoryLoading && !HistoryError && HistoryData && HistoryData.length > 0) {
    
            const updatedHistoryData = HistoryData.map((item) => {
                if (item.data.includes("enable:")) {
                    // Check the direction of the change
                    const enableChange = item.data.match(/enable: (\w) -> (\w)/);
                    if (enableChange) {
                        const [_, from, to] = enableChange;
                        if (from === "f" && to === "t") {
                            item.value = item.value.replace("enable", "enable");
                        } else if (from === "t" && to === "f") {
                            item.value = item.value.replace("enable", "disable");
                        }
                    }
                }
                return item;
            });
    
            setalarmHistory(updatedHistoryData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [HistoryData]);    

    useEffect(() => {
        getUsersListForLine(headPlant.id);
    }, [headPlant])

    useEffect(() => {
        if (id) {
            getHistory(id)
        } else {
            getHistory('')
        }
    }, [id])

    const extractUpdatedBy = (data) => {
        let userListDataArr = [];
        if (!UsersListForLineLoading && !UsersListForLineError && UsersListForLineData) {
            UsersListForLineData.forEach(x => {
                let userObj = { 
                    user_name: x.userByUserId.name, 
                    id: x.user_id 
                };
                userListDataArr.push(userObj);
            });
        }

        // Extract the updated_by value from data
        const updatedByMatch = data?.match(/updated_by: [^>]*-> ([^,]*)/);
        const updatedById = updatedByMatch ? updatedByMatch[1].trim() : null;

        if (updatedById) {
            const matchingUser = userListDataArr.find(user => user.id === updatedById);
            return matchingUser ? matchingUser.user_name : updatedById;
        }

        return null;
    };

    function historydata(historyarr) {
        return (
            historyarr.map((val,index) => {
                if (val.action === 'i') {
                    val.action = 'Created this sensor'
                    val.value = ''
                }
                if (val.action === 'u') {
                    val.action = 'Updated this sensor'
                }
                if (val.action === 'd') {
                    val.action = 'Deleted this sensor'
                }

                return (
                    <ol key={val.id || val.action_time || index} style={{ height: "60px" }} className="relative text-secondary-text border-l border-gray-200 top-5 flex dark:border-gray-700 dark:text-gray-400">
                        <li className="pb-5 pl-5 flex items-center">
                            <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4  dark:bg-blue-200">
                                <History stroke={"#007BFF"} />
                            </span>

                            <div className="font-medium leading-tight ml-1 font-geist-sans">
                               
                           
                                <div className='flex gap-1 items-center'>
                                {extractUpdatedBy(val.data) && (
                                   
                                       <TypographyNDL value={extractUpdatedBy(val.data) + " " + val.action } variant='label-01-s' />
                                   
                                )}
                                <span className="text-primary-text text-[16px] font-normal leading-[22px] font-geist-sans">
                                {val.value.split(', ').map((item, index) => 
                                    item.trim() !== 'updated_by' ? (
                                        <span key={index}>{" " + item.trim() + ","}</span>
                                    ) : null
                                )}
                                </span>
                                </div>
                                
                                <TypographyNDL value={val.action === "No changes" ? "" : " on " + val.action_time}  color='tertiary' variant='paragraph-xs' />
                             
                            </div>

                        </li>

                    </ol>
                )

            })
        )
    }

    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <div className='flex items-center justify-between w-screen'>
                    <div className='flex flex-col gap-2'>
                        <TypographyNDL id="entity-dialog-title" variant="heading-02-s" model value={t("Sensor History")} />
                        <TypographyNDL value={`${name} - ${metric}`} variant="lable-01-s" color='tertiary' />
                    </div>                  
                </div>
            </ModalHeaderNDL>
            <ModalContentNDL>
                <div >

                    <div style={{paddingLeft: "20px" }}>
                        {
                            alarmHistory && alarmHistory.length > 0 ? (
                                historydata(alarmHistory)
                            ) :  <TypographyNDL value={"Loading...."} variant='paragraph-xs' />
                        }
                    </div>
                </div>
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button value={t('Close')} type={'secondary'} style={{ marginTop: 10, marginBottom: 10 }} onClick={onClose} />
            </ModalFooterNDL>
        </React.Fragment>

    )
});

export default HistoryModel;