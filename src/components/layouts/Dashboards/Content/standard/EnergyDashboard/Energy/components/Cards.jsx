/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useTheme from 'TailwindTheme';
import Card from "components/Core/KPICards/KpiCardsNDL"
import Typography from "components/Core/Typography/TypographyNDL";
import configParam from "config";
import { useTranslation } from "react-i18next";

import TrendUp from 'assets/neo_icons/Dashboard/TrendUp.svg?react';
import TrendDown from 'assets/neo_icons/Dashboard/TrendDown.svg?react';
import common from "../../components/common";
import moment from "moment";

import useEnergyDay from "../../hooks/usegetEnergyDay";
import { calcFormula } from 'components/Common/commonFunctions.jsx';
import { energytype } from "recoilStore/atoms";
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import WaterWasteCard from "./WaterWasteCard";
import ElectricityIcon from 'assets/neo_icons/newUIIcons/Electricity.svg?react';

import Money from 'assets/neo_icons/newUIIcons/Money.svg?react';
import Co2Icon from 'assets/neo_icons/newUIIcons/Co2.svg?react';
import GasIcon from 'assets/neo_icons/newUIIcons/Gas.svg?react';
import WaterIcon from 'assets/neo_icons/newUIIcons/Water.svg?react';



import Grid from 'components/Core/GridNDL/index'
import Waterwaste from 'assets/neo_icons/newUIIcons/WaterWaste.svg?react';


