import React from 'react';
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";

function ModalHeaderNDL(props) {
    const [curTheme] = useRecoilState(themeMode);
    return (
        <React.Fragment>
            {/* {props.children.length === 2 ? (
                <>
                    <div className="flex items-start justify-between  dark:border-Border-border-dark-50 bg-Background-bg-primary dark:bg-Background-bg-primary-dark  p-4 pb-2 border-b-0" >
                        {props.children[0]}
                    </div>
                    <div className="flex items-start justify-between  dark:border-Border-border-dark-50 bg-Background-bg-primary dark:bg-Background-bg-primary-dark pl-4 pb-2 border-b" >
                        {props.children[1]}
                    </div>
                </>
            ) : ( */}
                <div className="flex items-start justify-between border-Border-border-50  dark:border-Border-border-dark-50 py-2 bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-b" >
                    {props.children}
                </div>
            {/* )} */}
            <div  className='mb-2' />
            {/* <hr className="ml-4 mr-4" /> */}
        </React.Fragment>
    );
}

export default ModalHeaderNDL;
