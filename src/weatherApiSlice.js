import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Axios
import axios from "axios";

export const fetchWeather = createAsyncThunk(
  "weatherApi/fetchWeather",
  async () => {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather?lat=36.20&lon=37.16&appid=a1334b5b9736578a98d48bfe4c7ec609",
    );
    // handle success
    const responseTemp = Math.round(response.data.main.temp - 272.15);
    const min = Math.round(response.data.main.temp_min - 272.15);
    const max = Math.round(response.data.main.temp_max - 272.15);
    const description = response.data.weather[0].description;
    const responseIcon = response.data.weather[0].icon;

    return {
      number: responseTemp,
      min: min,
      max: max,
      description: description,
      icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
    };
  },
);
const watherApiSlice = createSlice({
  name: "weatherApi",

  initialState: {
    result: "empty",
    weather: {},
    isLoading: false,
  },

  reducers: {
    changeResult: (state, action) => {
      state.result = "changed";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchWeather.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isLoading = false;

        //redux not like how react work react should use setetc redux use libary behind the scenes
        state.weather = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { changeResult } = watherApiSlice.actions;
export default watherApiSlice.reducer;
