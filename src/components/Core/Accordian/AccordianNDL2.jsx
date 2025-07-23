import React, { useState, useRef, useEffect } from 'react';
import AccordianArrowUp from 'assets/AccordianArrowUp.svg?react';
import AccordianArrowDown from 'assets/AccordianDown.svg?react';
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import TypographyNDL from '../Typography/TypographyNDL';
import Tag from "components/Core/Tags/TagNDL";

const AccordianNDL2 = (props) => {
  const [isOpen, setIsOpen] = useState(props.isexpanded); // Local state for non-multiple accordion
  const [curTheme] = useRecoilState(themeMode);
  const [flipDirection, setFlipDirection] = useState("down"); // Manage flip direction
  const contentRef = useRef(null);

  // Toggle Accordion
  const toggleAccordion = () => {
    if (props.multiple) {
      props.managetoggle(); // Delegate to parent
    } else {
      setIsOpen((prev) => !prev); // Local state toggle
    }
  };

  // Check available space and adjust flip
  useEffect(() => {
    // if (isOpen) {
    //   const rect = contentRef.current?.getBoundingClientRect();
    //   const viewportHeight = window.innerHeight;

    //   if (rect && rect.bottom > viewportHeight) {
    //     setFlipDirection("up");
    //   } else {
    //     setFlipDirection("down");
    //   }
    // }
    setIsOpen(props.isexpanded)
    // console.log(isOpen,"isOpenisOpen",props.isexpanded)
  }, [props.isexpanded]);

  // Theme color based on the current theme mode
  const ThemeColor = curTheme === "dark" ? "#ffff" : "#646464";

  return (
    <div>
      {/* Accordion Header */}
      <button
        className={`flex justify-between items-center w-full px-[8px] py-[8px] font-geist-sans text-Text-text-primary font-medium text-[16px] leading-[22px] text-left dark:bg-Background-bg-primary-dark bg-Background-bg-primary hover:bg-Secondary_Interaction-secondary-hover focus:bg-Secondary_Interaction-secondary-active dark:hover:bg-Secondary_Interaction-secondary-hover-dark dark:focus:bg-Secondary_Interaction-secondary-active-dark focus:border focus:border-solid focus:border-primary-border ${
          isOpen ? "" : "border-b border-Border-border-50 dark:border-Border-border-dark-50"
        }`}
        onClick={toggleAccordion}
      >
        <div className="flex items-center gap-2">
          {props.icon && <props.icon stroke={props.stroke} />}
          {props.title && (
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <TypographyNDL value={props.title} variant="label-02-s" />
                {props.numbertag && (
                  <span className="bg-Neutral-neutral-base-alt text-Text-text-primary dark:text-Text-text-primary-dark px-2 h-5 text-center font-geist-mono font-normal rounded-md text-[14px] leading-[16px]">
                    {props.numbertag}
                  </span>
                )}
              </div>
              <TypographyNDL value={props.descriptitle || ""} variant="paragraph-xs" />
            </div>
          )}
        </div>
        {isOpen ? (
          <AccordianArrowUp className="ml-4 align-middle" stroke={ThemeColor} />
        ) : (
          <AccordianArrowDown className="ml-4 align-middle" stroke={ThemeColor} />
        )}
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div
        ref={contentRef}
        className={`accordion-content py-2 bg-Background-bg-primary dark:bg-Background-bg-primary-dark w-full border-b border-Border-border-50 dark:border-Border-border-dark-50 transition-transform duration-300
        }`}
      >
        {props.children}
      </div>
      )}

      {/* Optional Horizontal Line */}
      {props.hrLine && <HorizontalLine variant="divider1" />}
    </div>
  );
};

export default AccordianNDL2;
