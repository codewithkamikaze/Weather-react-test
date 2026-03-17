import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// react
import { useEffect, useState } from "react";

// Material UI components
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

// Axios
import axios from "axios";

// momentjs
import moment from "moment";
import "moment/min/locales"; //for change language
import { useTranslation } from "react-i18next";

moment.locale("ar"); //pack up which language as you want

let cancelAxios = null;
function App() {
  const { t, i18n } = useTranslation();

  // States
  const [dateAndTime, setDateAndTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });

  const [locale, setLocal] = useState("en");

  const direction = locale === "ar" ? "rtl" : "ltr";

  // Event Handler
  function handleLanguageClick() {
    if (locale === "en") {
      setLocal("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocal("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }

  useEffect(() => {
    i18n.changeLanguage("ar");
  }, []);

  useEffect(() => {
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));

    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=36.20&lon=37.16&appid=a1334b5b9736578a98d48bfe4c7ec609",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        },
      )
      .then(function (response) {
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;

        setTemp({
          number: responseTemp,
          min: min,
          max: max,
          description: description,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    return () => {
      console.log("Canceling");
      if (cancelAxios) cancelAxios();
    };
  }, []);
  const theme = createTheme({
    // typography: { fontFamily: ["roboto"] },
  });
  return (
    <div className="App">
      <ThemeProvider theme={theme} />
      <Container maxWidth="sm">
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* Card */}
          <div
            style={{
              background: "rgb(28 52 91 / 36%)",
              color: "white",
              padding: "10px",
              borderRadius: "16px",
              boxShadow: "0px 11px 1px rgba(0,0,0,0.5",
              width: "100%",
            }}
            dir={direction}
          >
            {/* content */}
            <div>
              {/* city and type */}
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "start",
                }}
                dir={direction}
              >
                <Typography variant="h2" style={{ marginRight: "20px" }}>
                  {t("Aleppo")}
                </Typography>

                <Typography variant="h5" style={{ marginRight: "20px" }}>
                  {dateAndTime}
                </Typography>
              </div>
              <hr />
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {/* Degree and description */}
                <div>
                  {/* Temp */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h1" style={{ textAlign: "right" }}>
                      {temp.number}
                    </Typography>

                    <img src={temp.icon} alt="Weather Icon" />
                    {/* TODO temp img  */}
                  </div>

                  <Typography variant="h6">{temp.description}</Typography>
                  {/* mix and max */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h5>
                      {t("min")}: {temp.min}
                    </h5>
                    <h5 style={{ margin: " 0px 5px" }}> | </h5>
                    <h5>
                      {t("max")}: {temp.max}
                    </h5>
                  </div>
                </div>
                <CloudIcon style={{ fontSize: "200px", color: "white" }} />
              </div>
            </div>
            {/* == content == */}
          </div>
          {/* translation container */}
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              width: "100%",
              marginTop: "22px",
            }}
            dir={direction}
          >
            <Button
              variant="text"
              style={{ background: "red" }}
              onClick={handleLanguageClick}
            >
              {locale === "en" ? "Arabic" : "English"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
