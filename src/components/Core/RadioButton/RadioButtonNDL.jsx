import React from "react";
import PropTypes from 'prop-types';
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms"

function RadioButtonNDL(props) {
    const [curTheme] = useRecoilState(themeMode)
    var classNameLabel = ""
    var discribLabel = ""
    let classNameRadio 
    // if(props.checked && props.disabled){
    //     console.log("enterElseIF")
    //         classNameRadio="bg-Primary_Interaction-primary-loading"
    //         console.log("classNameRadio",classNameRadio)
    // }
      if (props.disabled) {
        console.log("enterIF")
        classNameRadio = " w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";
        classNameLabel = " text-base font-geist-sans font-normal text-Text-text-disabled dark:text-Text-text-disabled-dark leading-[22px]";
        discribLabel = "text-Text-text-disabled dark:text-Text-text-disabled-dark  text-[12px] leading-[14px]";
    } 
    
    else {
        // classNameRadio += " text-blue-600 border-Icon-icon-tertiary text-Text-text-primary dark:text-Text-text-primary-dark focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";
    classNameRadio = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        classNameLabel = `text-base font-geist-sans font-normal text-primary-lable dark:text-gray-300 leading-[16px] text-[${props.isPareto ? `12px` : `14px`}]`;
        discribLabel = "text-Text-text-tertiary dark:text-Text-text-tertiary-dark text-[12px] leading-[14px] ";
    }

  





    return (
        <React.Fragment>

            <div style={props.style} class={`flex  gap-2 items-center h-[32px] ${props.nopadding ? "" : "py-[8px]"} `}>
                <input
                    id={props.id}
                    type="radio"
                    value=""
                    name={props.name}
                    checked={props.checked}
                    class={`w-4 h-4 ${props.disabled ? 'bg-Secondary_Interaction-secondary-disable dark:bg-Secondary_Interaction-secondary-disable-dark border border-none' : 'dark:bg-[#6e6e6e] border-Border-border-50 dark:border-Border-border-dark-50 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 bg-[##8D8D8D]'} `}
                    onChange={props.disabled ? undefined : props.onChange}
                />



                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label
                        for={props.id}
                        class={classNameLabel}
                    >
                        {props.labelText}
                    </label>

                    <span
                        // class={
                        //     "text-[12px] leading-[14px] ml-2 " +
                        //     (props.disabled
                        //         ? "text-Text-text-disabled dark:text-Text-text-disabled-dark"
                        //         : "text-Text-text-tertiary dark:text-Text-text-tertiary-dark")
                        // }
                        class={discribLabel}
                    >
                        {props.description ? props.description : ""}
                    </span>
                </div>

            </div>

        </React.Fragment>
    );

}

RadioButtonNDL.propTypes = {
    id: PropTypes.any.isRequired,
    name: PropTypes.any.isRequired,
    labelText: PropTypes.any.isRequired,
}

export default RadioButtonNDL;