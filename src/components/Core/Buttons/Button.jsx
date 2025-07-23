import React,{useState} from 'react';
function Button(props){
    const [hover,setHover] = useState(false);
    let buttonType;
    if (props) {
        if (props.type === 'secondary') {
          buttonType = `${props.disabled ? "opacity-30 " : "hover:bg-secondary-btn-hover focus:border-focus-01 active:bg-secondary-btn-active"}secondary-text bg-white border border-solid border-secondary-btn-border rounded font-medium text-base pl-2 pr-2 h-10`;
        } else if (props.type === 'tertiary') {
          buttonType = `${props.disabled ? "opacity-30 " : "hover:bg-interact-accent-hover hover:text-white active:bg-interact-accent-active "}text-interact-accent-default bg-white border border-solid border-interact-accent-default rounded font-medium text-base pl-2 pr-2 h-10`;
        } else if (props.type === 'ghost') {
          buttonType = `${props.disabled ? "opacity-30 " : "hover:bg-interact-ui-hover hover:text-interact-accent-hover focus:text-interact-accent-default focus:border focus:border-solid focus:border-interact-accent-hover active:text-interact-accent-active active:bg-interact-ui-active "}text-interact-accent-default bg-white rounded font-medium text-base pl-2 pr-2 h-10`;
        } else {
          buttonType = `text-white ${props.disabled ? "opacity-30 bg-interact-accent-default" : "bg-btn-prime-bg hover:bg-btn-prime-hover focus:bg-btn-prime-hover active:bg-btn-prime-active"} rounded font-medium text-base pl-2 pr-2 h-10`;
        }
      }
      let iconStroke;

        if (props.type === 'tertiary') {
        iconStroke = hover ? '#FFFF' : '#0F6FFF';
        } else if (props.type === 'secondary') {
        iconStroke = '#525252';
        } else if (props.type === 'ghost') {
        iconStroke = '#0C5EE0';
        } else {
        iconStroke = '#FFFF';
        }
   
    const iconCss = `align-middle${props.value?" w-4 h-4 ml-2":""}`
    return( 
        <button type="button" class={buttonType} onClick={props.onClick && !props.disabled && !props.loading?props.onClick:{}} onMouseOver={()=>setHover(true)} onMouseOut={()=>setHover(false)}>
            {props.iconLeft ? <props.iconLeft stroke={"#FCFCFC"}/> : ''}
            {props.value?props.value:""}
            {props.icon &&
             <props.icon  stroke={iconStroke} class={iconCss}/>}
        </button> 
    )
}
export default Button;