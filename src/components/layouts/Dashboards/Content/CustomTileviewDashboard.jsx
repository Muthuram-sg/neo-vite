import React from "react";
import DashboardTile from 'components/layouts/Dashboards/Content/DashboardTile.jsx'
import {
    userData ,
    themeMode
  } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import DashConfigLight from 'assets/Dashboard Configuration-light.svg?react'; 
import DashConfigDark from 'assets/Dashboard Configuration - Dark.svg?react'; 




export default function CustomTileViewDashboard(props) {
    // console.log(props.ReportList, "props.ReportList")
    const [userDetails] = useRecoilState(userData);  
    const [curTheme] = useRecoilState(themeMode);
  
    return (
<React.Fragment>
{Array.isArray(props.DashboardList) && props.DashboardList.length > 0 ?

<div className="p-4  bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
<div
            className="
              grid gap-4
              grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          >
{Array.isArray(props.DashboardList) && props.DashboardList.map((x, i) => {
                return (
                    <DashboardTile key={x.id} handleEditOpen={props.handleEditOpen} userDetails={userDetails}  InsertStarDashboardLoading={props.InsertStarDashboardLoading} starLoaderId={props.starLoaderId} handleTrigerStar={props.handleTrigerStar} x={x} handleCustomDashboardOpen={props.handleCustomDashboardOpen} handleDetele={props.handleDetele}/>
                )
            })
            }
            </div>
        </div>

:
<div className="flex flex-col items-center p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark min-h-screen">
  <div className="mt-4">
    {curTheme === "dark" ? <DashConfigDark /> : <DashConfigLight />}
  </div>
  <div className="flex flex-col items-center gap-0.5 text-center mt-2">
    <TypographyNDL 
      value="There are no dashboards available for viewing."
      variant="paragraph-s" 
      color="secondary" 
    />
    <TypographyNDL 
      value="Start by creating a new dashboard to visualize your data."
      variant="paragraph-s" 
      color="secondary" 
    />
  </div>

</div>

}

</React.Fragment>
    
    )

}