import React from 'react';
import { useRecoilState } from 'recoil';
import { themeMode } from 'recoilStore/atoms';
function ModalContentNDL(props){ 
    return(
        <div class={`${props.height ? "" :"max-h-modal"}  overflow-y-auto py-2 px-2 bg-Background-bg-primary dark:bg-Background-bg-primary-dark`}  style={{height : props.height ? props.height : undefined}}>
            {props.children}
        </div>
    )
}
export default ModalContentNDL;