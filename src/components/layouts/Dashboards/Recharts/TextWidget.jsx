
import React,{useState,useEffect} from 'react';
import Typography from 'components/Core/Typography/TypographyNDL';
import { themeMode } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';

function TextWidget(props){
    const [text,setText] = useState('');
    const [variant,setVariant] = useState('');
    const [textAlign, setTextAlign] = useState('center');
    const [textSize, setTextSize] = useState('14px');
    const [CurTheme] = useRecoilState(themeMode)
    
   
    useEffect(()=>{
        // console.log(props.meta,"props.meta")
        if(props.meta.BackgroundColor){
            props.cardColor(props.meta.BackgroundColor)
        }
        setText(props.meta.text?props.meta.text:"No Text")

        const variantMapping = {
            "heading1": "bold",
            "heading2": "semiBold",
            "paragraph": "normal"
        };

        setVariant(variantMapping[props.meta.displayStyle] || "body2");
        setTextAlign(props.meta.textAlign || 'center')
        const textSizeValue = parseInt(props.meta.textSize);
        setTextSize(textSizeValue ? `${textSizeValue}px` : '14px');
    },[props.meta])
    // console.log(props.meta.Textcolor,"props.meta.Textcolor")
    const renderColourDarkDefault=()=>{
        if(props.meta.Textcolor === "#000000" && CurTheme === "dark"){
            return "#FFFFFF"    
        }else{
            return props.meta.Textcolor
        }
    }
    return(
        <div className={'p-4 line-breaks'} style={{display: 'flex',justifyContent: textAlign,overflow: 'auto',height:'100%'}}>
            <Typography  value={text} style={{ textAlign: textAlign , fontSize: textSize,color:renderColourDarkDefault() || (CurTheme === 'dark' ? "#FFFFFF"   :'#000'),fontWeight:variant,lineHeight : textSize}}/>
        </div>
    )
}
export default TextWidget;