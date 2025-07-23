import React, { useState, useEffect } from "react";
import Grid from "components/Core/GridNDL";
import "../index.css";

const CountdownTimer = ({ targetDate, showDate, clockFont, width }) => {
  const classes = {
    parent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: showDate ? "90%" : "100%",
      fontSize: "50px",
      overflowX: "auto",
      scrollbarWidth: "none",
    },
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = new Date(targetDate) - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const formatWithZero = (number) => {
    return String(number).padStart(2, "0");
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <>
      {timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds >
      0 ? (
        <>
          <div style={classes.parent}>
            {
          width < 405 ? 
            <div
              style={{
                paddingTop: "10px",
                paddingBottom: "10px",
                overflowX: "hidden",
                overflowY: "auto",
                scrollbarWidth: "none",
              }}
            >
              <div style={{}}>
              <Grid
                  container
                  spacing={1}
                  style={{ flexDirection: "column" }}
                  justifyContent={"center"}
                >
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        fontSize: clockFont !== "default" ? "100%" : "95%",
                        fontWeight: clockFont !== "default" ? 500 : 600,
                        lineHeight: "normal",
                        textAlign: "center",
                        fontFamily: clockFont !== "default" && "Digital Numbers",
                      }}
                    >
                      {formatWithZero(timeLeft.days)}
                    </p>
                  </Grid>
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#525252",
                        fontSize: "30%",
                      }}
                    >
                      Days
                    </p>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={1}
                  style={{ flexDirection: "column" }}
                  justifyContent={"center"}
                >
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        fontSize: clockFont !== "default" ? "100%" : "95%",
                        fontWeight: clockFont !== "default" ? 500 : 600,
                        lineHeight: "normal",
                        textAlign: "center",
                        fontFamily: clockFont !== "default" && "Digital Numbers",
                      }}
                    >
                      {formatWithZero(timeLeft.hours)}
                    </p>
                  </Grid>
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#525252",
                        fontSize: "30%",
                      }}
                    >
                      Hrs
                    </p>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={1}
                  style={{ flexDirection: "column" }}
                  justifyContent={"center"}
                >
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        fontSize: clockFont !== "default" ? "100%" : "95%",
                        fontWeight: clockFont !== "default" ? 500 : 600,
                        lineHeight: "normal",
                        textAlign: "center",
                        fontFamily: clockFont !== "default" && "Digital Numbers",
                      }}
                    >
                      {formatWithZero(timeLeft.minutes)}
                    </p>
                  </Grid>
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#525252",
                        fontSize: "30%",
                      }}
                    >
                      Min
                    </p>
                  </Grid>
                </Grid>


                <Grid
                  container
                  spacing={1}
                  style={{ flexDirection: "column" }}
                  justifyContent={"center"}
                >
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        fontSize: clockFont !== "default" ? "100%" : "95%",
                        fontWeight: clockFont !== "default" ? 500 : 600,
                        lineHeight: "normal",
                        textAlign: "center",
                        fontFamily: clockFont !== "default" && "Digital Numbers",
                      }}
                    >
                      {formatWithZero(timeLeft.seconds)}
                    </p>
                  </Grid>
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#525252",
                        fontSize: "30%",
                      }}
                    >
                      Sec
                    </p>
                  </Grid>
                </Grid>

              </div>
            </div>
            :

            <Grid container spacing={1} justifyContent={"center"}>
              <Grid item xs={3}>
                <Grid
                  container
                  spacing={1}
                  style={{ flexDirection: "column" }}
                  justifyContent={"center"}
                >
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        fontSize: clockFont !== "default" ? "100%" : "95%",
                        fontWeight: clockFont !== "default" ? 500 : 600,
                        lineHeight: "normal",
                        textAlign: "center",
                        fontFamily: clockFont !== "default" && "Digital Numbers",
                      }}
                    >
                      {formatWithZero(timeLeft.days)}
                    </p>
                  </Grid>
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#525252",
                        fontSize: "30%",
                      }}
                    >
                      Days
                    </p>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Grid
                  container
                  spacing={1}
                  style={{ flexDirection: "column" }}
                  justifyContent={"center"}
                >
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        fontSize: clockFont !== "default" ? "100%" : "95%",
                        fontWeight: clockFont !== "default" ? 500 : 600,
                        lineHeight: "normal",
                        textAlign: "center",
                        fontFamily: clockFont !== "default" && "Digital Numbers",
                      }}
                    >
                      :{formatWithZero(timeLeft.hours)}
                    </p>
                  </Grid>
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#525252",
                        fontSize: "30%",
                      }}
                    >
                      Hrs
                    </p>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Grid
                  container
                  spacing={1}
                  style={{ flexDirection: "column" }}
                  justifyContent={"center"}
                >
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        fontSize: clockFont !== "default" ? "100%" : "95%",
                        fontWeight: clockFont !== "default" ? 500 : 600,
                        lineHeight: "normal",
                        textAlign: "center",
                        fontFamily: clockFont !== "default" && "Digital Numbers",
                      }}
                    >
                      :{formatWithZero(timeLeft.minutes)}
                    </p>
                  </Grid>
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#525252",
                        fontSize: "30%",
                      }}
                    >
                      Min
                    </p>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Grid
                  container
                  spacing={1}
                  style={{ flexDirection: "column" }}
                  justifyContent={"center"}
                >
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        fontSize: clockFont !== "default" ? "100%" : "95%",
                        fontWeight: clockFont !== "default" ? 500 : 600,
                        lineHeight: "normal",
                        textAlign: "center",
                        fontFamily: clockFont !== "default" && "Digital Numbers",
                      }}
                    >
                      :{formatWithZero(timeLeft.seconds)}
                    </p>
                  </Grid>
                  <Grid item xs={12} justifyContent={"center"}>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#525252",
                        fontSize: "30%",
                      }}
                    >
                      Sec
                    </p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
             }
          </div>

          {showDate && (
            <p
              style={{
                textAlign: "center",
                color: "#525252",
                paddingTop: width < 249 ? "10px" : "1px",
                fontSize: clockFont !== "default" ? "100%" : "120%",
                fontFamily: clockFont !== "default" && "Digital Numbers",
              }}
            >
              {new Date(targetDate).toLocaleDateString("en-GB")}
            </p>
          )}
        </>
      ) : (
        <h1>Time's up!</h1>
      )}
    </>
  );
};

export default CountdownTimer;
