import React, { useState,useEffect } from 'react';
import Charts from 'components/Charts_new/Chart'
import Typography from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import {  microStopDuration, stdDowntimeAsset } from 'recoilStore/atoms';
import useReasonTags from "components/layouts/Settings/Production/Reasons/hooks/useReasonTags.jsx";
import useReasons from "components/layouts/Settings/Production/Reasons/hooks/useReasons.jsx";
import useAssetOEE from "../../../Reports/DowntimeReport/hooks/useAssetOEE";

import moment from 'moment';

const ParetoCharts = ({data, meta}) => {

    // console.clear()
    
    const { outGRLoading, outGRData, outGRError, getReasons } = useReasons();
    const {  AssetOEEConfigsofEntityData,  getAssetOEEConfigsofEntity } = useAssetOEE();
    const { ReasonTagsListData } = useReasonTags()


    let AssetListOEE = [];
    const { t } = useTranslation();

    const [reasonsList, setReasonsList] = useState([])
    const [overviewXval, setOverviewX] = useState([]);
    const [overviewYval, setOverviewY] = useState([]);
    const [isShowShift, setIsShowShift] = useState(false);


    const [downtimeAsset] = useRecoilState(stdDowntimeAsset);
    const [showMicroStop,] = useRecoilState(microStopDuration);

    useEffect(() => {
        getReasons();
        getAssetOEEConfigsofEntity(meta.asset);

    }, [])

    useEffect(() => {
        if (!outGRLoading && !outGRError && outGRData) {

            if (outGRData) {
                setReasonsList(outGRData)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outGRLoading, outGRData, outGRError])



    const convertTosignalOverview = (data) => {

        let overviewx = [];
        let timeY = [];
        let mttrData = [];
    
        data.length > 0 && data.map(x => {
    
            const reason = x.reason ? (reasonsList.length > 0 && reasonsList.filter(y => Number(x.reason === y.id))) : [];
    
            const reasonname = reason.length > 0 ? reason[0].reason : "Others";
            const index = overviewx.findIndex(y => y === reasonname);
    
            const total = x.totalMins;
    
    
            if (index >= 0) {
                let exist = timeY[index];
                let totalVal = exist + total;
                timeY[index] = Number(totalVal);
                const mttfIndex = mttrData.findIndex(val => val.reason === reasonname);
                mttrData[mttfIndex]["total"] = totalVal;
                mttrData[mttfIndex]["reason"] = reasonname;
                mttrData[mttfIndex]["count"] = parseInt(mttrData[mttfIndex].count) + parseInt(1);
                mttrData[mttfIndex]["avg"] = totalVal / mttrData[mttfIndex]["count"];
    
            } else {
    
                overviewx.push(reasonname);
                timeY.push(Number(total));
                let datas = { "total": total, "count": 1, "reason": reasonname, "avg": total / 1 }
                mttrData.push(datas)
            }
    
        })
    
        mttrData.sort((a, b) => b.total - a.total)
    
        const totalTime = timeY.reduce((a, b) => a + b, 0)
    
        const timePercent = timeY.map(x => parseFloat((x / totalTime) * 100).toFixed(2));
    
        timeY.sort((a, b) => b - a)
        timePercent.sort((a, b) => b - a)
    
        const lineObj = { type: 'line', data: timePercent, color: '#66B0FF' };
        const columnObj = { type: 'column', data: timeY, color: '#66B0FF' };
        const overviewY = [lineObj, columnObj];
    
        const reasons = mttrData.map(item => item.reason);
        console.log(reasons, overviewY)
        setOverviewX(reasons);
        setOverviewY(overviewY);
       
    }

   

    const processSignalResult = (data) => {

        return data.map(x => {


            const asset = AssetListOEE.filter(y => Number(y.machine_status_signal_instrument) === Number(x.iid) && y.entity.id === downtimeAsset)
            const start = moment(x.time).subtract(moment(x.time).isDST() ? 1 : 0, 'hour');
            const end = moment(x.next).subtract(moment(x.next).isDST() ? 1 : 0, 'hour');

            const reason = x.reason ? reasonsList.filter(y => Number(x.reason === y.id)) : [];
            const total = (((new Date(x.next).getTime() - new Date(x.time).getTime()) / 1000) / 60).toFixed(2);

            let time = parseInt(moment.duration(moment(end).diff(moment(start))).asSeconds());
            if (x.reason) {
                x['finalTime'] = time
                x['totalMins'] = Number(total);
                x['entity_id'] = asset.length > 0 ? asset[0].entity.id : ''
                x['asset'] = asset.length > 0 ? asset[0].entity.name : '';
                x['reason_tags'] = x.reason_tags ?
                    (Array.isArray(x.reason_tags) ?
                        x.reason_tags.map((val) => {
                            if (typeof val === 'object') {
                                if (isShowShift) {
                                    let index = ReasonTagsListData?.findIndex(item => item.id === val.id)
                                    if (index >= 0) return val
                                    else return { "id": -1, "reason_tag": '' }
                                } else {
                                    let index = ReasonTagsListData?.findIndex(item => item.id === val.id)
                                    if (index >= 0) return { "id": val.id, "reason_tag": ReasonTagsListData[index].reason_tag }
                                    else return { "id": -1, "reason_tag": '' }
                                }
                            } else {
                                let index = ReasonTagsListData?.findIndex(item => item.id === val)
                                if (index >= 0) return { "id": val, "reason_tag": ReasonTagsListData[index].reason_tag }
                                else return { "id": -1, "reason_tag": '' }
                            }
                        })
                        : [{
                            "id": x.reason_tags.id,
                            "reason_tag": ReasonTagsListData?.find(item => item.id === x.reason_tags.id)?.reason_tag || ''
                        }])
                    : [{ "id": -1, "reason_tag": '' }];


            } else {

                x['finalTime'] = time
                x['totalMins'] = Number(total);
                x['entity_id'] = asset.length > 0 ? asset[0].entity.id : ''
                x['asset'] = asset.length > 0 ? asset[0].entity.name : '';
                x['reason_name'] = reason.length > 0 ? reason[0].reason : "Others";
                x['reason_type'] = reason.length > 0 ? reason[0].prod_reason_type.id : "Others";
                x['reason_type_name'] = reason.length > 0 ? reason[0].prod_reason_type.reason_type : "Others";
                x['reason_id'] = reason.length > 0 ? reason[0].id : "Others";
                x['reason_tags'] = [{ "id": -1, "reason_tag": '' }]
                x['comments'] = ''
                x['outage_id'] = ''


            }

            return x;
        })
    }

    useEffect(() => {
        if (data) {

            if (data.length > 0) {
                let Dataopt = []
                if (data[0].Count > 0) {
                    for (let i = 0; i < Number(data[0].Count); i++) {
                        Dataopt.push({ id: i + 1, name: "Dataset" + (i + 1), pageIndex: i })
                    }
                 

                }
                let downtimeTable = [];
                let micmax = AssetOEEConfigsofEntityData[0] ? AssetOEEConfigsofEntityData[0].mic_stop_duration : 0
                let micmin = AssetOEEConfigsofEntityData[0] ? AssetOEEConfigsofEntityData[0].min_mic_stop_duration : 0
                for (let i of data) {
                    if (i.raw && i.raw.length > 0) {
                        const statusSignal = AssetOEEConfigsofEntityData[0] && AssetOEEConfigsofEntityData[0].is_status_signal_available ? AssetOEEConfigsofEntityData[0].is_status_signal_available : true;
                        let activeFiltered = [];
                        if (statusSignal) {
                            activeFiltered = i.raw.filter(x => x.value !== 'ACTIVE');
                        } else {
                            activeFiltered = i.raw;
                        }

                        const process = processSignalResult(activeFiltered);
                        convertTosignalOverview(showMicroStop ? process : process.filter(x => x.finalTime >= micmax));

                        downtimeTable.push(...showMicroStop ? process : process.filter(x => x.finalTime >= micmax))
                       
                    }
                    else {
                    
                  
                        setOverviewY([])
                    }
                }

      
            } 

        }

    }, [data]);



    return (
        <React.Fragment> 
            {
                data.length > 0 
                ?  
                    <div style={{ height: '100%', overflowY:'auto',scrollbarWidth: 'none'}}>
                    <Charts
                        height={345}
                        id={"trendChart"} 
                        type={"areaChart"}
                        data={ overviewYval}
                        xaxisval={ overviewXval}
                        xaxistype={""}
                        annotations={null}
                        rotate={'-25'} 
                        showTools={false}
                    /> 
                    </div>
                :
                    <div style={{ textAlign: "center"}}>
                        <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
                        <Typography value={t("EditORReload")} variant= "Caption1" />
                    </div>                             
            }
        </React.Fragment>
    )
}

export default ParetoCharts