import React, { useEffect, useState } from 'react'
import HorizontalLine from 'components/Core/HorizontalLine/HorizontalLineNDL'
import Grid from 'components/Core/GridNDL'
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import { useRecoilState } from "recoil";
import { selectedPlant, userLine,settingsLoader } from "recoilStore/atoms";
import LineComponent from 'components/layouts/NewSettings/Line/LineComponent'

const NewLineBI = () => {
 
  const [userForLineData] = useRecoilState(userLine);
  const [headPlant] = useRecoilState(selectedPlant);
  const [UserCount, setUserCount] = useState('0')
  const [page, setPage] = useState('Line')
  const [IsLoading,setIsLoading] = useRecoilState(settingsLoader); 
// console.log(headPlant,"headPlant")
  useEffect(() => {
    const count = userForLineData ? userForLineData.length : 0;
    const formattedCount = count < 10 && count !== 0 ? `0${count}` : `${count}`;
    setUserCount(formattedCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant, userForLineData])


  useEffect(() => {
    
      setTimeout(()=>{
        setIsLoading(false)
      },4000)
      
        // If the component has been loaded before, set isLoading to false
   
}, [headPlant]);

  useEffect(()=>{
    const LinehoverDiv = document.getElementById('linehoverDiv');
    const LinetargetDiv = document.getElementById('linetargetDiv');
    if(LinehoverDiv){
      LinehoverDiv.addEventListener('mouseenter', () => {
        LinetargetDiv.style.display = 'block';
    });
    
    LinehoverDiv.addEventListener('mouseleave', () => {
        LinetargetDiv.style.display = 'none';
    });
    }
   
   

  },[page])
  

  

  if (page === "Line") {
    return (
      <div className='pt-10'>
        
        <HorizontalLine middle variant = 'divider1'/>
        <div>
        <Grid container spacing={2} style={{padding:"16px"}}>
          <Grid item xs={5} sm={5} style={{ display: "flex", flexDirection: "column",gap:"8px" }}>
            <TypographyNDL variant="heading-02-xs" model value="Line Info" />
            <TypographyNDL variant="paragraph-xs" model value="Personalize your factory's identity, location and business hierarchy" />
          </Grid>
          <Grid item xs={7} sm={7} style={{ paddingBottom: "20px" }}>
           <LineComponent />
          </Grid>
        </Grid>
        </div>
        <HorizontalLine middle variant="divider1" />
       
      </div>

    )
  }
 

}

export default NewLineBI;