function Cards(props) {
    const CO2_tag = configParam.CO2_tag
    const { t } = useTranslation();
    const theme = useTheme();
    const [last30days, setLast30Days] = useState(0);
    const [previous30days, setPrevious30Days] = useState(0);
    const [today, setToday] = useState(0)
    const [selectedenergytype] = useRecoilState(energytype)
    const [isCardsLoading, setIsCardsLoading] = useState(false)
    const { energydayLoading, energydayData, energydayError, getEnergyDay } = useEnergyDay();
    const [Co2,setCo2] =useState({Todayco2: CO2_tag,Last30co2 : CO2_tag, prev30co2: CO2_tag,rangeco2 : CO2_tag})

    const getCardName = () => {
        if(selectedenergytype === 1){
            return "Electricity"

        }else if(selectedenergytype === 2){
            return "Water"

        }else{
            return "Gas"
        }
       
    }

    useEffect(() => {
        if (!energydayLoading && energydayData && !energydayError) {
            let metrictype = 2
            let  last30dayss = 0
            let  previous30dayss = 0
            let  todays = 0
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
                                if (metrictype === 2 && !val.offline){
                                    total = val.endReading - val.startReading;
                                } else{
                                    total = val.value
                                } 
                                total = total === null ? 0 : total;
                                formula = formula.replaceAll(val.iid + "." + val.key, total)
                            })

                            formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll('--', '-');
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
                                if (metrictype === 2 && !val.offline){
                                    total= val.endReading - val.startReading;
                                }  else{
                                    total = val.value
                                } 
                                total = total === null ? 0 : total;
                                formula = formula.replaceAll(val.iid + "." + val.key, total)
                            })

                            formula = formula.replace(/[a-z0-9]+.kwh/g, 0).replace('--', '-');
                            previous30dayss = previous30dayss + parseInt(isFinite(calcFormula(formula)) && calcFormula(formula) >= 0 ? calcFormula(formula) : 0)


                        }

                    })
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
        let  range1 = common.Range(30, props.headPlant, {})
        let  range2 = common.Range(60, props.headPlant, {})
        let  finalrequestarray = [{ "start": range1[0], "end": range1[1], "type": props.energyassettypes, "metrics": props.energyassetmetrics, "instruments": props.energyassetinstruments, "viid": props.energyassetval }]
        let  dates = common.getBetweenDates(moment(range1[0]), moment(range1[1]), 'day')
        let  previousdates = common.getBetweenDates(moment(range2[0]), moment(range2[1]), 'day')
        setIsCardsLoading(true)
        getEnergyDay(finalrequestarray, dates, previousdates)
        // console.log(props.Co2Factor,"Co2FactorCo2Factor",range1,range2)
        let DefCo2 = props.Co2Factor.filter(d=> d.default_value)
        let Co2Default = DefCo2.length ? Number(DefCo2[0].co2_value) : CO2_tag
        let co2Today = Co2Default 
        let co2Last30 = Co2Default
        let co2prev30 = Co2Default
        let co2Range = Co2Default
        props.Co2Factor.map(c=> {
            if( (moment(range1[0]).isBetween(moment(c.starts_at), moment(c.ends_at)) || moment(range1[0]).isSame(c.starts_at)) && (moment(range1[1]).isBetween(moment(c.starts_at), moment(c.ends_at)) || moment(range1[0]).isSame(c.ends_at))){
                co2Last30 = Number(c.co2_value)
            }
            if( (moment(range2[0]).isBetween(moment(c.starts_at), moment(c.ends_at)) || moment(range2[0]).isSame(c.starts_at)) && (moment(range2[1]).isBetween(moment(c.starts_at), moment(c.ends_at)) || moment(range2[0]).isSame(c.ends_at))){
                co2prev30 = Number(c.co2_value)
            }
            if( (moment().startOf('day').isBetween(moment(c.starts_at), moment(c.ends_at)) || moment().startOf('day').isSame(c.starts_at)) && (moment().isBetween(moment(c.starts_at), moment(c.ends_at)) || moment().isSame(c.ends_at))){
                co2Today = Number(c.co2_value)
            }
            if( (moment(props.customdatesval.StartDate).isBetween(moment(c.starts_at), moment(c.ends_at)) || moment(props.customdatesval.StartDate).isSame(c.starts_at)) && (moment(props.customdatesval.EndDate).isBetween(moment(c.starts_at), moment(c.ends_at)) || moment(props.customdatesval.EndDate).isSame(c.ends_at))){
                co2Range = Number(c.co2_value)
            }
        })
        setCo2({Todayco2: co2Today,Last30co2 : co2Last30, prev30co2: co2prev30 ,rangeco2 : co2Range})
        // console.log(co2Today,co2Last30,co2prev30,"co2prev30co2prev30",co2Range)
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
                // }else{
                //     dataArray.push({
                //         "iid": i.iid.toString(),
                //         "key": dataArray[dataArray.length - 1].key.toString(),
                //         "time": "", // Add appropriate default time if needed
                //         "value": 0,
                //         "startReading": 0, // Add appropriate default reading if needed
                //         "endReading": 0,   // Add appropriate default reading if needed
                //         "startTime": "", // Add appropriate default start time if needed
                //         "endTime": "",   // Add appropriate default end time if needed
                //         "name": ""
                //     });
                // }
              
            }
        });
    }
    const renderConsumptionCards =()=>{

        if(isCardsLoading){
            return(
                <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
            )

        }else{
            return(
                <React.Fragment>
                            <div className='py-2' style={{display: "flex", alignItems: "center" }}>
                                <Typography variant="display-lg" mono value={(props.dataDay.reduce((partialSum, x) => partialSum + x.data, 0)).toFixed(0) + (selectedenergytype === 2 ? " kL" : selectedenergytype === 1 ?  " kWh" : ' kg')} />

                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant='paragraph-xs' color='secondary' value={t("Last 30 days")} />
                                <Typography variant='paragraph-xs' color='secondary' value={t("Average")} />
                                <Typography variant='paragraph-xs' color='secondary' value={t("Today")} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div style={{ display: "flex" }}>
                                    <Typography variant='paragraph-xs' mono
                                        value={Number(last30days).toFixed(0) + (selectedenergytype === 2 ? " kL" : selectedenergytype === 1 ?  " kWh" : ' kg')} />
                                    <Typography variant='paragraph-xs' mono  style={{ marginLeft: "7px", color: previous30days > last30days ? 'green' : 'red' }}
                                        value={((Math.abs(previous30days - last30days) / previous30days) * 100).toFixed(2) + "%"} />
                                    {previous30days > last30days ? <TrendDown stroke="green" /> : <TrendUp stroke="red" />}

                                </div>
                                <Typography variant='paragraph-xs' mono style={{marginRight: "25px" }}
                                    value={common.getAverage(props.dataDay.map(x => { return x.data }), (Math.round((props.duration / 3600) - 0.4) >= 1 && Math.round((props.duration / 3600) - 0.4) <= 24) ? Math.round((props.duration / 3600) - 0.4) : props.dataDay.map(x => { return x.data }).length).toFixed(2) + (selectedenergytype === 2 ? " kL" : selectedenergytype === 1 ?  " kWh" : ' kg')} />
                                <Typography variant='paragraph-xs' mono value={today.toFixed(0) + (selectedenergytype === 2 ? " kL" : selectedenergytype === 1 ?  " kWh" : ' kg')} />
                            </div>
                        </React.Fragment>
            )
        }
    }
    const renderPriceCards = ()=>{
        if(isCardsLoading){
return(
    <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
)
        }else{
            return(
                <React.Fragment>
                            <div className="py-2" style={{  display: "flex", alignItems: "center" }}>
                                <Typography style={{ opacity: props.price ? 1 : 0.4 }} variant="display-lg" mono 
                                    value={"₹ " + (props.price ? (props.dataDay.reduce((partialSum, x) => partialSum + x.data, 0) * props.price).toFixed(0) : "--")} />
                                {!props.price && <Typography className={{
                                    fontWeight: 600, position: "absolute", zIndex: 2,
                                    marginLeft: "30px", marginTop: "-20px", width: "25%"
                                }} value={t("Configure " + getCardName() + " Price Per Unit in Factors to view this Data")} />}
                            </div>

{
    props.price ?
    <React.Fragment>
 <div style={{ display: "flex", justifyContent: "space-between", opacity: props.price ? 1 : 0.4 }}>
                                <Typography variant='paragraph-xs' color='secondary' value={t("Last 30 days")} />
                                <Typography variant='paragraph-xs' color='secondary' value={t("Today")} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", opacity: props.price ? 1 : 0.4 }}>
                                <div style={{ display: "flex" }}>
                                    <Typography variant='paragraph-xs' mono
                                        value={"₹" + Number(last30days * props.price).toFixed(0)} />
                                    <Typography variant='paragraph-xs' mono style={{ marginLeft: "7px", color: previous30days > last30days ? 'green' : 'red' }} value={(props.price ? ((Math.abs((previous30days * props.price) - (last30days * props.price)) / (previous30days * props.price)) * 100).toFixed(2) : 0) + "%"} />
                                    {previous30days > last30days ? <TrendDown stroke="green" /> : <TrendUp stroke="red" />}
                                </div>
                                <Typography variant='paragraph-xs' mono value={"₹" + (today * props.price).toFixed(0)} />
                            </div>
    </React.Fragment>:
    <></>
}
                           
                        </React.Fragment>
            )
        }
    }

    const renderCO2Card =()=>{
        if(isCardsLoading){
          return(
            <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div> 
          )
        }else if(selectedenergytype === 2){
            return(
           <WaterWasteCard
           waterWastetypes={props.waterWastetypes}
           waterWasteinstruments={props.waterWasteinstruments}
           waterWastemetrics={props.waterWastemetrics}
           WaterWasteval={props.WaterWasteval}
           headPlant ={props.headPlant}
           dataDay= {props.dataDay}
           btGroupValue={props.btGroupValue}
           customdatesval={props.customdatesval}
           
           />
            )
        
        }else{
            return(
                <React.Fragment>
                 
                <div className="py-2" style={{  display: "flex", alignItems: "center" }}>
                    <Typography  mono variant="display-lg"  value={(props.dataDay.reduce((partialSum, x) => partialSum + x.data, 0)/1000 * Co2.rangeco2).toFixed(0) +  (selectedenergytype === 2 ? " kL" : selectedenergytype === 1 ?  " Tons CO2e" : ' kg')} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant='paragraph-xs' color='secondary' value={t("Last 30 days")} />
                    <Typography variant='paragraph-xs' color='secondary' value={t("Today")} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex" }}>
                        <Typography variant='paragraph-xs' mono value={Number(last30days/1000 * Co2.Last30co2).toFixed(0) +  (selectedenergytype === 2 ? " kL" : selectedenergytype === 1 ?  " Tons CO2e" : ' kg')} />
                        <Typography variant='paragraph-xs' mono style={{ marginLeft: "7px", color: previous30days > last30days ? 'green' : 'red' }}
                            value={((Math.abs((previous30days/1000 * Co2.prev30co2) - (last30days/1000 * Co2.Last30co2)) / (previous30days/1000 * Co2.prev30co2)) * 100).toFixed(2) + "%"} />
                        {previous30days > last30days ? <TrendDown stroke="green" /> : <TrendUp stroke="red" />}
                    </div>
                    <Typography
                       variant='paragraph-xs' mono
                        value={(today/1000 * Co2.Todayco2).toFixed(0) + (selectedenergytype === 2 ? " kL" : selectedenergytype === 1 ?  " Tons CO2e" : ' kg')}
                    ></Typography>
                </div>
            </React.Fragment>
            )
        }
    }

    return (

               <Grid container spacing={4} >
                        <Grid item sm={4} >
                        <Card style={{ height: "160px" }}  >
                {/* <div style={{
                    backgroundImage: selectedenergytype === 2 ? `url(${WaterConsumption})` :  selectedenergytype === 1 ?`url(${Power})` : `url(${GasConsumption})` ,
                    backgroundPosition: "right",
                    backgroundRepeat: "no-repeat",
                    height: "100%"
                }}> */}
                <div className="flex items-center justify-between">
                <div>
                <Typography  variant="label-01-s" color='secondary'
                        value={"Overall "}  />
                          <Typography  variant="label-01-s" color='secondary'
                        value={ getCardName() + " Consumption"}/>
                </div>
                   {
                    getCardName() === 'Electricity' &&
                    <ElectricityIcon  />
                   }
                     {
                    getCardName() === 'Water' &&
                    <WaterIcon  />
                   }
  {
                    getCardName() === 'Gas' &&
                    <GasIcon  />
                   }



                </div>
                    {renderConsumptionCards()}
                {/* </div> */}
            </Card>
                        </Grid>
                        <Grid item sm={4} >
                        <Card className={`${props.price ? undefined : " bg-overLay-bg dark:bg-[#aeaeae] bg-opacity-50 dark:bg-opacity-20"}`}  style={{ height: "160px"}}  >
              
                <div className="flex items-center justify-between">
                <div>
                <Typography  variant="label-01-s" color='secondary'
                        value={"Overall "}  />
                          <Typography  variant="label-01-s" color='secondary'
                        value={ getCardName() + " Price"}/>
                </div>
<Money />

                </div>
                    {renderPriceCards()}
                {/* </div> */}
            </Card>
                        </Grid>
                        <Grid item sm={4} >
                        <Card elevation={0} style={{ height: "160px"}}  >
                {/* <div style={{
                    backgroundImage: selectedenergytype === 2 ? `url(${Water})` :`url(${CO2})`,
                    backgroundPosition: "right",
                    backgroundRepeat: "no-repeat",
                    height: "100%"
                }}> */}
                <div className="flex items-center justify-between">
                <div>
                <Typography  variant="label-01-s" color='secondary'
                        value={"Overall "}  />
                          <Typography  variant="label-01-s" color='secondary'
                         value={selectedenergytype === 2 ? t("Water Wastage") :t("CO2 Emission")}/>
                </div>
                        {
                            selectedenergytype === 2 ?
                                <Waterwaste />
                                :
                                <Co2Icon />
                        }
                </div>
                    {renderCO2Card()}
                {/* </div> */}
            </Card>
                        </Grid>

                    </Grid>
            
            
           
    )
}

export default Cards;
