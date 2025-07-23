
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import useCorrelationMatrix from "./useCorrelationMatrix";
import Typography from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next';
import { corrcolour } from "./constants";
import { instrumentsList } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';



const Correlogram = (props) => {


    const { correlationLoading, correlationData, correlationError, getCorrelationMatrix } = useCorrelationMatrix()
    const [lb, setLb] = useState([])
    const { t } = useTranslation();
    const [instruments] = useRecoilState(instrumentsList);
    let labels = []
    let data = []
    let sep_labels = []

    useEffect(() => {
      let keys = Object.keys(props.meta.metric[0])
        keys.forEach((x) => props.meta.metric[0][x]?.metric.map((z) => {labels.push(`${z.split('-')[1]}(${instruments.filter((z) => z.id === props.meta.metric?.[0][x].instrument)?.[0]?.name})`); sep_labels.push(`${props.meta.metric?.[0][x].instrument}-${z.split('-')[0]}`)}))
        setLb(labels)
        if(props.meta?.metric?.length > 0){
          getCorrelationMatrix({data: props.data, label: sep_labels})
        }
    }, [props.data])



    return (
      correlationError && !correlationLoading
      ? 
        <div style={{ textAlign: "center"}}>
          <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
          <Typography value={"Frequency / Data availability of Selected Metrics are not Equal"} variant= "Caption1" />
        </div> 
      :
      correlationData?.flat().filter((z) => (z !== null && !isNaN(z))).length > 0 ?
      correlationData ? 
      <div style={{ height: '100%', overflowY:'auto',scrollbarWidth: 'none'}}>
        <Plot
      data={[
        {
          z: correlationData,
          x: lb,
          y: lb,
          type: "heatmap",
        
          zmin: -1,         
          zmax: 1,          
          colorscale : corrcolour[props.meta.colour],
          colorbar: {
            orientation: "h", 
            x: 0.5,           
            xanchor: "center", 
            y: -0.6,          
          },
        },
      ]}

      layout={{
        autosize: true,
        yaxis: {
          automargin: true,
        }
      }}
      
      config={{
        displayModeBar: false, 
      }}
      style={{ width: "100%", height: "100%" }}
    />
    </div>
     : 
    <div style={{ textAlign: "center"}}>
                <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
                <Typography value={t("EditORReload")} variant= "Caption1" />
            </div>
            :
            <div style={{ textAlign: "center"}}>
                <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
                <Typography value={"Frequency / Data availability of Selected Metrics are not Equal"} variant= "Caption1" />
            </div>
      );
}

export default Correlogram;