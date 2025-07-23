import React from "react";
import CloudUpload from 'assets/neo_icons/Equipments/CloudUpload.svg?react';
import CloseIcon from 'assets/neo_icons/Menu/Close_Icon.svg?react';
import TypographyNDL from "components/Core/Typography/TypographyNDL"


export default function FileInputNDL(props) {
    const { files } = props
    

    function ImageFnc(val){
        if((val.type && val.type.split('/')[0] === 'image') || val.base64){
            return <a href={val.base64} download>
                <img src={val.base64} alt="sample" width="100%" height="142" style={{ height: '15rem' }}></img>
            </a>
        }else{return <span onClick={(e) => props.downloadImage(val.image_path)}>{val.image_path}</span>} 
    }
    return (
        <React.Fragment>
            {props.multiple &&

                <div class="flex items-center justify-center w-full">
                    <label for="dropzone-file" class="flex flex-col font-geist-sans items-center justify-center w-full h-64 border-2  border-Border-border-50 dark:border-Border-border-dark-50 border-dashed rounded-lg cursor-pointer bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark dark:hover:bg-Seconary_Button-secondary-button-active  hover:bg-Secondary_Button-secondary-button-active-dark dark:hover:border-gray-500 ">
                        {files.length > 0 ?
                            <div style={{ display: 'inline-flex' }}>
                                {
                                    files.length > 0 &&
                                    files.map((val, index) => {

                                        return (
                                            <div  key={index} style={{ display: 'inline-flex', padding: '15px' }}>
                                                {ImageFnc(val)}
                                                <CloseIcon stroke={'#0084FF'} onClick={(e) => { e.stopPropagation(); props.onClose(val, index, e) }} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            :
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <CloudUpload />
                                <TypographyNDL value="Drag and drop your files here" variant="label-02-m" />

                                <TypographyNDL value={props.helperText} variant="lable-01-s" />

                            </div>
                        }

                        <input id="dropzone-file" type="file" class="hidden font-geist-sans" onChange={props.onChange} />
                    </label>
                </div>
                }
                {!props.multiple &&
                <div>
                    
                    <label
                htmlFor="file_input"
                className="block mb-0.5 font-geist-sans text-[12px] leading-[14px] font-normal text-Text-text-primary dark:text-Text-text-primary-dark"
                >
                {props.imageOnly ? (
                    "Image Upload"
                ) : props.label ? (
                    <>
                    {props.label}
                    {props.showAstrisk && <span style={{ color: 'red' }}>&nbsp;*</span>}
                    {props.mandatory && <span style={{ color: 'red' }}>&nbsp;*</span>}
                    </>
                ) : (
                    "File Upload"
                )}
                </label>


                    <input accept={props.accept} class="block w-full  text-[14px] leading-4 font-normal font-geist-sans text-Text-text-secondary dark:text-Text-text-secondary-dark border border-Border-border-50 dark:border-Border-border-dark-50  rounded-lg cursor-pointer bg-Field-field-default focus:outline-none dark:bg-Field-field-default-dark dark:placeholder-Text-text-primary-dark" aria-describedby="file_input_help" id="file_input" type="file" onChange={props.onChange} />
                   {/* <div className="h-8 w-full flex items-center">
                    <button className="bg-Gray-color-gray-1000 text-Text-text-alt px-3 text-[14px] leading-4 w-[20%]" >
                        Choose File
                    </button>
                    <div className="w-[80%] border-Border-border-50 bg-Field-field-default text-Text-text-secondary text-[14px] leading-4 p-2 ">
                   Select an item 
                    </div>


                   </div> */}
                   
                    <p class={`text-[12px] leading-[14px] mt-0.5  font-geist-sans ${props.error ? "text-Text-text-error dark:text-Text-text-error-dark":"text-Text-text-tertiary dark:text-Text-text-tertiary-dark"}`} id="file_input_help">{props.helperText ? props.helperText : ''}</p>
                </div>
                }
        </React.Fragment>

    )
}