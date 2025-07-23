import React from "react"; 
import LoadingScreenNDL from 'LoadingScreenNDL'; 
import ExploreTabs from "components/layouts/Explore/ExploreMain/ExploreTabs/index";
import { useRecoilState } from "recoil";
import { trendsload } from "recoilStore/atoms";
import DateRange from "./ExploreTopBar/DateRange";

export default function ExplorerMain(props) {
    const [trendsOnlineLoad] = useRecoilState(trendsload);

    
    return (
        <div > 
                <DateRange />
                <div style={{padding:"0px"}}>
                    <ExploreTabs width={props.width}/>
                </div> 
            {trendsOnlineLoad && <LoadingScreenNDL />}
        </div>
    );
}

