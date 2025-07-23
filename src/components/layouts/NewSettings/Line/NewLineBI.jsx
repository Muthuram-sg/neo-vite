import React, { useEffect, useState } from 'react'
import { useRecoilState } from "recoil";
import { selectedPlant, userLine,settingsLoader } from "recoilStore/atoms";
import LineComponent from 'components/layouts/NewSettings/Line/LineComponent'

const NewLineBI = () => {
 
  const [userForLineData] = useRecoilState(userLine);
  const [headPlant] = useRecoilState(selectedPlant);
  const [, setUserCount] = useState('0')
  const [page,] = useState('Line')
  const [,setIsLoading] = useRecoilState(settingsLoader); 
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
        <div >
       
           <LineComponent />
         
        </div>
       

    )
  }
 

}

export default NewLineBI;
