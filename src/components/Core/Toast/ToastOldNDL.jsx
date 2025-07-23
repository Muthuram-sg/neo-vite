import React from "react";
import PropTypes from 'prop-types';
import { Toast } from 'flowbite-react';
import CheckCircle from 'assets/neo_icons/ToastIcon/CheckCircle.svg?react';
import Warning from 'assets/neo_icons/ToastIcon/Warning.svg?react';

function ToastOldNDL(props) {

    let borderColor = "";
    let textColor = "";
    let icon = "";
    if (props.type === "success") {
        borderColor = "border-support-green";
        textColor = "text-support-green";
        icon = <CheckCircle className="h-5 w-5" />
    }
    else if (props.type === "warning") {
        borderColor = "border-support-orange";
        textColor = "text-support-orange";
        icon = <CheckCircle className="h-5 w-5" />
    }
    else if (props.type === "danger") {
        borderColor = "border-support-red";
        textColor = "text-support-red";
        icon = <Warning className="h-5 w-5" />
    }

    return (
        <React.Fragment>
            <Toast className={"border border-solid " + (borderColor) + ""}>
                {/* {props.type ? (props.type === "success" ? <CheckCircle className="h-5 w-5" /> : (props.type === "danger" ? <Warning className="h-5 w-5" />)) : ""
                } */}
                {icon}
                <div className={"ml-3 text-sm font-normal " + (textColor) + ""}>
                    {props.message}
                </div>
                <Toast.Toggle />
            </Toast>
        </React.Fragment>
    );

}

ToastOldNDL.propTypes = {
    type: PropTypes.any.isRequired,
    message: PropTypes.any.isRequired,
}

export default ToastOldNDL;