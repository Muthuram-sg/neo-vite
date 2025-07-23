import React from "react";
import Grid from 'components/Core/GridNDL'
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import RTU from 'assets/neo_icons/Settings/GateWayIcons/RTU.svg?react';
import TCP from 'assets/neo_icons/Settings/GateWayIcons/TCP.svg?react';
import TypographyNDL from "components/Core/Typography/TypographyNDL";





export default function Protocol(props){
    

    const handleProtocolChange=(type)=>{
        props.setprotocolName(type)
        props.setisProtocolpage(true)
        props.setpage(type)

    }

    const rtuConnection = props.connectionLength.find(x=>x.path === 'rtu') && Object.keys(props.connectionLength.find(x=>x.path === 'rtu')).length > 0 ? props.connectionLength.find(x=>x.path === 'rtu').lengths : 0 
    const tcpConnection =  props.connectionLength.find(x=>x.path === 'tcp') && Object.keys(props.connectionLength.find(x=>x.path === 'tcp')).length > 0 ? props.connectionLength.find(x=>x.path === 'tcp').lengths : 0

    return(
        <React.Fragment>
            <div className="p-4">
            <Grid container spacing={4}>
                <Grid xs={3}>
                    <KpiCards onClick={()=>handleProtocolChange("RTU")} style={{cursor:"pointer"}}>
                        <div className="flex gap-0.5 flex-col">
                        <RTU  />
                        <TypographyNDL value='RTU' variant="label-02-s" />
                        <TypographyNDL value={`${rtuConnection} connection`} variant="paragraph-xs" />
                        </div>
                        
                    </KpiCards>

                </Grid>
                <Grid xs={3}>
                <KpiCards onClick={()=>handleProtocolChange("TCP")} style={{cursor:"pointer"}}>
                        <div className="flex gap-0.5 flex-col">
                        <TCP />
                        <TypographyNDL value='TCP/IP' variant="label-02-s" />
                        <TypographyNDL  value={`${tcpConnection} connection`}  variant="paragraph-xs" />
                        </div>
                        
                    </KpiCards>
                </Grid>


            </Grid>
            </div>
           
            
        </React.Fragment>
    )
}