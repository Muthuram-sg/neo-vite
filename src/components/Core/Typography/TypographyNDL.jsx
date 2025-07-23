import React from "react";
import { useRecoilState } from "recoil";
import {themeMode} from "recoilStore/atoms"

export default function TypographyNDL(props) {
    const [curTheme]=useRecoilState(themeMode)
    let PercentColor = ""
    if (props.color === "#EE0E51") {
        PercentColor = "text-[#EE0E51]"
    }
    else if (props.color === "#5DE700") {
        PercentColor = "text-[#5DE700]"
    }
    else if (props.color === "#00CDDC") {
        PercentColor = "text-[#00CDDC]"
    }
    else if (props.color === "#FFFFFF") {
        PercentColor = "text-[#FFFFFF]"
    }
    else if (props.color === "#242424") {
        PercentColor = "text-[#242424]"
    }
    else if (props.color === "#898989") {
        PercentColor = "text-[#898989]"
    }else if(props.color === "#30A46C"){
        PercentColor = "text-[#30A46C]"
    }
    else if(props.color === "#DA1E28"){
        PercentColor = "text-[#DA1E28]"
    }else if(props.color === "#CE2C31"){
         PercentColor = "text-[#CE2C31]"
    }
    else if(props.color === "#FF815A"){
        PercentColor = "text-[#FF815A]"
    }
    else if(props.color === "#CECECE"){
        PercentColor= "text-[#CECECE]"
    }
    else if(props.color === "#525252"){
        PercentColor = "text-[#525252]"
    }
    

    // eslint-disable-next-line no-unused-vars
    const colors =()=>{
      if (props.color === "secondary"){
            return "text-Text-text-secondary"
        }else if(props.color === "tertiary"){
            return "text-Text-text-tertiary"
        }else if (props.color === "danger"){
            return "text-Text-text-error"
        }else if(props.color === "success"){
            return 'text-Text-text-success'
       }
       else if(props.color==="warning"){
        return 'text-Warning02-warning-02-base-alt'
       }
       else if(PercentColor){
            return PercentColor
        }else{
            return "text-Text-text-primary"
        }
    }  


    const Drakcolors =()=>{
        if (props.color === "secondary"){
            return "text-Text-text-secondary-dark"
        }else if(props.color === "tertiary"){
            return "text-Text-text-tertiary-dark"
        }else if (props.color === "danger"){
            return "text-Text-text-error-dark"
        }else if(props.color === "disable"){
            return 'text-Text-text-disable'
        }
        else if(props.color==="warning"){
         return 'text-Warning02-warning-02-base-alt'
        }
        else if(props.color === "success"){
             return 'text-Text-text-success-dark'
        }else if(PercentColor){
            return PercentColor
        }else{
            return "text-Text-text-primary-dark"
        }
    }  


    
function renderFontFamily (){
    if(!props.nofontfamily){
       return 'font-geist-sans'
    }else{
    //    console.log(props.nofontfamily,"props.nofontfamily") 
        return ''

    }
}
    const variant = 
        {

            BoldNormal: {
                // bold normal 400
                "lable-01-xs":`text-[12px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[14px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "lable-01-s":`text-[14px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[16px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "lable-01-m":`text-[16px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[18px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "lable-01-lg":`text-[18px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[20px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "lable-01-xl":`text-[20px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[24px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                'paragraph-xs':`text-[12px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[14px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                'paragraph-s':`text-[14px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[16px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                'paragraph-m':`text-[16px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[18px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                'paragraph-lg':`text-[18px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[20px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
     
                sm: `text-[14px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[18px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                base: `text-[16px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[22px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                lg: `text-[18px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-6 font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                xl: `text-[20px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-7 font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                twoxl: `text-[24px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-8 font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                threexl: `text-[28px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-9 font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                fourxl: `text-[32px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-10 font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                fivexl: `text-[36px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[44px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                sixxl: `text-[42px] ${curTheme === 'dark' ? Drakcolors() :  colors() } leading-[50px] font-normal ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, 
                
            },
            // bold medium 500
            BoldMedium: {
                "label-02-xs": `text-[12px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-[14px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "label-02-s": `text-[14px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-[16px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "label-02-m": `text-[16px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-[18px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "heading-01-xs":`text-[18px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-5 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "heading-01-s":`text-[20px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-6 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "heading-01-m":`text-[24px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-7 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "heading-01-lg":`text-[28px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-8 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "label-02-lg": `text-[18px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-[20px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "label-02-xl": `text-[20px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-[24px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,


                sm: `text-[14px] ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-[18px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                base: `text-[16px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-[22px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                lg: `text-[18px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-6 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                xl: `text-[20px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-7 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                twoxl: `text-[24px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-8 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                threexl: `text-[28px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-9 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                fourxl: `text-[32px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-10 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                fivexl: `text-[36px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-[44px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                sixxl: `text-[42px]  ${curTheme === 'dark' ? Drakcolors() :  colors() } font-medium leading-[50px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0 `,
                
            },
            // SEMI BOLD 600  
            semiBold: { 
                'heading-02-sm': `text-[14px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-3 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 14px      
                "heading-02-base": `text-[16px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-4 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 16px      
                "heading-02-xs":`text-[18px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-5 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "heading-02-s":`text-[20px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-6 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "heading-02-m":`text-[24px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-7 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "heading-02-lg":`text-[28px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-8 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`,
                "display-xs": `text-[24px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-7 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 24px 
                "display-s": `text-[28px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-8 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 24px 
                "display-m": `text-[32px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-9 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 24px 
                "display-lg": `text-[36px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-10 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 24px 
                'heading-02-xl': `text-[42px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-[50px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 60px      
                
                sm: `text-[14px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-5 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 14px      
                base: `text-[16px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-6 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 16px      
                lg: `text-[18px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-7 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 18px      
                xl: `text-[20px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-7 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 20px      
                twoxl: `text-[24px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-8 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 24px      
                threexl: `text-[28px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-9 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 30px      
                fourxl: `text-[32px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-10 ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 36px      
                fivexl: `text-[36px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-[44px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 48px      
                sixxl: `text-[42px]  ${curTheme === 'dark' ? Drakcolors() :  colors()} font-semibold leading-[50px] ${props.mono ? "font-geist-mono" : renderFontFamily()} my-0`, // 60px      
                
    
            }

    }

    const renderStyleClass = () =>{
        if(props.variant === "4xl-body-02"){
            return variant.BoldMedium.fourxl
        }else if(props.variant === "4xl-body-01"){
            return variant.BoldNormal.fourxl
        }else if (props.variant === "heading-01-lg"){
            return  variant.BoldMedium["heading-01-lg"]
        }else if (props.variant === "heading-02-lg"){
            return  variant.semiBold["heading-02-lg"]
        }else if (props.variant === "heading-01-m"){
            return variant.BoldMedium["heading-01-m"]
        }else if (props.variant === "heading-01-s"){
            return variant.BoldMedium["heading-01-s"]
        }
        
        else if (props.variant === "heading-02-base"){
            return variant.semiBold["heading-02-base"]
        }else if (props.variant === "display-lg"){
            return  variant.semiBold["display-lg"]
        }else if (props.variant === "label-02-m"){
            return variant.BoldMedium["label-02-m"]
        }else if (props.variant === "lable-01-m"){
            return variant.BoldNormal["lable-01-m"]
        }else if (props.variant === "heading-02-xs"){
            return  variant.semiBold["heading-02-xs"]
        }else if (props.variant === "heading-02-s"){
            return variant.semiBold["heading-02-s"]
        }else if (props.variant === "heading-02-m"){
            return  variant.semiBold["heading-02-m"]
        }else if ( props.variant === "display-m"){
            return  variant.semiBold["display-m"]
        }else if (props.variant === "lable-01-s"){
            return variant.BoldNormal["lable-01-s"]
        }else if (props.variant === "2xl-body-01"){
            return variant.BoldNormal.twoxl
        }else if (props.variant === "label-02-s"){
            return variant.BoldMedium["label-02-s"]
        }else if (props.variant === "heading-01-xs"){
            return  variant.BoldMedium["heading-01-xs"]
        }else if (props.variant === "lable-01-lg"){
            return variant.BoldNormal["lable-01-lg"]
        }else if (props.variant === "xl-body-01"){
            return variant.BoldNormal.xl
        }else if (props.variant === "3xl-body-01"){
            return variant.BoldNormal.threexl
        }else if (props.variant === "5xl-body-01"){
            return variant.BoldNormal.fivexl
        }else if (props.variant === "5xl-body-02"){
            return variant.BoldMedium.fivexl
        }else if (props.variant === "heading-02-xl"){
            return  variant.semiBold["heading-02-xl"]
        }else if ( props.variant === "6xl-body-01"){
            return variant.BoldNormal.sixxl
        }else if ( props.variant === "6xl-body-02"){
            return variant.BoldMedium.sixxl
        }else if ( props.variant === "heading-02-sm"){
            return variant.semiBold["heading-02-sm"]
        }else if(props.variant === 'lable-01-xs'){
            return variant.BoldNormal["lable-01-xs"]
        }else if(props.variant === 'label-01-s'){
            return variant.BoldNormal["lable-01-s"]
        }else if(props.variant === "paragraph-xs"){
            return variant.BoldNormal["paragraph-xs"]

        }
        // new variant 
        else if(props.variant === 'lable-01-xl'){
            return variant.BoldNormal["lable-01-xl"]
        }else if(props.variant === 'paragraph-s'){
            return variant.BoldNormal["paragraph-s"]
        }else if(props.variant === 'paragraph-m'){
            return variant.BoldNormal["paragraph-m"]
        }else if(props.variant === 'paragraph-lg'){
            return variant.BoldNormal["paragraph-lg"]
        }else if(props.variant === 'label-02-xs'){
            return variant.BoldNormal["label-02-xs"]
        }else if(props.variant === 'label-02-lg'){
            return variant.BoldMedium["label-02-lg"]
        }else if(props.variant === 'label-02-xl'){
            return variant.BoldMedium["label-02-xl"]
        }else if(props.variant === 'display-xs'){
            return variant.semiBold["display-xs"]
        }else if(props.variant === 'display-s'){
            return variant.semiBold["display-s"]
        }
        
        else {
            return variant.BoldMedium["label-02-s"]
        }
    }
    return (

        <p
            class={
                [renderStyleClass(),props.class].join(" ")
            }
            id={props.id}
            style={props.style}
            onClick={props.onClick}
        >{props.value ? props.value : props.children}</p>
    )

}