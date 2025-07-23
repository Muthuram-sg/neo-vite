import TypographyNDL from "components/Core/Typography/TypographyNDL";
import React  from "react";
import '../index.css';

const ThermoMeter = (props) => {
    console.log("PROPS - ", props)
    const getUnit = () => {
        switch(props.meta.unit){
            case 'celcius':
                return `C`
            case 'farenheit':
                return `F`
            case 'kelvin':
                return `K`
        }
    }

    const convertTemperature = (value, toUnit, fromUnit = 'celcius') => {
        let celsius;

        console.log(fromUnit, toUnit)
    
        // Convert the input temperature to Celsius first
        if (fromUnit?.toLowerCase() === 'celcius') {
            celsius = value;
        } else if (fromUnit?.toLowerCase() === 'farenheit') {
            celsius = (value - 32) * 5/9;
        } else if (fromUnit?.toLowerCase() === 'kelvin') {
            celsius = value - 273.15;
        } else {
            return 0;
        }
    
        // Now convert Celsius to the desired output unit
        if (toUnit?.toLowerCase() === 'celcius') {
            return celsius;
        } else if (toUnit?.toLowerCase() === 'farenheit') {
            return (celsius * 9/5) + 32;
        } else if (toUnit?.toLowerCase() === 'kelvin') {
            return celsius + 273.15;
        } else {
            return 0;
        }
    }

    const getHeight = () => {
        return ((props.data?.[props?.data?.length-1]?.value/parseInt(props.meta.maxTemp))*100)
    }


    return (
        <div style={{ height: '100%', overflowY:'auto',scrollbarWidth: 'none'}}>
        <div style={{ margin: 'auto', width:'70%', paddingTop: '10px', height: '250px', overflowX: 'auto', overflowY: 'auto', scrollbarWidth: 'none'}}>
            {
                props.data.length > 0 ? 
        <div class="tg-thermometer" style={{height: "95%"}}>
          <div class="draw-a"></div>
          <div class="draw-b"></div>
          <div class="meter">
            <div class="statistics">
              <div class="percent percent-a">{convertTemperature(parseFloat(props.meta.maxTemp), props.meta.unit, props.meta.currentUnit) +`\u00B0`}{getUnit()}</div>
              <div class="percent percent-b">{convertTemperature((parseFloat(props.meta.maxTemp)/4)*3, props.meta.unit, props.meta.currentUnit)+`\u00B0`}{getUnit()}</div>
              <div class="percent percent-c">{convertTemperature(parseFloat(props.meta.maxTemp)/2, props.meta.unit, props.meta.currentUnit)+`\u00B0`}{getUnit()}</div>
              <div class="percent percent-d">{convertTemperature(parseFloat(props.meta.maxTemp)/4, props.meta.unit, props.meta.currentUnit)+`\u00B0`}{getUnit()}</div>
              <div class="percent percent-e">{convertTemperature(parseFloat(0), props.meta.unit, props.meta.currentUnit)+`\u00B0`}{getUnit()}</div>
            </div>
            <div class="mercury" style={{height: `${getHeight()}%`}}>
              <div class="percent-current">{convertTemperature (props.data?.[props?.data?.length-1]?.value, props.meta.unit, props.meta.currentUnit)?.toFixed(2)+`\u00B0`}{getUnit()}</div>
              <div class="mask">
                <div class="bg-color"></div>
              </div>
            </div>
          </div>
        </div>
        :
        <TypographyNDL variant={'label-01-s'} color={"tertiary"}  >No Data found for this Instrument</TypographyNDL>
    }
        </div>
        </div>
    )
}

export default ThermoMeter;