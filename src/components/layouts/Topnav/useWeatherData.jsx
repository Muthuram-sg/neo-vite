import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";
import { useEffect, useState } from "react";

const useWeatherData = () => {
  const [headPlant] = useRecoilState(selectedPlant);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  
  const getWeatherData = async () => {
    if (headPlant.area_name)
    {var url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      headPlant.area_name +
      "&units=metric&appid=47fd245736ab4d7ed57d79abb247fbb7";
    setLoading(true);
    await fetch(url, {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });}
  };

  useEffect(() => {
    getWeatherData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant.area_name]);

  return { loading, data, error };
};

export default useWeatherData;
