import React from 'react';
import Card from "components/Core/KPICards/KpiCardsNDL";
import moment from 'moment'; 
import Grid from 'components/Core/GridNDL'

function ExecutionStatus(props){ 
     
    return(
        <Card >
            <div >
                <Grid container spacing={8} >
                    <Grid item sm={12}>
                    <div style={{display: 'flex',justifyContent: 'space-evenly'}}>

                        <Grid item sm={12} xs={3}>
                        <div
                        style={{display: 'inline-flex',border: '1px solid #E0E0E0',borderRadius: 4,height:"40px"}}
                         >
                        <div className='p-2 pr-8' style={{background: '#F4F4F4'}}>
                            <p className='text-center' style={{fontWeight:600,fontSize:"16px",lineHeight:"24px",color:"#161616"}}>Execution Started</p>
                        </div>
                        <div class="border-r  h-full" style={{color:"#E0E0E0"}}></div>
                        <div  className='p-2 ' style={{color:"#ffffff"}}>
                            <p className='text-center' style={{fontWeight:400,fontSize:"16px",lineHeight:"22px",color:"#525252"}}>
                                {props.executionDetails && props.executionDetails.jobStart?`${moment(props.executionDetails.jobStart).format("HH:mm ")} | ${moment(props.executionDetails.jobStart).format("DD-MM-YYYY")}`:"--"} 
                            </p>
                        </div>
                    </div>
                            </Grid>
                    <Grid item sm={12} xs={3}>
                    <div   style={{display: 'inline-flex',border: '1px solid #E0E0E0',borderRadius: 4,height:"40px"}}>
                        <div className='p-2 pr-8' style={{background: '#F4F4F4'}}>
                            <p className='text-center'  style={{fontWeight:600,fontSize:"16px",lineHeight:"24px"}}>Execution Ending</p>
                        </div>
                        <div class="border-r  h-full" style={{color:"#E0E0E0"}}></div>
                        <div className='p-2 ' style={{color:"#ffffff"}}>
                            <p className='text-center' style={{fontWeight:400,fontSize:"16px",lineHeight:"22px",color:"#525252"}}>
                            {props.executionDetails && props.executionDetails.jobEnd?`${moment(props.executionDetails.jobEnd).format("HH:mm ")} | ${moment(props.executionDetails.jobEnd).format("DD-MM-YYYY")}`:"--"} 
                            </p>
                        </div>
                    </div>
                    </Grid>
                    <Grid item sm={12} xs={3}>
                    <div style={{display: 'inline-flex',border: '1px solid #E0E0E0',borderRadius: 4,height:"40px"}}>
                        <div className='p-2 pr-8 ' style={{background: '#F4F4F4'}}>
                            <p className='text-center' style={{fontWeight:600,fontSize:"16px",lineHeight:"24px"}}>Work Order ID</p>
                        </div>
                        <div class="border-r  h-full" style={{color:"#E0E0E0"}}></div>
                        <div className='p-2 ' style={{color:"#ffffff"}}>
                            <p className='text-center' style={{fontWeight:400,fontSize:"16px",lineHeight:"22px",color:"#525252"}}>
                            {props.executionDetails && props.executionDetails.orderid?props.executionDetails.orderid:"--"} 
                            </p>
                        </div>
                    </div>
                    </Grid>
                    <Grid item sm={12} xs={3}>
                    <div  style={{display: 'inline-flex',border: '1px solid #E0E0E0',borderRadius: 4,height:"40px"}}>
                        <div className='p-2 pr-8' style={{background: '#F4F4F4'}}>
                            <p className='text-center'  style={{fontWeight:600,fontSize:"16px",lineHeight:"24px"}}>Operator ID</p>
                        </div>
                        <div class="border-r  h-full" style={{color:"#E0E0E0"}}></div>
                        <div className='p-2 ' style={{color:"#ffffff"}}>
                        <p className='text-center'  style={{fontWeight:400,fontSize:"16px",lineHeight:"22px",color:"#525252"}}>
                            {props.executionDetails && props.executionDetails.operator?props.executionDetails.operator:"--"} 
                            </p>
                        </div>
                    </div>
                    </Grid>
                   
                   
                  
                </div>
                    </Grid>

               
                </Grid>
            </div>
        </Card>
    )
}
export default ExecutionStatus;