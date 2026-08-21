import {
  CloudSun,
} from "lucide-react";


const WeatherBadge = ({
  weather,
}) => {
  if (!weather?.temp) {
    return null;
  }


  return (
    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg text-xs">

      <CloudSun size={15} />

      <span>
        {weather.temp}°C
      </span>

      <span className="capitalize">
        {weather.description}
      </span>

    </div>
  );
};


export default WeatherBadge;
