
import React, { useState } from 'react';
import Completed from './icons/circle-check-filled.svg?react';
import Ongoing from './icons/circle-dot.svg?react';
import Notyet from './icons/circle-dashed.svg?react';



const Stepper = (props) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepClick = (stepperName) => {
    if (!props.isbuttonOutSide) {
      setCurrentStep(stepperName);
    }
  };

  const getStepClass = (stepperName) => {
    if (props.isbuttonOutSide) {
      if (stepperName < props.currentStep) return 'completed';
      if (stepperName === props.currentStep) return 'current';
      return 'unfilled';
    } else {
      if (stepperName < currentStep) return 'completed';
      if (stepperName === currentStep) return 'current';
      return 'unfilled';
    }
  };


  const renderIcons =(type)=>{
    if( type === 'completed'){
      return <Completed />

    }else if(type  === 'current'){
      return <Ongoing />

    }else{
    return <Notyet />
    }

  }
 

  return (
    <div className="flex items-center justify-center bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
      
          {props.steps.map((step) => (
            <div key={step.stepperName} className="relative flex-1 flex items-center gap-2">
                
                <button
                  onClick={props.isbuttonOutSide ? undefined : () => handleStepClick(step.stepperName)}
                  className={`${props.isbuttonOutSide ? '' : "cursor-pointer"}  w-full h-8 p-2 text-[14px] leading-[16px]  flex gap-2 items-center justify-center text-center  ${
                    getStepClass(step.stepperName) === 'completed'
                      ? 'border-Primary_Interaction-primary-default dark:border-Primary_Interaction-primary-default-dark text-Primary_Interaction-primary-default  border-b dark:text-Primary_Interaction-primary-default-dark'
                      : getStepClass(step.stepperName) === 'current'
                      ? ' text-Text-text-primary dark:text-Text-text-primary-dark'
                      : 'text-Text-text-tertiary dark:text-Text-text-tertiary-dark'
                  }`}
                >
                   {renderIcons(getStepClass(step.stepperName))}
                  {step.name}
                </button>
            </div>
          ))}
       
    </div>
  );
};

export default Stepper;
