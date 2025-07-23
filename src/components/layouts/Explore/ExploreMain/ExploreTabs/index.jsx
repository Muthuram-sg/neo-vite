import React, { useEffect } from 'react';
import Trends from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/index";
import { currentPage,exploreTabValue } from "recoilStore/atoms";
import { useRecoilState } from "recoil";

export default function Settings(props) {
    const [tabValue] = useRecoilState(exploreTabValue);
    const [, setCurPage] = useRecoilState(currentPage);
    useEffect(() => {
        setCurPage("Explore");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const MenuList = [
        {
            title: 'Trends',
            content: <Trends width={props.width}/>
        }

    ];

  
    return (
        <React.Fragment>
            <div>
                {MenuList[tabValue].content} 
            </div>
        </React.Fragment>
    )
}
