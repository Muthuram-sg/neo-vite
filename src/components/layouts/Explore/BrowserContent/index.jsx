/* eslint-disable eqeqeq */
import React, { useRef } from 'react';
import { useRecoilState } from 'recoil';
import BrowserHeader from './components/BrowserHeader';
import BrowserSelect from './components/BrowserSelect';
import BrowserHierarchy from './components/BrowserHierarchy';
import { hierarchyExplore } from 'recoilStore/atoms';


export default function BrowserContent() {

  const [hierarchyArr] = useRecoilState(hierarchyExplore);
  const browserRef = useRef()
  const accordianRef = useRef()

  const expand = () => {
    accordianRef.current.expandAll();
  }

  const collapse = () => {
    accordianRef.current.collapseAll();
  }

  const download = () => {
    accordianRef.current.downloadTable();
  }
  return (
    <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
      <BrowserHeader expand={expand} collapse={collapse} download={download}/>
      <BrowserSelect ref={browserRef} />
      <BrowserHierarchy ref={accordianRef} selectedHierarchy={hierarchyArr} />
    </div>
  );
}
