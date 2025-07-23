import React from "react";
import MaskedText from "react-text-mask";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; 
import Typography from 'components/Core/Typography/TypographyNDL'

const MaskedInputNDL = React.forwardRef((props, ref) => {

    const { t } = useTranslation(); 
    let DisableCss =props.disabled ? 'text-Text-text-disabled dark:text-Text-text-disabled-dark bg-Field-field-disable  dark:bg-Field-field-disable-dark placeholder-Text-text-disabled dark:placeholder-Text-text-disabled-dark  ':'text-Text-text-primary dark:text-Text-text-primary-dark bg-Field-field-default dark:bg-Field-field-default-dark placeholder-Text-text-secondary dark:placeholder-Text-text-secondary-dark '
   
    var bordercss = props.error ?
    `bg-Field-field-default dark:bg-Field-field-default-dark border font-geist-mono  border-Negative_Interaction-negative-default dark:border-Negative_interaction-negative-default-dark text-[14px] leading-[16px] rounded-md focus-visible:ring-Negative_Interaction-negative-default dark:focus-visible:ring-Negative_interaction-negative-default-dark  focus:outline-none focus-visible:border-Negative_Interaction-negative-default  block w-full   p-2 dark:text-Text-text-error-dark text-Text-text-error dark:placeholder-Text-text-error-dark placeholder-Text-text-error  h-8   focus-visible:text-Text-text-primary dark:focus:text-Text-text-primary-dark` 
    :

    `font-geist-mono   border-Border-border-50 dark:border-Border-border-dark-50 ${DisableCss}  text-[14px] rounded-md leading-[16px]  block w-full  p-2  focus-visible:border-Focus-focus-primary dark:focus-visible:border-Focus-focus-primary-dark     dark:text-Text-text-secondary-dark  text-Text-text-secondary  focus:outline-none focus-visible:text-Text-text-primary dark:focus-visible:text-Text-text-primary-dark  border   h-8`
    return (
        <React.Fragment>
      <Typography variant={'paragraph-xs'}>{props.lable} </Typography>
            <MaskedText
                mask={props.mask}
                class={bordercss}
                onKeyDown={props.onKeyDown}
                ref={ref}
                value={props.value}
                defaultValue={props.defaultValue}
                placeholder={props.placeholder}
                onBlur={props.onBlur}
                onChange={props.onChange}
                disabled={props.disabled} 
            />
            {props.helperText &&
                <p className="text-sm font-normal leading-[18px] text-Text-text-tertiary dark:text-Text-text-tertiary-dark mb-4 " >
                    {t(props.helperText)}
                </p>}
        </React.Fragment>
    );

});

MaskedInputNDL.propTypes = {
    mask: PropTypes.any.isRequired,
    ref: PropTypes.any.isRequired

}

export default MaskedInputNDL;