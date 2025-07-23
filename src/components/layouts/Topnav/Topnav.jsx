/* External library imports */
import React from "react";

/* Component imports */
import IconButton from "components/Core/Button/IconButton";
import IconInput from "components/Core/TextInput/IconInput";
import LocationSelectNew from "./LocationSelectNew";

/* logo imports */
import NineDots from "../../../assets/neo_icons/Menu/nine_dots.svg";
import NeoLogo from "../../../assets/NEO_Logo.svg";
import Search from "../../../assets/neo_icons/Menu/search_dark.svg";
import WeatherData from "./WeatherData";
import ProfileMenu from "components/app/ProfileMenu";
import Notifications from "components/app/Notifications";
import Logo from 'components/Core/Logo/LogoNDL';

function TopnavFunction(props) {
  
  return (
    <nav class="py-auto bg-black fixed top-0 flex flex-row z-30 w-full h-14 max-h-14">
      <div className="flex">
        <div class="m-3">
          <IconButton icon={NineDots} onClick={props.expandSidebar} />
        </div>
        {/* <img src={NeoLogo} alt="logo" className="ml-5 my-auto" width={45} /> */}
        <Logo src={NeoLogo} alt="logo" width={45} className="ml-5 my-auto" ></Logo>
        <div className="mx-4 border-r h-5 my-auto border-gray-600"></div>
        <div className="my-auto text-base text-gray-400">Dashboard</div>
      </div>
      <span class="absolute h-full left-1/2 -translate-x-1/2">
        <div className="flex h-full">
          <div className="my-auto">
            <IconInput icon={Search} />
          </div>
        </div>
      </span>
      <div className="text-white ml-auto flex flex-row my-auto mr-3">
        <div className="mr-4">
          <WeatherData />
        </div>
        {/* <div>
          <LocationSelect id="location" />
        </div> */}
        <div className="mr-2">
        <LocationSelectNew />
        </div>
        <div className="mr-2">
        <Notifications id="notification" />
        </div>
        <div>
          <ProfileMenu />
        </div>
        
      </div>
    </nav>
  );
}

function reRender(prevprops, nextprops) {
  return prevprops.expandSidebar !== nextprops.expandSidebar ? true : false; // do not rerender when sidenav is expanding
}
const Topnav = React.memo(TopnavFunction, reRender);
export default Topnav;
