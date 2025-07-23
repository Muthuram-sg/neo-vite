import moment from "moment";
import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";
import Wind from "assets/neo_icons/Weather/wind.svg";
import SnowFlake from "assets/neo_icons/Weather/snowflake.svg";
import Moon from "assets/neo_icons/Weather/moon.svg";
import Drop from "assets/neo_icons/Weather/drop.svg";
import Thermometer from "assets/neo_icons/Weather/thermometer.svg";
import ThermometerHot from "assets/neo_icons/Weather/thermometer_hot.svg";
import ThermometerCold from "assets/neo_icons/Weather/thermometer_cold.svg";
import SunDim from "assets/neo_icons/Weather/sun_dim.svg";
import Sun from "assets/neo_icons/Weather/sun.svg";
import CloudSun from "assets/neo_icons/Weather/cloud_sun.svg";
import CloudRain from "assets/neo_icons/Weather/cloud_rain.svg";
import CloudLightning from "assets/neo_icons/Weather/cloud_lightning.svg";
import CloudFog from "assets/neo_icons/Weather/cloud_fog.svg";
import SunHorizon from "assets/neo_icons/Weather/sun_horizon.svg";
import CloudMoon from "assets/neo_icons/Weather/cloud_moon.svg";
import Image from "components/Core/Image/ImageNDL";
import useWeatherData from "./useWeatherData";

const renderWeatherIcon = (data, sys) => {
  if (
    moment().format("LT") ===
    (moment(sys.sunrise).format("LT") || moment(sys.sunset).format("LT"))
  ) {
    return SunHorizon;
  } else {
    switch (data.main) {
      case "Clear":
        if (data.icon.charAt(data.icon.length - 1) === "d") {
          return Sun;
        } else {
          return Moon;
        }
      case "Snow":
        return SnowFlake;
      case "Rain":
        return CloudRain;
      case "Drizzle":
        return Drop;
      case "Thunderstorm":
        return CloudLightning;
      case "Clouds":
        if (data.icon.charAt(data.icon.length - 1) === "d") {
          return CloudSun;
        } else {
          return CloudMoon;
        }
      case "Fog":
        return CloudFog;
      case "Haze":
        return SunDim;
      default:
        return Wind;
    }
  }
};
const renderTempIcon = (data) => {
  if (data < 22) {
    return ThermometerCold;
  } else if (data > 28) {
    return ThermometerHot;
  } else {
    return Thermometer;
  }
};

export default function WeatherData(props) {
  const { loading, data, error } = useWeatherData();
  const [headPlant] = useRecoilState(selectedPlant);


  if (loading && headPlant.id !== 0)
    return (
      <div className="flex h-full animate-pulse">
        <div class="rounded-full bg-zinc-700 w-16 h-2 my-auto"></div>
      </div>
    );
  return (
    <>
      {!loading && !error && data && data.message !== "bad query" && (
        <div className="h-full">
        <div className="flex flex-row my-auto h-full">
          {/* <img src={renderWeatherIcon(data.weather[0], data.sys)} alt="icon" /> 
          <img
            src={renderTempIcon(data.main.temp)}
            alt="icon"
            className="-ml-3 mr-1"
          /> */}
          <Image src={renderWeatherIcon(data.weather[0], data.sys)} alt="icon" ></Image>
          <Image src={renderTempIcon(data.main.temp)} alt="icon" className="-ml-3 mr-1"></Image> 
          <div className="text-sm my-auto">
            {parseInt(data.main.temp)}
          </div>
          <div className="text-sm my-auto ml-1">
          °C
          </div>
          
        </div></div>
      )}
    </>
  );
}
