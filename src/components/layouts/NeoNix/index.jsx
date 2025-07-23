import React from "react";
import { NeonixSubmenu } from './SubMenuOptions'; 
import {  neonixTabValue } from "recoilStore/atoms";
import { useRecoilState } from "recoil";

export default function Neonix() {
  const [neonixTab] = useRecoilState(neonixTabValue); //NOSONAR

  return (
   
    <React.Fragment>
    <div className="bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
      {
        neonixTab !== null ?
        <React.Fragment>
           {NeonixSubmenu[neonixTab].content}
        </React.Fragment>
      :
        <React.Fragment>
          <div className="flex justify-center items-center h-full">
            <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Enable Submodule Access For Neonix in Settings</h1>
          </div>
        </React.Fragment>
      }
        {/* {NeonixSubmenu[3].content} */}
    </div>
</React.Fragment>
  );
}