import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';

function ContentSwitcherNDL(props) {
    const [activeClass, setActiveClass] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null); // Tracks which button is hovered

    useEffect(() => {
        setActiveClass(props.switchIndex);
    }, [props.switchIndex]);

    function ClassFnc(x, index, btnClass) {
        const isHovered = hoveredIndex === index;
        const HoverCss = isHovered
            ? "hover:bg-interact-ui-hover hover:text-Text-text-primary dark:hover:text-Text-text-primary-dark dark:hover:bg-Secondary_Interaction-secondary-active-dark"
            : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark font-normal text-Text-text-primary dark:text-Text-text-primary-dark";
        const ActiveCss =
            activeClass === index
                ? "bg-Background-bg-primary dark:bg-Background-bg-primary-dark text-Text-text-primary dark:text-Text-text-primary-dark font-medium"
                : HoverCss;
        const disableCss = x.disabled ? "opacity-30" : ActiveCss;
        const heightClass = props.lessHeight
            ? "text-[12px] leading-[14px] h-5"
            : "text-[14px] leading-[16px] h-7";
        const minWidth = props.noMinWidth ? "" : "min-w-[100px]";
        return `${disableCss} font-geist-sans inline-flex items-center justify-center ${minWidth} ${btnClass} ${heightClass}`;
    }

    return (
        <React.Fragment>
            <div className="flex">
                {props.listArray.length > 0 &&
                    props.listArray.map((x, index) => {
                        let buttonClass = "";
                        let isFullWidth = props.noMinWidth ? "w-full" : "";
                        if (index === 0) {
                            buttonClass = "border-left-radius-25 pl-0.5 " + isFullWidth;
                        } else if (index === props.listArray.length - 1) {
                            buttonClass = "border-right-radius-25 pr-0.5 " + isFullWidth;
                        }

                        return (
                            <div
                                key={x.id}
                                className={`${
                                    props.lessHeight ? "h-6" : "h-8"
                                } bg-Background-bg-tertiary  dark:bg-Background-bg-tertiary-dark ${buttonClass} py-0.5 flex-col justify-center gap-0.5 inline-flex`}
                            >
                                <button
                                    type="button"
                                    id={x.id}
                                    className={ClassFnc(x, index, "rounded-[4px]")}
                                    onClick={() => props.contentSwitcherClick(index)}
                                    onMouseOver={() => setHoveredIndex(index)} // Set hovered index
                                    onMouseOut={() => setHoveredIndex(null)} // Reset hovered index
                                    style={{ width: props.width ? props.width : undefined }}
                                >
                                    {props.icon && (
                                        <props.icon
                                            className="mr-0.5"
                                            stroke={props.stroke}
                                        />
                                    )}
                                    {x.value}
                                </button>
                            </div>
                        );
                    })}
            </div>
        </React.Fragment>
    );
}


ContentSwitcherNDL.propTypes = {
    type: PropTypes.any.isRequired,
    listArray: PropTypes.array.isRequired

}

export default ContentSwitcherNDL;
