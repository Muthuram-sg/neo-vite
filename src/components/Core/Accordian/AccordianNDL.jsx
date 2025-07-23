import React from "react";
import PropTypes from 'prop-types';
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
    AccordionList,
} from "@tremor/react";

function AccordianNDL(props) {
    const { Listarray, expandedIndex, handleAccordionClick } = props;

    return (
        <AccordionList className="tw-max-w-md tw-mx-auto">
            {Listarray.length > 0 &&
                Listarray.map((val, index) => (
                    <Accordion
                        key={index}
                        expanded={expandedIndex === index}
                        onChange={() => handleAccordionClick(index)}
                    >
                        <AccordionHeader>{val.title}</AccordionHeader>
                        <AccordionBody>
                            {val.content}
                        </AccordionBody>
                    </Accordion>
                ))
            }
        </AccordionList>
    );
}

AccordianNDL.propTypes = {
    Listarray: PropTypes.array.isRequired,
    expandedIndex: PropTypes.number,
    handleAccordionClick: PropTypes.func.isRequired
};

export default AccordianNDL;
