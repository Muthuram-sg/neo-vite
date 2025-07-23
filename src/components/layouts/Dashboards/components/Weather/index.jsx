
import React, { useState, useEffect } from "react";
import Cloudy from './assets/Cloudy.svg?react';
import Sunny from './assets/Sunny.svg?react';
import Rainy from './assets/Rainy.svg?react';
import PartiallyCloudy from './assets/PartiallyCloudy.svg?react';
import Snowy from './assets/Snowy.svg?react';
import ThunderStrom from './assets/ThunderStrom.svg?react';
import '../index.css';
import TooltipNDL from "components/Core/ToolTips/TooltipNDL";

const Weather = (props) => {


    const [data, setData] = useState()
    const [filterData, setFilterData] = useState()
    const [weatherData, setWeatherData] = useState({})

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading 0 if necessary
        const day = String(date.getDate()).padStart(2, '0'); // Add leading 0 if necessary
        return `${year}-${month}-${day}`;
    }

    const getNextFiveDates = () => {
        const dates = [];
        const today = new Date();
        
        for (let i = 0; i < 5; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i);
            dates.push(formatDate(nextDate)); // Push the formatted date
        }
        
        return dates;
    }

    const iterateDate= getNextFiveDates()

    const getValues = (passdata) => {
        // console.log(passdata)
        // console.log(filterData?.[passdata])
        let sum = 0
        filterData?.[passdata]?.map((acc) => {
            // console.log(acc, cum)
            sum = acc?.temp + sum
        })
        return { average: sum/filterData?.[passdata]?.length, weather: filterData?.[passdata]?.[filterData?.[passdata]?.length - 1]?.weather}
    }

    const getDayName = (date) => {
        let y = new Date(date?.toString())
        let h = y.getDay()
        console.log(y , h)
        switch (h) {
            case 0:
                return 'Sunday'
            case 1:
                return 'Monday'
            case 2:
                return 'Tuesday'
            case 3:
                return 'Wednesday'
            case 4:
                return 'Thursday'
            case 5:
                return 'Friday'
            case 6:
                return 'Saturday'
            default:
                break;
        }
    }

    const getIcons = (data) => {
        console.log(data)
        switch (data) {
            case 'Mist':
                return <TooltipNDL title={data} placement="right" arrow><Cloudy/></TooltipNDL>
            case 'Rain':
                return <TooltipNDL title={data} placement="right" arrow><Rainy /></TooltipNDL>
            case 'Thunderstorm':
                return <TooltipNDL title={data} placement="right" arrow><ThunderStrom/></TooltipNDL>
            case 'Drizzle':
                return <TooltipNDL title={data} placement="right" arrow><Rainy/></TooltipNDL>
            case 'Snow':
                return <TooltipNDL title={data} placement="right" arrow><Snowy/></TooltipNDL>
            case 'Clear':
                return <TooltipNDL title={data} placement="right" arrow><Sunny/></TooltipNDL>
            case 'Clouds':
                return <TooltipNDL title={data} placement="right" arrow><PartiallyCloudy/></TooltipNDL>
            default:
                return <TooltipNDL title={data} placement="right" arrow><Sunny/></TooltipNDL>
        }
    }
    

    useEffect(() => {
        (async () => {
            let url = "https://api.openweathermap.org/data/2.5/forecast?q=" + props.meta.location + "&units=metric&appid=47fd245736ab4d7ed57d79abb247fbb7";
            await fetch(url, {
              method: 'GET',
              redirect: 'follow'
            })
              .then(response => response.json())
              .then(result => {
                setData(result?.list?.map((x) => {
                    return {
                        date: x.dt_txt?.split(' ')?.[0],
                        temp: x.main.temp,
                        weather: x.weather[0]?.main
                    }
                }))
              })
              .catch(error => console.log('Weather error', error));
          })();
          (async () => {
            let url = "https://api.openweathermap.org/data/2.5/weather?q=" + props.meta.location + "&units=metric&appid=47fd245736ab4d7ed57d79abb247fbb7";
            await fetch(url, {
              method: 'GET',
              redirect: 'follow'
            })
              .then(response => response.json())
              .then(result => {
                setWeatherData({
                    degree: result?.main?.temp,
                    weather: result?.weather[0]?.main
                })
              })
              .catch(error => console.log('Weather error', error));
          })();
    }, [props.meta.location])



    useEffect(()=>{
  
        let temp = {}
        iterateDate.forEach((x) => {
            temp[x] = data?.filter((z) => z.date === x)
        })
        setFilterData(temp)
 
    }, [data])

    return (
        <div style={{ background: '#1D2837', borderRadius: '15px', color: 'white', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', padding: 5, height: '100%' }}>
                <div style={{ padding: 5 }}>{props.meta.location} {props.width > 301 ? <>-
                    <span style={{ color: '#ccc' }}>
                        {weatherData?.weather && weatherData?.degree != null
                            ? `${weatherData.weather} · ${weatherData.degree}\u00B0`
                            : ' No data'}
                    </span>
                </> : <></>}</div>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: props.width > 301 ? 'space-between' : 'space-evenly', flexWrap: 'nowrap', overflow: 'auto', height: '100%', scrollbarWidth: 'none' }}>
                    {
                        props.width > 301 
                        ? <>
                            {
                                iterateDate?.map((x, i) => {
                                    let zz = getValues(x)
                                    let day = getDayName(x)
                                    // console.log(zz)
                                    return (
                                        <div key={i} style={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'space-between', borderWidth: '0px', backgroundColor : i===0 ? '#374960' : 'none', borderRadius: '15px', padding: '15px'}}>
                                             <div>{i===0 ? 'Today' : day}</div> 
                                        <div>{getIcons(zz?.weather)}</div> <div>{isNaN(zz?.average) ? '-' : zz.average.toFixed(2) + '\u00B0'}</div> </div>
                                    )
                                })
                            }
                            </> 
                        : 
                        <>
                        {   
                            <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'space-evenly'}}> <div>{'Today'}</div> <div>{getIcons(weatherData?.weather)}</div> <div>   {weatherData?.weather && weatherData?.degree != null
                                ? `${weatherData.weather} · ${weatherData.degree}\u00B0`
                                : ' No data'}</div> </div>
                        }
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Weather