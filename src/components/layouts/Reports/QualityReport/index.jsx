/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useRef } from 'react'; 
import Grid from 'components/Core/GridNDL'
import Piechart from 'components/layouts/Reports/QualityReport/components/piechart'
import Chartdata from 'components/layouts/Reports/QualityReport/components/chartdata'
import Tabledata from 'components/layouts/Reports/QualityReport/components/Tabledata'

export default function QualityReport() {   
    
    const piechartRef = useRef();
    const chartRef = useRef();
    const refreshData = ()=>{
        piechartRef.current.refreshData()
        chartRef.current.refreshData();
    }
    return (
        <div className='p-4'>
            <Grid container >
                <Grid item xs={4} >
                <Piechart ref={piechartRef}/>
                </Grid>
                <Grid item xs={8} >
                <Chartdata ref={chartRef}/>   
                </Grid>
                <Grid item xs={12} >
                <Tabledata refresh={refreshData}/>                   
                </Grid>
            </Grid>
        </div>
    )
}
