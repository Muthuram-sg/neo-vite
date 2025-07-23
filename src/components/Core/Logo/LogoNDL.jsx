import React from "react";
import PropTypes from 'prop-types';

function LogoNDL(props) {

    return (
        <img
            id={props.id}
            class={props.className}
            src={props.src}
            alt={props.alt}
            style={props.style}
            width={props.width ? props.width : ""}
            height={props.height} />
    );

}

LogoNDL.propTypes = {
    src: PropTypes.any.isRequired

}

export default LogoNDL;