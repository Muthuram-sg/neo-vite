import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Success from 'assets/neo_icons/Arrows/success.svg?react';
import Danger from 'assets/neo_icons/Arrows/warning.svg?react';
import Info from 'assets/neo_icons/Arrows/info.svg?react';
import Error from 'assets/neo_icons/Arrows/error.svg?react';
import Vector from 'assets/neo_icons/Arrows/vector.svg?react';
import Wolrd from 'assets/world-x.svg?react';
import Refresh from 'assets/neo_icons/Menu/scada/defaulttoolbar/Refresh.svg?react';
function ToastNDL(props) {

  const [toastClose, setToastClose] = useState("hidden");
  const [TopR] = React.useState(32);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TopR]);

  const handleScroll = (event) => {
    let posT = Number(32 + window.pageYOffset);
    document.getElementById("toast-" + props.type).style.top = posT + "px";

  };

  useEffect(() => {
    if (props.toastBar) {
      setToastClose("");
    }
  }, [props.toastBar]);

  let icon = "";
  let textColor = "";
  let borderColor = "";

  if (props.type.toLowerCase() === "success") {
    textColor =
      "text-Success-success-text  bg-Sucess-success-base ";
    // borderColor = "";
    icon = <Success  />;
  } else if (props.type.toLowerCase() === "warning") {
    textColor =
      "text-Warning01-warning-01-text dark:text-Warning01-warning-01-text-dark bg-Warning01-warning-01-base dark:bg-Warning01-warning-01-base-dark";
    icon = <Danger  />;
  } else if (props.type.toLowerCase() === "error") {
    textColor =
      "text-Error-error-text dark:text-Error-error-text-dark bg-Error-error-base dark:bg-Error-error-base-dark";
    borderColor = "";
    icon = props.WolrdIcon ? <Wolrd /> :<Error  />
  } else if (props.type.toLowerCase() === "info") {
    textColor =
      "text-Info-info-text  dark:text-Info-info-text-dark bg-Info-info-base dark:bg-Info-info-base-dark";
    // borderColor = "";
    icon = <Info  />;
  }else if (props.type.toLowerCase() === "clear") {
    textColor =
      "text-Error-error-text dark:text-Error-error-text-dark bg-Error-error-base dark:bg-Error-error-base-dark";
    borderColor = "";
    icon = <Refresh  />;
  }

  const handleToastClose = () => {
    props.handleSnackClose();
    setToastClose("hidden");
  };

  setTimeout(
    () => {
      props.handleSnackClose();
      setToastClose("hidden");
    },
    props.timer ? props.timer : 3000
  );

  return (
    <React.Fragment>
      <div
        id={"toast-" + props.type}
        style={{
          position: "absolute",
          zIndex: "10000",
          top: "32px",
          left: "50%",
          transform: "translate(-50%, 0)",
        }}
        class={
          ` w-auto  px-3 py-2 ${props.discriptionText ? 'h-[48px]' : 'h-[40px] items-center'}  flex  justify-between  rounded-xl  ` +
          borderColor +
          " " +
          toastClose +
          " " +
          textColor +
          " " +
          ""
        }
        role="alert"
      >
        <div className="flex items-center  gap-2">
        <button className={`flex  items-center   gap-1 `}>
          <div className={`${props.type.toLowerCase() === "success" ? "mt-2" :''}`}>
          {icon}
          </div>
          <div className={` ${props.discriptionText ? ' flex flex-col' : ''}`}>
            <p
              class={
                `my-0 text-[14px] font-medium leading-[16px] text-left gap-0.5 ` +
                textColor +
                ""
              }
            >
              {props.message}
            </p>
            {props.discriptionText && (
              <p
                class={
                  "my-0 text-[12px] font-normal leading-[14px] " +
                  textColor +
                  ""
                }
              >
                {props.discriptionText}
              </p>
            )}
          </div>

          <div></div>
        </button>

        <button
          type="button"
          class={""}
          data-dismiss-target={"#toast-" + props.type}
          aria-label="Close"
          onClick={handleToastClose}
        >
          <span class="sr-only">Close</span>
          <Vector />
        </button>
        </div>
       
      </div>
    </React.Fragment>
  );
}

ToastNDL.propTypes = {
  type: PropTypes.any.isRequired,
  message: PropTypes.any.isRequired,
  toastBar: PropTypes.any.isRequired,
};

export default ToastNDL;
