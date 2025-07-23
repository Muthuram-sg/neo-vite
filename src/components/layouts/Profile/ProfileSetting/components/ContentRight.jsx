import React,{useState} from 'react';
import Card from 'components/Core/KPICards/KpiCardsNDL.jsx';
import Tabs from 'components/layouts/Explore/ExploreMain/ExploreTabs/components/ExploreTabs';
import AccessList from "./AccesslistTable.jsx";
import LoginHistory from "./LoginHistory";

function ContentRight(){
    const [value, setValue] = useState(0);

    const Menu = [
      {
          title: 'Access List',
          content: <AccessList />
      },
      
      {
          title: 'Login History',
          content: <LoginHistory />
      }] 
      

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
     
    return(
        <Card>
            <Tabs MenuTabs={Menu} currentTab={value} tabChange={handleChange}/>
            <div className='mx-4 my-2'>
                {Menu[value].content} 
            </div>
            
        </Card>
    )
}
export default ContentRight;