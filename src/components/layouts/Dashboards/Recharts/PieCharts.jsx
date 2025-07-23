import React, { useState } from 'react';
import { PieChart, Pie,Cell,Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'; 
import Typography from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next';


  function CustomLabel({viewBox}){
    const {cx, cy} = viewBox;
    return (
     <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
        <tspan alignmentBaseline="middle" fontSize="15">100%</tspan>
        {/* <tspan fontSize="14">{value2}</tspan> */}
     </text>
    )
  }

  const CustomTooltip = ({ active, payload, ...props }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      console.log(payload, props, "\n+++++______\n")
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p>{`${name}: ${props.decimal !== 'none' ? Number(value).toFixed(props.decimal) : value} `}</p>
          {/* <p>{`Value: ${value}`}</p> */}
          {/* <p>{`Percentage: ${(percent * 100).toFixed(1)}%`}</p> */}
        </div>
      );
    }
    return null;
  };


const PieCharts =({data,width,height,type, meta})=>{ 
  const [LegendH,setLegendH]=useState(0)
  // console.log(data,"pieData",data.chartHeight)
    const { t } = useTranslation();
//     let COLORS = [
//    "#EF5F00",
// "#208368",
// "#74DAF8",
// "#654DC4",
// "#5151CD",
// "#0588F0",
// "#DC3E42",
// "#FFBA18",
// "#46A758",
// "#FFDC00",
// "#CF3897",
// "#3358D4",
// "#0797B9",
// "#A144AF",
// "#8347B9",
// "#DD4425",
// "#B0E64C",
// "#DF3478",
// ]
      let COLORS = [
"#FFDC00",
"#FFBA18",
"#EF5F00",
"#DC3E42",
"#0588F0",
"#3358D4",
"#8347B9",
"#B0E64C",
"#3E9B4F",
"#7DE0CB",
"#0797B9",
"#74DAF8"

]

const CustomLegend = (data) => {
  setLegendH(data.chartHeight)
  // console.log(data)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {data?.payload.map((entry) => (
        <div
          key={`item-${entry.value}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '10px',
            padding: '5px',
          //   backgroundColor: '#f0f0f0', // Set the icon background color here
            borderRadius: '4px',
          }}
        >
          <svg width="10" height="10" style={{ marginRight: '5px' }}>
            <circle cx="5" cy="5" r="5" fill={entry.color} /> {/* Icon shape and color */}
          </svg>
          <div style={{width: (data.width/2 - 70)+'px'}}>
            <p style={{overflow: 'hidden',
                      whiteSpace: 'pre-wrap',
                      textOverflow: 'ellipsis'}} 
                      className='text-Text-text-primary dark:text-Text-text-primary-dark'> 
                      {entry.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
    

    // const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ value,cx, cy, midAngle, innerRadius, outerRadius, percent, index,...props }) => {
      // const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      // const x = cx + radius * Math.cos(-midAngle * RADIAN);
      // const y = cy + radius * Math.sin(-midAngle * RADIAN);
      const RADIAN = Math.PI / 180;
      // Calculate coordinates outside the outer radius
      const radius = outerRadius + 20; // distance beyond the pie
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
    // console.log(props.decimal,".toFixed(props.decimal)")
      return (
        <text x={x} y={y} fill="#000000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {meta?.showLabel ? `${props.decimal && (props.decimal !== 'none') ? Number(value).toFixed(props.decimal) : Number(value).toFixed(1)}` : ''}
        </text>
      );
    };

    const samdata = [
      { name: 'Item 1', value: 1038 },
      { name: 'Item 2', value: 1038 },
      { name: 'Item 3', value: 1038 },
      { name: 'Item 4', value: 1038 },
      { name: 'Item 5', value: 1038 },
      { name: 'Item 6', value: 1038 },
      { name: 'Item 7', value: 1038 },
      { name: 'Item 8', value: 1038 },
      { name: 'Item 9', value: 1038 },
    ];
    

   const renderPieChart = ()=>{
    let pieradius = width > 500 ? 80 : 60
    if(type === 'donut'){
    return (
        <Pie dataKey="value" fill="#007BFF" data={data} 
        innerRadius={'70%'}
        outerRadius={'90%'}
        // label
        > 
        <Label width={30} position="center"
            content={<CustomLabel/>}>
        </Label>
        {data.map((entry, index) => (
        <Cell key={`cell-${entry.id || index}`} fill={COLORS[index % 12]} />
        ))}

        </Pie> 
    )
    }else{
        return(
            
            <Pie 
              dataKey="value" 
              fill="#007BFF"
              data={data}  
              cx="50%"   // shift pie to the left
              cy="50%"
              outerRadius={meta?.showLabel ? pieradius : 100} 
              labelLine={meta?.showLabel ? true : false}
              label={renderCustomizedLabel}
            > 
            {data.map((entry, index) => (
            <><Cell key={`cell-${entry.id || index}`} fill={COLORS[index % 12]}  />
            {/* <Label position={"inside"}>2</Label> */}
            </>
            ))} 
            </Pie> 
        )
    }
   }
    return( 
        (data.length > 0) ?
        // <div style={{ minWidth: '290px', minHeight: '325px'}}>
        <ResponsiveContainer width="100%" height={'100%'} style={{ overflow: 'auto'}}>
            <PieChart width={width} height={height}> 
                {renderPieChart()}            
                <Tooltip content={<CustomTooltip decimal={meta.decimalPoint}/>}/>
                {width > 300 &&
                <Legend  
                  layout="vertical"        // vertical list
                  verticalAlign="top"   // middle of the chart vertically
                  align="right"            // right side of the chart horizontally
                  wrapperStyle={{
                    position: 'absolute',   
                    overflowY: 'auto',
                    right:0,
                    maxHeight: (LegendH - 9)
                  }}
                content={<CustomLegend data={data} width={width}/>}
                
                // verticalAlign="bottom" iconSize={14} iconType="circle"
                /> }
            </PieChart>  
            
        </ResponsiveContainer>
        
        // </div>
        :
            <div style={{ textAlign: "center"}}>
                <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
                <Typography value={t("EditORReload")} variant= "Caption1" />
                    
                
            </div>
        
    )
} 
export default PieCharts;