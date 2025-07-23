import React,{forwardRef, useEffect,useState} from 'react';
import { useRecoilState } from "recoil";
import {themeMode} from "recoilStore/atoms";
import Eyeopen from "assets/eye.svg";
import  EyeClose from "assets/eye-off.svg"
import { useRef } from 'react';

const InputFieldNDL = forwardRef(({children,...props},inputRef)=>{ 
    const [curTheme]=useRecoilState(themeMode)
    // const [value, setValue] = useState(props.inputRef ? props.inputRef : 0);
    // const NumberRef = useRef()
    // useEffect(()=>{
    //     if(NumberRef.current){
    //         NumberRef.current.value = value
    //     }

    // },[value])

    const handleIncrement = () => {
        // setValue((prevValue) => prevValue + 1);
      };
    
      const handleDecrement = () => {
        // setValue((prevValue) => prevValue - 1);
      };

    let DisableCss = props.disabled ? ' text-Text-text-disabled dark:text-Text-text-disabled-dark bg-Field-field-disable  dark:bg-Field-field-disable-dark placeholder-Text-text-disabled dark:placeholder-Text-text-disabled-dark  ':' text-Text-text-primary dark:text-Text-text-primary-dark bg-Field-field-default dark:bg-Field-field-default-dark placeholder-Text-text-secondary dark:placeholder-Text-text-secondary-dark '
    let AdortmentCss = props.startAdornment ? 'pl-10' : ''
    let EndIconCss = props.startAdornment ? 'pr-10' : ''
    let counterIconCss = props.isCounter ? 'pr-[50px]' : ''

    let removeArrows=props.arrow ? `no-spinner w-full px-3 py-2 border rounded appearance-none [appearance:textfield]`:""
    
    var bordercss =  props.error ?
    `bg-Field-field-default dark:bg-Field-field-default-dark border ${props.type === 'number' ? "font-geist-mono "  : "font-geist-sans "} border-Negative_Interaction-negative-default dark:border-Negative_interaction-negative-default-dark text-[14px] leading-[16px] rounded-md focus:ring-Negative_Interaction-negative-default dark:focus:ring-Negative_Interaction-negative-default focus:border-Negative_Interaction-negative-default dark:focus:border-Negative_interaction-negative-default-dark  block w-full ${AdortmentCss} ${EndIconCss} ${counterIconCss} p-2 text-Text-text-error placeholder-Text-text-error  dark:text-Text-text-error-dark dark:placeholder-Text-text-error-dark dark:border-Text-text-error-dark h-8  focus:text-Text-text-primary dark:focus:text-Text-text-primary-dark`
      :

      `  ${props.type === 'number' ? "font-geist-mono "  : "font-geist-sans "}  border-Border-border-50 dark:border-Border-border-dark-50 ${DisableCss}  text-[14px] rounded-md leading-[16px]   focus:border-Focus-focus-primary dark:focus:border-Focus-focus-primary-dark block w-full ${AdortmentCss} ${EndIconCss} ${counterIconCss} p-2 dark:text-Text-text-secondary-dark  text-Text-text-secondary focus:text-Text-text-primary  focus:ring-Focus-focus-primary dark:focus:text-Text-text-primary-dark  dark:focus:ring-Focus-focus-primary-dark dark:focus:border-Border-border-dark-50 border  h-8`

    var textareacss = `block ${DisableCss} p-2 w-full ${props.type === 'number' ? "font-geist-mono "  : "font-geist-sans "} h-[74px] text-[14px] leading-[16px]  text-Text-text-primary dark:text-Text-text-primary-dark  rounded-md border border-Border-border-50 dark:border-Border-border-dark-50 focus:ring-Focus-focus-primary dark:ring-Focus-focus-primary-dark  focus:border-Focus-focus-primary dark:focus:border-Focus-focus-primary-dark focus:text-Text-text-primary dark:focus:text-Text-text-primary-dark    dark:focus:ring-interact-accent-default`

    var helpertextcss = props.error ? "mt-0.5  font-geist-sans text-[12px]  text-Text-text-error dark:text-Text-text-error-dark leading-[14px]" :props.disabled ? "mt-0.5  font-geist-sans text-[12px]  text-Text-text-disabled dark:text-Text-text-disabled-dark leading-[14px]" : "mt-0.5 font-geist-sans text-[12px] text-Text-text-tertiary dark:text-Text-text-tertiary-dark leading-[14px]"
    
    var labelcss = props.disabled ? 'text-Text-text-disabled dark:text-Text-text-disabled-dark block mb-0.5 text-[12px]   font-geist-sans leading-[14px] font-normal' :"block mb-0.5 text-[12px]   font-geist-sans leading-[14px] font-normal text-Text-text-primary dark:text-Text-text-primary-dark "

    function SingleInput(){
        if(props.type === "file") {
            return <input class={`block  w-full text-[14px] leading-[16px]   ${DisableCss}  border font-geist-sans border-Border-border-50 rounded-md cursor-pointer bg-Background-bg-secondary dark:text-Text-text-primary-dark focus:outline-none dark:bg-bg-Background-bg-secondary-dark dark:border-secondary-bg dark:placeholder-field-02`}
                aria-describedby="file_input_help" id={props.id} type={props.type} onChange={props.onChange}
                ref={props.inputRef}>
            </input>
        }else if(props.type === "number" && props.isCounter ){
            return (
                <div className="relative w-full inline-flex items-center rounded-md overflow-hidden">
                    <input
                       id='counterinput'
                        type="number"
                        className={`${bordercss} w-full px-3 py-2 `}
                        placeholder={props.placeholder}
                        value={props.value}
                        disabled={props.disabled}
                        required={props.required}
                        onChange={props.onChange}
                        onClick={props.onClick}
                        onBlur={handleBlur}
                        ref={props.inputRef}
                        defaultValue={props.defaultValue}
                        style={props.style}
                        onKeyPress={props.onKeyPress}
                        onWheel={props.onWheel}
                        maxLength={props.maxLength}
                        onKeyDown={props.type === "number" ? handleNumberInputKeyDown : props.onKeyDown}
                        autoFocus={props.autoFocus ? true : false}
                        autoComplete={props.autoComplete ? "off" : ""}
                        onFocus={props.onFocus}
                    />
                    <div className="absolute right-0 flex ">
                    <button
                            className="px-2 py-1 text-Icon-icon-secondary dark:text-Icon-icon-secondary-dark "
                            onClick={()=>props.handleIncrement('minus')}
                        >
                            −
                        </button>
                        <button
                            className="px-2 py-1  text-Icon-icon-secondary dark:text-Icon-icon-secondary-dark "
                            onClick={()=>props.handleIncrement('plus')}
                        >
                            +
                        </button>
                     
                    </div>
                </div>
            )
            
        }
        // else if(props.type === "number" && props.alertrules){
        //     return (
        //         <div className="relative w-full inline-flex items-center rounded-md overflow-hidden">
        //          <input
        //             id="counterinput"
        //             type="number"
        //             className={`${bordercss} w-full px-3 py-2`}
        //             placeholder={props.placeholder}
        //             value={props.value}
        //             disabled={props.disabled}
        //             required={props.required}
        //             onChange={props.onChange}
        //             onClick={props.onClick}
        //             onBlur={handleBlur}
        //             ref={props.inputRef}
        //             defaultValue={props.defaultValue}
        //             style={props.style}
        //             maxLength={props.maxLength}
        //             autoFocus={props.autoFocus ? true : false}
        //             autoComplete={props.autoComplete ? "off" : ""}
        //             onFocus={props.onFocus}
        //             onWheel={(e) => e.target.blur()}
        //             onKeyDown={(e) => {  
        //                 if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        //                 e.preventDefault();
        //                 }
        //             }}
        //             />
        //         </div>
        //     )
            
        // }
        else{
            return  ( 
            <React.Fragment>
            <input
                type={props.type ? props.type : "text"}
                id={props.id}
                class={bordercss}
                className={`${bordercss} ${props.arrow ? removeArrows : ''}`}
                placeholder={props.placeholder}
                value={props.value}
                disabled={props.disabled}
                required={props.required}
                onChange={props.onChange}
                onClick={props.onClick}
                onBlur={handleBlur}
                ref={props.inputRef}
                defaultValue={props.defaultValue}
                style={props.style}
                onKeyPress={props.onKeyPress}
                // onKeyDown={props.onKeyDown}
                // autoFocus={props.autoFocus ? true : false}
                // autoComplete={props.autoComplete ? "off":""}
                onWheel={props.onWheel}
                maxLength={props.maxLength}
                onKeyDown={props.type === "number" ? handleNumberInputKeyDown : props.onKeyDown} // Handle number input key down event
                autoFocus={props.autoFocus ? true : false}
                autoComplete={props.autoComplete ? "off" : ""}    
                onFocus={props.onFocus}          
            />
            {
                props.eyeToggle &&   
                <button
              type="button"
            //   className="password-toggle-icon"
              onClick={props.togglePasswordVisibility}
            >
              <img src={props.showPassword ? EyeClose : Eyeopen} alt="Toggle Password Visibility" />
            </button>
            }
            </React.Fragment>
        )
        }
                        
                        
    }

    const handleNumberInputKeyDown = (event) => {
 
        // Prevent the default behavior for arrow keys (up and down)
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
        }

        if(event.key === "Enter" || event.key === "NumpadEnter"){
            props.handleKeyDown(event)
        }

        if (props.NoMinus && (event.key === "-" || event.key === "_")) {
    
            event.preventDefault();
        }
        if(props.noDecimal && (event.key === "." || event.key === ",")){
            event.preventDefault();
        }
      
    };

    const handleNumberInputWheel = (event) => {
        event.preventDefault();
    };

    const handleBlur = (event) => {
        if (props.NoMinus && event.target.value < 0) {
            event.target.value = 0;
            props.onChange && props.onChange(event);
        }
        props.onBlur && props.onBlur(event);
    };
    return (
        <React.Fragment>
            <div >
            {props.label && 
            <label class={labelcss}>{props.label}{props.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}</label>}

            <div className='relative'>
                {props.startAdornment &&
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {props.startAdornment}
                    </div>
                }
                {props.multiline ?
                    <textarea id={props.id} rows={props.maxRows}
                        class={textareacss} placeholder={props.placeholder}
                        defaultValue={props.defaultValue}
                        onChange={props.onChange}
                        maxLength={props.maxLength}
                        name={props.label}
                        value={props.value}
                        disabled={props.disabled}
                        ref={props.inputRef} onBlur={props.onBlur} >
                    </textarea> 
                    :
                    SingleInput()

                }
                {props.helperText &&
                <p class={helpertextcss} >{props.helperText}</p>}
                {props.endAdornment &&
                    <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3">
                        {props.endAdornment}
                    </button>
                }
            </div>
            </div>
        </React.Fragment>

    )
})
const isNotRender = (prev, next) => {
    return prev.value !== next.value || prev.type !== next.type || prev.disabled !== next.disabled ||
      prev.error !== next.error || prev.helperText !== next.helperText || prev.defaultValue !== next.defaultValue
      || prev.endAdornment !== next.endAdornment || prev.dynamic !== next.dynamic ? false : true
  }
  const CustomTextField = React.memo(InputFieldNDL, isNotRender)
  export default CustomTextField;