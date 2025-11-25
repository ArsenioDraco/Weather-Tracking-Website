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

