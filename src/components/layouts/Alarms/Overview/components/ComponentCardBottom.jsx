import React from 'react';
import LineChart from 'assets/neo_icons/Alarms/LineChart.svg?react';
import User from 'assets/user_new.svg?react';
import InstrumentIcon from 'assets/neo_icons/Alarms/Instrument.svg?react';
import VirInstrumentIcon from 'assets/neo_icons/Alarms/VirtualInstrument.svg?react';
import AssetIcon from 'assets/neo_icons/Alarms/Vector.svg?react';
import Vector from 'assets/neo_icons/Equipments/702.svg?react';
import Typography from "components/Core/Typography/TypographyNDL";
import { useRecoilState } from "recoil";
import {  themeMode } from "recoilStore/atoms";



function ComponentCardBottom(props) {
        const [CurTheme] = useRecoilState(themeMode);
    

    return (
        <div className='bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark' style={{ display: "flex", justifyContent: "space-between",  height:"32px", borderRadius:"8px", padding:"8px" }}>
            <div style={{ display: "flex", alignItems: "center"}}>
                {
                    props.entityName &&
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {props.type !== 'tool' ? <AssetIcon stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={16} height={16}/> : <Vector stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={16} height={16}/>}
                        <Typography variant="paragraph-xs"   value={props.entityName}
                            style={{ margin: 10 }}></Typography>
                        {props.type !== 'downtime' && props.type !== 'tool' &&
                        <div className='text-Border-border-100 dark:text-Border-border-dark-100 mr-2' >|</div>}
                    </div>
                }
                {
                    props.instrumentName &&
                    <div style={{ display: "flex", alignItems: "center", }}>
                        {
                            (props.info.virtualInstrumentId === "" || props.info.virtualInstrumentId === null) ? <InstrumentIcon  stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} width={16} height={16} /> : <VirInstrumentIcon stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'}  width={16} height={16} />
                        }

                        <Typography variant="paragraph-xs"   value={props.info ? props.info.instrument_name : props.instrumentName}
                            style={{ margin: 10 }}></Typography>
                        { !props.info.connectivity_id &&
                            <div className='text-Border-border-100 dark:text-Border-border-dark-100 ml-2' >|</div>
                        }
                    </div>
                }
                {
                    props.info.metricName && props.type !== 'downtime' && props.type !== 'tool' &&
                    <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                        <LineChart stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} />
                        <Typography variant="paragraph-xs"   value={props.info.metricName}
                            style={{ margin: 10 }}></Typography>
                    </div>
                }

            </div>
            {
                props.info.acknowledgeByName &&
                <div style={{ display: "flex", alignItems: "center" }}>
                    <User stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} style={{ width: "16px", height: "16px" }} />
                    <Typography variant="lable-01-m" value={props.info.acknowledgeByName}
                        style={{ margin: 10 }}></Typography>
                </div>
            }
            
        </div>
    )
}
export default ComponentCardBottom;