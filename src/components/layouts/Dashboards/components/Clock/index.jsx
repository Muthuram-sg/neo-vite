import React, { useState, useEffect } from "react";
import Grid from "components/Core/GridNDL";
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms"

import "../index.css";

const Clock = (props) => {
  const [time, setTime] = useState(new Date());
      const [CurTheme] = useRecoilState(themeMode) 
  



  const classes = {
    parent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: props?.showDate ? "90%" : "100%",
      fontSize: "50px",
      overflowY:'auto',
      scrollbarWidth: 'none'
    },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);



  function convertTimestampTo12HourFormat(timestamp) {
    let date = new Date(timestamp);

    // Extract hours, minutes, and seconds from the Date object in UTC (GMT) time
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();

    // Ensure hours, minutes, and seconds are two Digital Numbers
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    // Return the formatted time in 24-hour format
    return `${hours}:${minutes}:${seconds} GMT`;
  }

 
  const getTime = (date) => {
    if (props.timeZone === "GMT") {
      return props.timeFormat !== 12
        ? convertTimestampTo12HourFormat(date.toGMTString())
        : date.toLocaleTimeString("en-GB", { timeZone: "GMT" });
    } else if (props.timeZone === "ISO") {
      return date.toISOString();
    } else {
      if (props.timeFormat !== 12) {
        // console.log(date.toLocaleTimeString('en-GB'))
        return date.toLocaleTimeString("en-GB"); // 24-hour format
      } else {
        return date.toLocaleTimeString("en-US"); // 12-hour format with AM/PM
      }
    }
  };

  // Format the time based on user preferences
  const formatTime = (date) => {
    return (
      <>
      {
        props.width < 249 
        ?
        <div style={classes.parent}>
        <div style={{ paddingTop: '10px', paddingBottom: '10px', overflowX: 'hidden', overflowY: 'auto', scrollbarWidth: 'none'}}>
          <div style={{ }}>
        <Grid
          container
          spacing={1}
          style={{ flexDirection: "column" }}
          justifyContent={"center"}
        >
          <Grid item xs={12} justifyContent={"center"}>
            < p
              style={{
                fontSize: "100%",
                fontWeight: props.clockFont !== "default" ? 500 : 600,
                color:CurTheme === 'dark' ? "#FFFFFF" : "#202020", 
                lineHeight: "normal",
                textAlign: "center",
                fontFamily: props.clockFont !== "default" && "Digital Numbers",
              }}
            >
              {getTime(date)?.split(":")[0]}
            </ p>
          </Grid>
          <Grid item xs={12} justifyContent={"center"}>
            < p
              style={{
                textAlign: "center",
                color: "#525252",
                fontSize: "35%",
              }}
            >
              Hrs
            </ p>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
          style={{ flexDirection: "column" }}
          justifyContent={"center"}
        >
          <Grid item xs={12} justifyContent={"center"}>
            < p
              style={{
                fontSize: "100%",
                fontWeight: props.clockFont !== "default" ? 500 : 600,
                color:CurTheme === 'dark' ? "#FFFFFF" : "#202020", 
                lineHeight: "normal",
                textAlign: "center",
                fontFamily: props.clockFont !== "default" && "Digital Numbers",
              }}
            >
              {getTime(date)?.split(":")[1]}
            </ p>
          </Grid>
          <Grid item xs={12} justifyContent={"center"}>
            < p
              style={{
                textAlign: "center",
                color: "#525252",
                fontSize: "35%",
              }}
            >
              Min
            </ p>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={1}
          style={{ flexDirection: "column" }}
          justifyContent={"center"}
        >
          <Grid item xs={12} justifyContent={"center"}>
            < p
              style={{
                fontSize: "100%",
                fontWeight: props.clockFont !== "default" ? 500 : 600,
                lineHeight: "normal",
                textAlign: "center",
                color:CurTheme === 'dark' ? "#FFFFFF" : "#202020", 
                fontFamily: props.clockFont !== "default" && "Digital Numbers",
              }}
            >
              {getTime(date)?.split(":")[2].split(" ")[0]}
            </ p>
          </Grid>
          <Grid item xs={12} justifyContent={"center"}>
            < p
              style={{
                textAlign: "center",
                color: "#525252",
                fontSize: "35%",
              }}
            >
              Sec
            </ p>
          </Grid>
        </Grid>
        </div>
        </div>
        </div> 
        : <div style={classes.parent}>
          <div style={{ overflowX:'auto',scrollbarWidth: 'none'}}>
        <Grid container spacing={1} justifyContent={'center'}>
          <Grid item xs={4}>
              <Grid container spacing={1} style={{ flexDirection: 'column',   }} justifyContent={'center'}>
                <Grid item xs={12} justifyContent={'center'}>
                  <p style={{  fontSize: '100%', fontWeight: props.clockFont !== 'default' ? 500 : 600, lineHeight:'normal', textAlign: 'center', fontFamily: props.clockFont !== 'default' && 'Digital Numbers' ,
                color:CurTheme === 'dark' ? "#FFFFFF" : "#202020", 

                  }}>{getTime(date)?.split(':')[0]}</ p>
                </Grid>
                <Grid item xs={12} justifyContent={'center'}>
                  < p style={{  textAlign: 'center', color: '#525252', fontSize: '35%'}}>Hrs</ p>
                </Grid>
              </Grid>
          </Grid>
          <Grid item xs={4}>
          <Grid container spacing={1} style={{ flexDirection: 'column',   }} justifyContent={'center'}>
                <Grid item xs={12} justifyContent={'center'}>
                  < p style={{   fontSize: '100%', fontWeight: props.clockFont !== 'default' ? 500 : 600, 
                color:CurTheme === 'dark' ? "#FFFFFF" : "#202020", 
                lineHeight:'normal', textAlign: 'center', fontFamily: props.clockFont !== 'default' && 'Digital Numbers' }}>:{getTime(date)?.split(':')[1]}</ p>
                </Grid>
                <Grid item xs={12} justifyContent={'center'}>
                  < p style={{   textAlign: 'center', color: '#525252', fontSize: '35%'}}>Min</ p>
                </Grid>
              </Grid> 
          </Grid>
          <Grid item xs={4}>
          <Grid container spacing={1} style={{ flexDirection: 'column',   }} justifyContent={'center'}>
                <Grid item xs={12} justifyContent={'center'}>
                  < p style={{  fontSize: '100%', fontWeight: props.clockFont !== 'default' ? 500 : 600,
                color:CurTheme === 'dark' ? "#FFFFFF" : "#202020", 
                lineHeight:'normal', textAlign: 'center', fontFamily: props.clockFont !== 'default' && 'Digital Numbers' }}> :{getTime(date)?.split(':')[2].split(' ')[0]}</ p>
                </Grid>
                <Grid item xs={12} justifyContent={'center'}>
                  < p style={{ textAlign: 'center',color: '#525252', fontSize: '35%'}}>Sec</ p>
                </Grid>
              </Grid>
          </Grid>
        </Grid>
      </div>
          </div>
      }
        
          
        {props?.showDate && (
          < p
            style={{
              textAlign: "center",
              color: "#525252",
              paddingTop: props.width < 249 ? '10px' : '1px',
              // fontSize: props.clockFont !== "default" ? "240%" : "120%",
              fontFamily: props.clockFont !== "default" ? `Digital Numbers` : '',
            }}
          >
            {new Date().toLocaleDateString("en-GB")}
          </ p>
        )}
      </>
    );
  };

  return <div style={{ height: "100%" }}>{formatTime(time)}</div>;
};

export default Clock;
