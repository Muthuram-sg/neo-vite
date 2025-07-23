// historymodel.jsx
import React, { useState, forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import History from 'assets/neo_icons/Menu/History.svg?react';
import useAlarmHistory from '../hooks/useAlarmHistory'
import Button from 'components/Core/ButtonNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Filter from 'assets/neo_icons/Charts/filter.svg?react';
import ListNDL from 'components/Core/DropdownList/ListNDL';

const HistoryModel = forwardRef(({ onClose, name, metric, id }, ref) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [popperOption] = useState([
        { id: "Select All", name: "Select All" },
        { id: "Aggregation", name: "Aggregation" },
        { id: "Instrument", name: "Instrument" },
        { id: "Metric", name: "Metric" },
        { id: "Duration", name: "Duration" },
        { id: "Duration Type", name: "Duration Type" },
        { id: "Communication Channel", name: "Communication Channel" },
        { id: "Limits", name: "Limits" }
    ]);
    const [alarmHistory, setalarmHistory] = useState([])
    const { AlarmHistoryLoading, AlarmHistoryData, AlarmHistoryError, getAlarmHistory } = useAlarmHistory();
    const [ filteredHistory, setfilteredHistory] = useState([])

    useEffect(() => {
        if (!AlarmHistoryLoading && !AlarmHistoryError && AlarmHistoryData && AlarmHistoryData.length > 0) {
            setalarmHistory(AlarmHistoryData)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AlarmHistoryData])

    useEffect(()=>{
        if(id){
        getAlarmHistory(id)
        } else{
            getAlarmHistory('')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };

    function optionChange(e) {
        let filteredHistory
        if(e === "Select All"){
            filteredHistory = alarmHistory
        }else {
            filteredHistory = alarmHistory.filter(x => x.value === e);
            filteredHistory = filteredHistory.length > 0 ? filteredHistory : [{ action_time: '', user: '', action: 'No changes', value: '' }];
        }
        setfilteredHistory(filteredHistory);
    }

    function historydata(historyarr) {
        return (
            
        historyarr.map((val,index) => {
            if (val.action === 'i'){
                val.action = 'Created this alarm'
                val.value =''
            }
            if (val.action === 'u'){
                val.action = 'Updated this alarm'
            }
            if (val.action === 'd'){
                val.action = 'Deleted this alarm'
            }

            const valueMappings = {
                'check_aggregate_window_function': 'Aggregation',
                'name': 'Instrument',
                'insrument_metrics_id': 'Metric',
                'check_type': 'Duration',
                'check_last_n': 'Duration Type',
                'alert_channels': 'Communication Channel',
                'warn_value':'Limits',
                'critical_value':'Limits',
            };
            
            if (Array.isArray(val.value)) {
                val.value = val.value.map(item => {
                    if (valueMappings.hasOwnProperty(item)) {
                        return valueMappings[item];
                    } else {
                        return item;
                    }
                });
            } else {
                if (valueMappings.hasOwnProperty(val.value)) {
                    val.value = valueMappings[val.value];
                }
            }
            
            const isAlreadyFormatted = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s\d{4}\b/.test(val.action_time);
            
            if (!isAlreadyFormatted && val.action_time.length > 0 && typeof val.action_time === 'string') {
                const [time, datePart] = val.action_time.split(' - ');
                const [day, month, year] = datePart.split('/');
            
                const formattedDate = new Date(`${month}/${day}/${year} ${time}`);
            
                val.action_time = formattedDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                });
            }
            
            
            return (
                <ol key={index+1} style={{height:"60px"}} class="relative text-secondary-text border-l border-gray-200 top-5 flex dark:border-gray-700 dark:text-gray-400">
                    <li class="pb-5 pl-5  flex items-center">
                        <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 dark:bg-blue-200 rounded-full -left-4 ">
                            <History stroke={"#007BFF"} />
                        </span>
                       
                        <div class="font-medium leading-tight ml-1 font-geist-sans flex flex-col gap-2">
                           <TypographyNDL value={val.user + " " + val.action + " " + val.value} variant="label-01-s" />
                           <TypographyNDL value={val.action === 'No changes' ? "" : " on " + val.action_time} color="tertiary"  variant="paragraph-xs" />
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
                        <TypographyNDL id="entity-dialog-title" variant="heading-02-s" model value={t("Alarm Rule History")} />
                        <TypographyNDL value={`${name} - ${metric}`} variant="lable-01-s" color="tertiary" />
                    </div>
                    <div>
                        <div onClick={(e) => handleClick(e)} id="poppper">
                            <Filter />
                        </div>
                        <ListNDL
                            options={popperOption}
                            Open={open}
                            optionChange={(e) => optionChange(e)}
                            keyValue={"name"}
                            keyId={"id"}
                            id={"popper-Parts-history"}
                            onclose={handleClose}
                            anchorEl={anchorEl}
                            width="150px"
                        />
                    </div>
                </div>
            </ModalHeaderNDL>
            <ModalContentNDL>
            <div style={{ paddingLeft: "20px" }}>
  {(() => {
    let historyContent;

    if (filteredHistory.length > 0) {
      historyContent = historydata(filteredHistory);
    } else if (alarmHistory && alarmHistory.length > 0) {
      historyContent = historydata(alarmHistory);
    } else {
      historyContent = (
        <TypographyNDL value="Loading...." variant="label-01-s" color="tertiary" />
      );
    }

    return historyContent;
  })()}
</div>

            </ModalContentNDL>
            <ModalFooterNDL>
                <Button value={t('Close')} type={'secondary'} style={{ marginTop: 10, marginBottom: 10 }} onClick={onClose} />
            </ModalFooterNDL>
        </React.Fragment>

    )
});

export default HistoryModel;
