import React, { useState, useEffect } from "react";

const initialLocationState = {
  latitude: null,
  longitude: null,
  speed: 0
};

function App() {
  const [count, setCount] = useState(0);
  const [light, setLight] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const [status, setStatus] = useState(navigator.onLine);
  // destructuring for simpler component use
  const [{ latitude, longitude, speed }, setLocation] = useState(
    initialLocationState
  );
  // mounted is used to clean up after geoLocation on unmount
  let mounted = true;

  useEffect(() => {
    document.title = `Clicked ${count} times`;
    window.addEventListener("mousemove", handleMousePosition);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    // getCurrentPosition needs a callback function
    // get current position does not have a clean 'unmount' method
    navigator.geolocation.getCurrentPosition(handleGeolocation);
    const watchId = navigator.geolocation.watchPosition(
      handleGeolocation,
      errorCallback,
      { timeout: 10000 }
    );

    // return is to clean up side effects - this cleanup is run when the component unmounts
    return () => {
      window.removeEventListener("mousemove", handleMousePosition);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.geolocation.clearWatch(watchId);
      mounted = false;
    };
  }, [count]);
  const errorCallback = err => {
    console.log(err);
  };
  const handleGeolocation = event => {
    if (mounted) {
      setLocation({
        latitude: event.coords.latitude,
        longitude: event.coords.longitude,
        speed: event.coords.speed
      });
    }
  };
  const incrementCount = () => {
    setCount(prevCount => count + 1);
  };

  const toggleLight = () => {
    setLight(prevLight => !light);
  };

  const handleMousePosition = event => {
    setMousePosition({
      x: event.pageX,
      y: event.pageY
    });
  };

  const handleOnline = event => {
    setStatus(true);
  };

  const handleOffline = event => {
    setStatus(false);
  };
  return (
    <div>
      <h1>Hello World - Basic React Setup</h1>
      <h2>Count Element</h2>
      <button onClick={incrementCount}>Add</button>
      <div>{count}</div>
      <h2>Toggle Element</h2>
      <img
        src={
          light
            ? "https://icon.now.sh/highlight/fd0"
            : "https://icon.now.sh/highlight/aaa"
        }
        style={{
          height: "50px",
          width: "50px"
        }}
        alt="flashlight"
        onClick={toggleLight}
      />
      <h2>Mouse Tracking</h2>
      <div>X: {mousePosition ? mousePosition.x : "null"}</div>
      <div>Y: {mousePosition ? mousePosition.y : "null"}</div>

      <h2>Online Status</h2>
      <div>
        You are currently <strong>{status ? "online" : "offline"}</strong>
      </div>
      <h2>Location Service</h2>
      <div>Latitude:{latitude}</div>
      <div>Longitude:{longitude}</div>
      <div>Speed:{speed ? speed : "0"}</div>
    </div>
  );
}

export default App;
