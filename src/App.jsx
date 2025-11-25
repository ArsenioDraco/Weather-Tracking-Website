import React, {useState, useEffect, useRef} from "react";

function getApiKey() {
  try {
    if (typeof process !== 'undefined' && process.env?.REACT_APP_OPENWEATHERMAP_KEY) {
      return process.env.REACT_APP_OPENWEATHERMAP_KEY;
    }
  } catch {}
  try {
    if (typeof window !== 'undefined' && window.__OPENWEATHERMAP_KEY__) return window.__OPENWEATHERMAP_KEY__;
  } catch {}
  try {
    if (typeof window !== 'undefined' && window.location?.search) {
      const p = new URLSearchParams(window.location.search);
      const q = p.get('apiKey') || p.get('apikey');
      if (q) return q;
    }
  } catch {}
  return '';
}
const API_KEY = getApiKey();
const BASE_WEATHER = "https://api.openweathermap.org/data/2.5/weather";
const BASE_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";

function aggregateDailyForecast(list) {
  const days = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().slice(0,10);
    if (!days[key]) days[key] = [];
    days[key].push(item);
  });
return Object.keys(days).slice(0,5).map(key => {
    const arr = days[key];
    let chosen = arr.reduce((best, cur) => {
      const curHour = new Date(cur.dt * 1000).getHours();
      const bestHour = new Date(best.dt * 1000).getHours();
      return Math.abs(curHour - 12) < Math.abs(bestHour - 12) ? cur : best;
    }, arr[0]);
    return {
      date: key,
      temp: chosen.main.temp,
      icon: chosen.weather[0].icon,
      desc: chosen.weather[0].description
    };
  });
}

const sampleCurrent = {
  name: "Berlin",
  sys: {country: "DE"},
  main: {temp: 19.5, humidity: 72},
  weather: [{icon: "04d", description: "broken clouds"}],
  wind: {speed: 3.4}
};

