import React, { useState, useEffect } from "react";
import Grid from "components/Core/GridNDL";
import "../index.css";

const CountUpTimer = ({ startDate, showDate, clockFont, width }) => {
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
  const calculateTimeElapsed = () => {
    const now = new Date();
    const difference = now - new Date(startDate);

    let timeElapsed = {};

    if (difference > 0) {
      timeElapsed = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeElapsed;
  };

  const formatWithZero = (number) => {
    return String(number).padStart(2, "0");
  };

  const [timeElapsed, setTimeElapsed] = useState(calculateTimeElapsed());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed());
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <>
      {new Date(startDate) > new Date() ? (
        <p style={{ textAlign: "center" }}>
          {" "}
          Count Up will start at{" "}
        </p>
      ) : (
        <>
          {
            <div style={classes.parent}>
              {width < 405 ? (
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
                          {formatWithZero(timeElapsed.days)}
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
                          {formatWithZero(timeElapsed.hours)}
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
                          {formatWithZero(timeElapsed.minutes)}
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
                          {formatWithZero(timeElapsed.seconds)}
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
              ) : (
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
                          {formatWithZero(timeElapsed.days)}
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
                          :{formatWithZero(timeElapsed.hours)}
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
                          :{formatWithZero(timeElapsed.minutes)}
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
                          :{formatWithZero(timeElapsed.seconds)}
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
              )}
            </div>
          }
        </>
      )}
      {showDate && (
        <p
          style={{
            paddingTop: width < 249 ? "10px" : "1px",
            textAlign: "center",
            color: "#525252",
            fontSize: clockFont !== "default" ? "100%" : "120%",
            fontFamily: clockFont !== "default" && "Digital Numbers",
          }}
        >
          {new Date(startDate).toLocaleDateString("en-GB")}
        </p>
      )}
    </>
  );
};

export default CountUpTimer;
