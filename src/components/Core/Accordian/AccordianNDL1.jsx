import React, { useState } from 'react';
import AccordianArrowUp from 'assets/AccordianArrowUp.svg?react';
import AccordianArrowDown from 'assets/AccordianDown.svg?react';
import { useRecoilState } from "recoil";
import {themeMode} from "recoilStore/atoms"
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import TypographyNDL from '../Typography/TypographyNDL';
import Tag from "components/Core/Tags/TagNDL";


const AccordianNDL1 = (props) => {
  const [isOpen, setIsOpen] = useState(props.isexpanded);
  const [curTheme]=useRecoilState(themeMode)

  const toggleAccordion = () => {
    if(props.multiple){
      props.managetoggle()
    }
    else{
      setIsOpen(!isOpen);
    }
  };
  let ThemeColor = (curTheme==='dark') ? '#ffff' : '#646464'
 

  const renderAccordian =()=>{
    if(props.multiple){
   return (
    <div  >
        
    <button
      className={`${props.disabled ? "bg-Secondary_Interaction-secondary-disable dark:bg-Secondary_Interaction-secondary-disable-dark text-Text-text-disabled dark:text-Text-text-disabled  border-Border-border-50 dark:border-Border-border-50-dark "  : 'text-Text-text-primary dark:bg-Background-bg-primary-dark bg-Background-bg-primary hover:bg-Secondary_Interaction-secondary-hover  focus:bg-Secondary_Interaction-secondary-active  dark:hover:bg-Secondary_Interaction-secondary-hover-dark  dark:focus:bg-Secondary_Interaction-secondary-hover-dark     focus:border-Focus-focus-primary dark:focus:border-Focus-focus-primary'} flex focus:border focus:border-solid justify-between items-center  w-full px-[8px] py-[8px] font-geist-sans font-medium text-[16px] leading-[22px] text-left   ${props.isexpand ? '' :'border-b border-Border-border-50 dark:border-Border-border-dark-50' }`}
      onClick={toggleAccordion} 
    >
         <div className='flex items-center gap-2 ' >
          {
            props.icon && 
          <props.icon stroke={props.stroke}/>
          }
          {props.title &&
          <React.Fragment>
            <div className='flex flex-col gap-1'>
              <div className='flex gap-2'>
            <TypographyNDL value={props.title} variant={'label-02-s'}  />
            {
              props.numbertag && 
            <span className={`${props.disabled ? "bg-Secondary_Interaction-secondary-disable dark:bg-Secondary_Interaction-secondary-disable-dark text-Text-text-disabled dark:text-Text-text-disabled  border-Border-border-50 dark:border-Border-border-50-dark " : 'bg-Neutral-neutral-base-alt dark:bg-Neutral-neutral-base-alt-dark text-Text-text-primary dark:text-Text-text-primary-dark '} px-2  h-5 text-center font-geist-mono font-normal rounded-md text-[14px] leading-[16px]`}>
            {props.numbertag}
              </span>
            }
            </div>
            <TypographyNDL value={props.descriptitle ? props.descriptitle : ''} disabled={props.disabled} variant={'paragraph-xs'}  />
            </div>
            
          </React.Fragment>
          }
          </div>
      {props.isexpand ? <AccordianArrowUp class ='ml-4 align-middle  ' stroke={ThemeColor} /> : <AccordianArrowDown class ='ml-4  align-middle' stroke={ThemeColor} /> } 
    </button>
    {/* {props.isexpand && ( */}
      <div className={`py-2 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark w-full ${props.isexpand ? 'border-b border-Border-border-50 dark:border-Border-border-dark-50'  : '' }`} style={{display: props.isexpand ? "block" : "none" }}>
        {props.children}
      </div>
    {/* )} */}
    {
    props.hrLine &&  <HorizontalLine variant={"divider1"}/>
    
    }
  </div>
   )
    }else{
      return(
        <div  >
          
        <button
          className={`${props.disabled ? "bg-Secondary_Interaction-secondary-disable dark:bg-Secondary_Interaction-secondary-disable-dark text-Text-text-disabled dark:text-Text-text-disabled  border-Border-border-50 dark:border-Border-border-50-dark "  : 'text-Text-text-primary dark:bg-Background-bg-primary-dark bg-Background-bg-primary hover:bg-Secondary_Interaction-secondary-hover  focus:bg-Secondary_Interaction-secondary-active  dark:hover:bg-Secondary_Interaction-secondary-hover-dark  dark:focus:bg-Secondary_Interaction-secondary-hover-dark     focus:border-Focus-focus-primary dark:focus:border-Focus-focus-primary'} flex focus:border focus:border-solid justify-between items-center  w-full px-[8px] py-[8px] font-geist-sans font-medium text-[16px] leading-[22px] text-left
             ${isOpen ? '' :'border-b border-Border-border-50 dark:border-Border-border-dark-50' }`}
          onClick={toggleAccordion} 
        >
          <div className='flex items-center gap-2 ' >
          {
            props.icon && 
          <props.icon stroke={props.stroke}/>
          }
          {props.title &&
          <React.Fragment>
            <div className={`${props.descriptitle ? 'flex flex-col gap-1' : ''}`} >
              <div className='flex gap-2 items-center'>
            <TypographyNDL value={props.title} variant={'label-02-s'}  />
            {
              props.numbertag && 
            <Tag name={props.numbertag} disabled={props.disabled}  color={'Neutral-neutral-base-alt'}
            // className="bg-Neutral-neutral-base-alt text-black px-2  h-5 text-center font-geist-mono font-normal leading-4 rounded-md text-[14px]"
            />
            
            }
            </div>
            <TypographyNDL value={props.descriptitle ? props.descriptitle : ''} color="secondary" variant={'paragraph-xs'}  />
            </div>
            
          </React.Fragment>
          }
          </div>
          
          {isOpen ? <AccordianArrowUp class ='ml-4 align-middle  ' stroke={ThemeColor} /> : <AccordianArrowDown class ='ml-4  align-middle' stroke={ThemeColor} /> } 
        </button>
        {isOpen && (
          <div className={`py-2 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark ${isOpen ? 'border-b border-Border-border-50 dark:border-Border-border-dark-50'  : '' }`} >   
            {props.children}
          </div>
        )}
        {
        props.hrLine &&  <HorizontalLine variant={"divider1"}/>
        
        }
      </div>
      )
    }
  }
  return (
    renderAccordian()
  )
};

export default AccordianNDL1;