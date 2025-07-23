import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import Typography from "components/Core/Typography/TypographyNDL"

export default function CustomSwitchNDL(props) {
  const [curTheme] = useRecoilState(themeMode);
  const { t } = useTranslation();

const smallToggle = "w-9 h-5 after:h-4 after:w-4 "
    const defaultToggle = "w-11 h-6 after:h-5 after:w-5 "
  let sizeClass;

  if (props.size) {
    if (props.size === "small") {
      sizeClass = smallToggle;
    } else {
      sizeClass = defaultToggle;
    }
  } else {
    sizeClass = defaultToggle;
  }

  return (
    <div>
      {props.switch && (
    <React.Fragment>
    <div className='flex gap-2'>
        {props.primaryLabel &&
       
        <div className={props.primaryDescription ? "flex flex-col gap-1" : ''}>
<Typography variant='label-01-s' style={{color:curTheme==='dark'?'#ffff':'#000000'}}>{t(props.primaryLabel)}</Typography>

<Typography variant='paragraph-xs'  value={props.primaryDescription} color='tertiary' />
        </div>
} 

        <label class="font-inter relative inline-flex items-center cursor-pointer">
            <input name={props.name} id={props.id} type="checkbox" value="" class="sr-only peer font-inter" onChange={props.onChange}
                checked={props.checked ? props.checked : false}
                disabled={props.disabled ? props.disabled : false}
            />

            <div
                class={sizeClass + " bg-gray-200 rounded-full peer peer-focus:ring-4  dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.5px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"}></div>
            {props.secondaryLabel &&
              <div className={props.secondaryLabel ? "flex flex-col gap-1" : ''}>
                <span class=" text-[14px] leading-4 ml-2 font-normal font-geist-sans text-Text-text-primary dark:text-Text-text-primary-dark">{t(props.secondaryLabel)}</span>
<Typography variant='paragraph-xs'  value={props.secondaryDescription} color='tertiary' />
            
              </div>
                }
        </label>
    </div>
</React.Fragment>
      )}
      {!props.switch && (
        <React.Fragment>
          <div
            class={`flex gap-2 ${props.noPadding ? 'pb-0.5 mt-0.5' : " pt-2 pb-2"}`}
            style={{ ...props.MainDivStyle, ...{ height: props.description ? "48px" : props.noPadding ? undefined :"32px" } }}
          >
            <input
              id={props.id}
              type="checkbox"
              value=""
              class={
                "w-[16px] h-[16px]   rounded-[2px]  cursor-pointer" +
                (props.disabled
                  ? "bg-Secondary_Interaction-secondary-disable  dark:bg-Secondary_Interaction-secondary-disable-dark text-[14px] "
                  : ` hover:border-Focus-focus-primary   focus:border-Focus-focus-primary  dark:hover:border-Focus-focus-primary-dark border-Icon-icon-tertiary   dark:border-Icon-icon-tertiary-dark bg-Background-bg-primary dark:bg-Background-bg-primary-dark`)
              }
              //"focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
              checked={props.checked ? props.checked : false}
              disabled={props.disabled ? props.disabled : false}
              inputRef={props.inputRef}
              onChange={props.onChange}
              style={{color:props.disabled ? "#C2E5FF" : "#0090FF"}}
            />
            <div>
              <label
                for={props.id}
                class={
                  " text-[14px] font-normal font-geist-sans leading-[16px] " +
                  (props.disabled
                    ? " text-Text-text-disabled  dark:text-Text-text-disabled-dark"
                    : " text-Text-text-primary dark:text-Text-text-primary-dark") +
                  " flex flex-col"
                }
              >
                {t(props.primaryLabel ? props.primaryLabel : "")}
              </label>
              <span
                class={
                  "text-[12px] leading-[14px] " +
                  (props.disabled
                    ? "text-Text-text-disabled dark:text-Text-text-disabled-dark"
                    : "text-Text-text-tertiary dark:text-Text-text-tertiary-dark")
                }
              >
                {props.description ? props.description : ""}
              </span>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
