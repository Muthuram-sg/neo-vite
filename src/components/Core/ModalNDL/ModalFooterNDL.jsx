import React from 'react';
import { useRecoilState } from 'recoil';
import { themeMode } from 'recoilStore/atoms';
function ModalFooterNDL(props){
    return(
        <div class="flex items-center space-x-2 py-2 rounded-lg border-Border-border-50 dark:border-Border-border-dark-50 border-lg    bg-Background-bg-primary dark:bg-Background-bg-primary-dark justify-end" >
            {props.children}
        </div>
    )
}
export default ModalFooterNDL;