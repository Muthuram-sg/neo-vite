/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import  useTheme from "TailwindTheme";
import ExplorerMain from "components/layouts/Explore/ExploreMain/index.jsx"
import BrowserContent from "./BrowserContent";
import { useRecoilState } from "recoil";
import SplitterLayout from "react-splitter-layout";
import OpenMenu from 'assets/neo_icons/Menu/Open_Menu.svg?react';
import './styles/Splitter-Layout.css'
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import {  currentPage ,themeMode,ExpandWidth, exploreDrawerMode, selectedPlant } from "recoilStore/atoms";


export default function Explore() {
    const browserRef = useRef();
    const [, setCurPage] = useRecoilState(currentPage);
    const theme = useTheme();
    const [curTheme]=useRecoilState(themeMode)
    const[,setwidthExpand]=useRecoilState(ExpandWidth)
    const[widthMain,setwidthMain]=useState('100%')
    const [sidebaropen] = useOutletContext();

    const [open, setIsCollapsed] = useRecoilState(exploreDrawerMode);
    const [headPlant] = useRecoilState(selectedPlant);
      const [pin,setpin] = useState(false);
    const [, setKey ] = useState(0)
    const [, setSplitWidth] = useState(20)


    const primaryContainerRef = useRef(null);
    const MainContainerRef = useRef(null);
    
    useEffect(()=>{
        setTimeout(()=>{
            if(MainContainerRef.current){
             
                setwidthMain(MainContainerRef.current.offsetWidth+'px')
            }
        },1000)

        // To Make it Resize to End
        // hidesidebar
         window.addEventListener('resize', handleDragEnd)
         document.getElementById("hidesidebar")?.addEventListener("click", handleDragEnd);
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    

    useEffect(() => {
        const widthValue = `calc(100% - ${sidebaropen ? "40px" : "252px"})`;
        const splitterElements = document.querySelectorAll('.splitter-layout');

        const width = MainContainerRef.current.offsetWidth; 
        setwidthMain(String(Number(width) + 200) + 'px')

        splitterElements.forEach(element => {
          element.style.width = widthValue;
        });
      }, [sidebaropen]);

    const handleDragEnd = () => {
      // Get the width of the primary container when drag ends
      if (primaryContainerRef.current) {
        const width = primaryContainerRef.current.offsetWidth;
        setwidthExpand(width)
      }
      if(MainContainerRef.current){
        const width = MainContainerRef.current.offsetWidth; 
        setwidthMain(width+'px')
      }
    };

    useEffect(()=>{
      console.clear()
      if(MainContainerRef.current){
        const width = MainContainerRef.current.offsetWidth; 
        setwidthMain(String(Number(width) + 200) + 'px')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps      
    },[pin])

    
    const reduceWidth = () => {
      setSplitWidth(10);
      setKey((prev) => prev + 1); // Update key to force re-render
    };
  
    const increaseWidth = () => {
      setSplitWidth(20);
      setKey((prev) => prev + 1); // Update key to force re-render
    };

    const classes = {
        leftCard: { 
            borderRadius: "0px",
            height: '100vh',
            overflow: "revert",
            borderRight: theme.colorPalette.divider
        }
    }

    const toggleSidebar = () => {
    setpin(!pin); // Toggle pinned state
    if (!pin) {
      setIsCollapsed(false); // Expand the sidebar when pinned
    } else {
      setIsCollapsed(true); // Collapse the sidebar when unpinned
    }
  };

    
    useEffect(() => {
        setCurPage("explore")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    

    return (<>
        <SplitterLayout primaryIndex={1} percentage={true} secondaryInitialSize={20} primaryMinSize={50} secondaryMinSize={20}  onDragEnd={handleDragEnd}>
            {
              open && <>
                <div  ref={primaryContainerRef} className={`bg-Background-bg-primary dark:bg-Background-bg-primary-dark`} style={classes.leftCard}  >
                <div >
                    <BrowserContent CloseLegend={() => {
                        reduceWidth()
                        toggleSidebar()
                    }} ref={browserRef} />
                </div>
            </div>
            </>}
            <div ref={MainContainerRef}>
            <ExplorerMain  width={widthMain}/>
            </div>
        </SplitterLayout >

        {
          !open &&  <>
          <div style={{ background: 'white', borderRight: '1px solid', height: '100vh',width: '50px', textAlign: 'center', position:'relative',zIndex:2,}}>
             <OpenMenu onClick={() => { increaseWidth();
              toggleSidebar(); 
              handleDragEnd() }} />
              <div style={{ marginTop: '40px'}}>
                          <TypographyNDL style={{
                             transform: "rotate(270deg)",
                            //  writingMode: "vertical-rl", // Vertical layout
                             textOrientation: "upright", // Keep letters upright
                          }} variant="heading-02-xs">{"Browse"}</TypographyNDL>
                          </div>
          </div>
          </>
        }</>
  );
}
