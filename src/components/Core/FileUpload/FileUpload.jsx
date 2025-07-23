/* eslint-disable eqeqeq */
import React from "react";  
import Plus from 'assets/neo_icons/Menu/plus_icon.svg?react';
import ImageIcon from 'assets/neo_icons/Menu/Image_icon.svg?react';
import CloseIcon from 'assets/neo_icons/Menu/Close_Icon.svg?react';
import { useTranslation } from 'react-i18next';
import FileIcon from 'assets/neo_icons/Menu/File_icon.svg?react';
export default function FileUpload(props) {
    const { t } = useTranslation();
    const classes ={
        imageField: {
            border: '2px dashed rgba(0, 0, 0, 0.12)',
            borderRadius: '4px',
            margin: '10px',
            textAlign: 'center',
            padding: '10px'
        }, filesTypography: {
            display: 'inline-flex',
            border: '1px solid gainsboro',
            borderRadius: '4px',
            marginRight: '10px'
        }, filesName: {
            paddingLeft: '5px',
            paddingRight: '5px',
            fontSize: '14px',
            display: 'block',
            maxWidth: '130px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        }, fileRemoveIcon: {
            verticalAlign: '-webkit-baseline-middle',
            width: '17px',
            cursor: 'pointer',
            marginTop: '3px'
        },  typograpyCust: {
            fontSize: 14,
            marginTop: 10,
            fontWeight: 600
        }, typocust2: {
            fontSize: '16px',
            fontWeight: '500',
            marginTop: 10,
        }, taskUpload: {
            position: "absolute",
            width: "100%",
            height: "20vh",
            opacity: "0"
        }, taskupload2: {
            position: "relative"
        }
    }
    const handleChangefn = (e) => {
        props.handleChange(e)
    }
    const removeFiles = (i, e) => {
        props.removeFilesfn(i, e)
    }
    const removeExistingFiles = (i, e) => {
        props.removeExistingFilesfn(i, e)
    } 

    function ImageFnc(val){
        if(val.type && val.type.split('/')[0] === 'image'){
            return <ImageIcon stroke={'#0084FF'} />
        }else if(val.image_path.split('.')[1] == 'jpeg' || val.image_path.split('.')[1] == 'jpg' || val.image_path.split('.')[1] == 'png'){
            return <ImageIcon stroke={'#0084FF'} />
        }else{return <FileIcon stroke={'#0084FF'} />}
    }

    function ClickFnc(e,val,index){
        if(val.type){
            removeFiles(index, e)
        }else{removeExistingFiles(index, val)}
    }
    function FileName(val){
        if(val.name){return val.name}else{return val.image_path} 
    }
    return (

        <div style={{...classes.taskupload2, ...classes.imageField}}>
            <input id="file-input" style={classes.taskUpload} multiple={props.multiple} type="file" ref={props.dropzoneRef} onChange={(e) => handleChangefn(e)} />
            <div >
                {
                    props.filesArrs && props.filesArrs.length < props.fileLength && (
                        <label for="file-input"  >

                            <div>
                                 <Plus /> 
                            </div>
                        </label>
                    ) 
                }
                {
                    props.filesArrs && props.filesArrs.length > 0 ? (
                        <div style={{ display: 'inline-flex' }}>
                            {
                                props.filesArrs.map((val, index) => {
                                    return (<span style={[classes.filesTypography, classes.typograpyCust].join(' ')}> 
                                            {
                                                ImageFnc(val)
                                            } 
                                            <span style={classes.filesName}>{FileName(val)}</span>
                                            <CloseIcon stroke={'#0084FF'} style={classes.fileRemoveIcon} onClick={(e) => ClickFnc(e,val,index)}/>
                                            </span>
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <>
                            <span className="font-geist-sans"  style={classes.typocust2}  >{t(props.Dropdowntext)}</span><br />
                            <span  className="font-geist-sans" style={classes.typocust2}  >{t(props.fileformat)}</span><br />
                            <span  className="font-geist-sans" style={classes.typocust2} >{t(props.maxsize)}</span>
                        </>
                    )
                }

            </div>
        </div>

    )
}