import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Typography from "components/Core/Typography/TypographyNDL";
import { useTranslation } from "react-i18next";
import useEnergyDay from "../../hooks/usegetEnergyDay";
import { energytype } from "recoilStore/atoms";
import { calcFormula } from 'components/Common/commonFunctions.jsx';
import common from "../../components/common";
import moment from "moment";
import TrendUp from 'assets/neo_icons/Dashboard/TrendUp.svg?react';
import TrendDown from 'assets/neo_icons/Dashboard/TrendDown.svg?react';





export default function WaterWasteCard(props){
    const { t } = useTranslation();
    const [last30days, setLast30Days] = useState(0);
    const [previous30days, setPrevious30Days] = useState(0);
    const [today, setToday] = useState(0)
    const [selectedenergytype] = useRecoilState(energytype)
    const [isCardsLoading, setIsCardsLoading] = useState(false)
    const { energydayLoading, energydayData, energydayError, getEnergyDay } = useEnergyDay();
    const [dayWaste,setdayWaste] = useState([])


    useEffect(()=>{
   console.log(last30days,previous30days,today,selectedenergytype,isCardsLoading,"last30days,previous30days,today,selectedenergytype,isCardsLoading")

    },[last30days,previous30days,today,selectedenergytype,isCardsLoading])

    useEffect(() => {
        if (!energydayLoading && energydayData && !energydayError) {
            let metrictype = 2
            let last30dayss = 0
            let previous30dayss = 0
            let todays = 0
            let daywiseData = [];
            // console.log(energydayData,"energydayData")

            energydayData.map((instrument) => {
                if (instrument.dayData && instrument.previousdayData) {
                    instrument.dayData.map((data, index) => {
                        let formula = instrument.vi.formula
                        const regex = /(\d+)\.(\w+)/g;
                        let match;
                        const result = [];
                        
                        while ((match = regex.exec(formula)) !== null) {
                            if (isNaN(Number(match[2]))) {
                            result.push({ iid: parseInt(match[1]), key: match[2] });
                            }
                        }

                        if (data.length > 0) {
                            addMissingIds(result, data);

                            data.map((val) => {
                                let total
                                if (metrictype === 2 && !val.offline) {
                                    total = val.endReading - val.startReading;
                                } else{
                                    total = val.value
                                } 
                                total = total === null ? 0 : total;
                                formula = formula.replaceAll(val.iid + "." + val.key, total)
                            })




                            formula = formula.replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll('--', '-');
                            last30dayss = last30dayss + parseInt(isFinite(calcFormula(formula)) && calcFormula(formula) >= 0 ? calcFormula(formula) : 0)
                            if (index === instrument.dayData.length - 1) {
                                todays = parseInt(isFinite(calcFormula(formula)) && calcFormula(formula) >= 0 ? calcFormula(formula) : 0)
                            }

                        }

                    })
                    instrument.previousdayData.map((data) => {
                        let formula = instrument.vi.formula
                        if (data.length > 0) {
                            data.map((val) => {
                                let total
                                if (metrictype === 2 && !val.offline) {
                                    total = val.endReading - val.startReading;
                                }else{
                                    total = val.value
                                } 
                                total = total === null ? 0 : total;
                                formula = formula.replaceAll(val.iid + "." + val.key, total)
                            })
                            formula = formula.replace(/[a-z0-9]+.totaliser/g, 0).replace('--', '-');
                            previous30dayss = previous30dayss + parseInt(isFinite(calcFormula(formula)) && calcFormula(formula) >= 0 ? calcFormula(formula) : 0)


                        }

                    })
                } 
                // console.log(instrument.selectedTime , instrument.dayData,"instrument.selectedTime && instrument.dayData")

                if(instrument.selectedTime && instrument.dayData){
                    instrument.dayData.map((data) => {
                        let formula = instrument.vi.formula
                        if (data.length > 0) {
                            data.map((val) => {
                                if (metrictype === 2 && !val.offline) var total = val.endReading - val.startReading;
                                else total = val.value
                                total = total === null ? 0 : total;
                                formula = formula.replaceAll(val.iid + "." + val.key, total)
                            })
                            console.log(data,"data")
                            daywiseData.push({ data: Number(isFinite(calcFormula(formula)) && calcFormula(formula) >= 0 ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
                        }

                    })

                }
                // console.log(daywiseData,"daywiseData")
                if(daywiseData.length > 0){
                    setdayWaste(daywiseData)
                }
                setLast30Days(last30dayss)
                setPrevious30Days(previous30dayss)
                setToday(todays)
                setIsCardsLoading(false)

            })


        } else if (energydayError) {
            setIsCardsLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energydayLoading, energydayData, energydayError])

    
    useEffect(() => {
        let range1 = common.Range(30, props.headPlant, {})
        let range2 = common.Range(60, props.headPlant, {})
        let range = common.Range(props.btGroupValue, props.headPlant,  props.customdatesval)
        let datess = common.getBetweenDates(moment(range[0]), moment(range[1]), 'day')
        let finalrequestarray = [{ "start": range1[0], "end": range1[1], "type": props.waterWastetypes, "metrics": props.waterWastemetrics, "instruments": props.waterWasteinstruments, "viid": props.WaterWasteval }]
        let dates = common.getBetweenDates(moment(range1[0]), moment(range1[1]), 'day')
        let previousdates = common.getBetweenDates(moment(range2[0]), moment(range2[1]), 'day')
        setIsCardsLoading(true)
        getEnergyDay(finalrequestarray, dates, previousdates)
        let finalrequestarraySelectedTime = [{ "start": range[0], "end": range[1], "type": props.waterWastetypes, "metrics": props.waterWastemetrics, "instruments": props.waterWasteinstruments, "viid": props.WaterWasteval}]
        getEnergyDay(finalrequestarraySelectedTime, datess, [],"",false,true)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant.id, props.energyassetval])

    function addMissingIds(idArray, dataArray) {
        const idSet = new Set(dataArray.map(item => parseInt(item.iid)));
        // console.log(idSet,keyset,"keysetkeyset")
    
        idArray.forEach(i => {
            // console.log( dataArray.findIndex(c=>c.key === i.key) >= 0,' dataArray.findIndex(c=>c.key === i.key) >= 0')
            if (!idSet.has(i.iid)) { 
                    dataArray.push({
                        "iid": i.iid.toString(),
                        "key": i.key.toString(),
                        "time": "", // Add appropriate default time if needed
                        "value": 0,
                        "startReading": 0, // Add appropriate default reading if needed
                        "endReading": 0,   // Add appropriate default reading if needed
                        "startTime": "", // Add appropriate default start time if needed
                        "endTime": "",   // Add appropriate default end time if needed
                        "name": ""
                    });
                 
              
            }
        });
    }
    
    
    return(
        <React.Fragment>
        <div className="py-2" style={{  display: "flex", alignItems: "center" }}>
            <Typography mono   variant="display-lg" value={(dayWaste.reduce((partialSum, x) => partialSum + x.data, 0)).toFixed(2) + "kL"} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant='paragraph-xs' color='secondary' value={t("Last 30 days")} />
        <Typography variant='paragraph-xs' color='secondary' value={t("Today")} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex" }}>
                <Typography  variant='paragraph-xs' mono value={Number(last30days).toFixed(2) + " kL"} />
                <Typography  variant='paragraph-xs'  style={{ marginLeft: "7px", color: previous30days > last30days ? 'green' : 'red' }}
                    value={((Math.abs((previous30days) - (last30days)) / (previous30days)) * 100).toFixed(2) + "%"} />
                {previous30days > last30days ? <TrendDown stroke="green" /> : <TrendUp stroke="red" />}
            </div>
            <Typography
                 variant='paragraph-xs' mono
                value={(today).toFixed(2) + " kL"}
            ></Typography>
        </div>
    </React.Fragment>
    )
}

