import React, { useContext, useEffect, useState } from "react";
import "chart.js/auto";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { GET_DATABASE } from "../../assets/apis/apiList";
import useAxios from "../../hooks/useAxios";
import styles from "./database.module.scss";
import { ToastContext } from "../../hooks/ToastProvider/ToastProvider";
import { Carousel } from "primereact/carousel";

export default function Database() {
  const toast = useContext(ToastContext);
  const { callApi: getDataBase, loading } = useAxios(GET_DATABASE);

  const MIN_COUNT = 15; // You can adjust this threshold

  const filterStats = (dataObj) => {
    return Object.fromEntries(
      Object.entries(dataObj).filter(([_, count]) => count >= MIN_COUNT)
    );
  };

  const createPieData = (dataObj, label, filter) => {
    const filtered = filter ? filterStats(dataObj) : dataObj;
    const ordered = Object.keys(filtered)
      .sort()
      .reduce((obj, key) => {
        obj[key] = filtered[key];
        return obj;
      }, {});
    return {
      labels: Object.keys(ordered),
      datasets: [
        {
          label,
          data: Object.values(ordered),
          backgroundColor: [
            "#FF7043",
            "#FFA726",
            "#66BB6A",
            "#42A5F5",
            "#AB47BC",
            "#26A69A",
            "#D4E157",
            "#FFCA28",
          ],
          hoverBackgroundColor: "#64B5F6",
        },
      ],
    };
  };

  const createBarData = (dataObj, label, filter) => {
    const filtered = filter ? filterStats(dataObj) : dataObj;
    return {
      labels: Object.keys(filtered),
      datasets: [
        {
          label,
          tension: 0.4,
          backgroundColor: "#42A5F5",
          data: Object.values(filtered),
        },
      ],
    };
  };

  const createMergedYearBarData = (
    movieYears,
    seriesYears,
    label1 = "Movies",
    label2 = "Series"
  ) => {
    // Get all unique years from both datasets and sort them
    const allYears = Array.from(
      new Set([...Object.keys(movieYears), ...Object.keys(seriesYears)])
    ).sort();

    return {
      labels: allYears,
      datasets: [
        {
          label: label1,
          tension: 0.4,
          backgroundColor: "#42A5F5",
          data: allYears.map((year) => movieYears[year] || 0),
        },
        {
          label: label2,
          tension: 0.4,
          backgroundColor: "#FFA726",
          data: allYears.map((year) => seriesYears[year] || 0),
        },
      ],
    };
  };

  const getGenreColorMap = (movieGenres, seriesGenres) => {
    const allGenres = new Set([
      ...Object.keys(movieGenres),
      ...Object.keys(seriesGenres),
    ]);

    const genreColorMap = {};
    Array.from(allGenres).forEach((genre, index) => {
      genreColorMap[genre] = getUniqueColor(index);
    });

    return genreColorMap;
  };

  const createMergedGenreDoughnutData = (movieGenres, seriesGenres) => {
    movieGenres = filterStats(movieGenres);
    seriesGenres = filterStats(seriesGenres);
    const genreColorMap = getGenreColorMap(movieGenres, seriesGenres);
    const allGenres = Object.keys(genreColorMap).sort();

    const movieData = allGenres.map((genre) => movieGenres[genre] || 0);
    const seriesData = allGenres.map((genre) => seriesGenres[genre] || 0);

    const backgroundColor = allGenres.map((genre) => genreColorMap[genre]);

    return {
      labels: allGenres,
      datasets: [
        {
          label: "Movies",
          data: movieData,
          backgroundColor,
          borderWidth: 2,
        },
        {
          label: "Series",
          data: seriesData,
          backgroundColor,
          borderWidth: 2,
        },
      ],
    };
  };

  const getUniqueColor = (index) => {
    const palette = [
      "#42A5F5",
      "#66BB6A",
      "#FFA726",
      "#AB47BC",
      "#FF7043",
      "#26A69A",
      "#D4E157",
      "#FFCA28",
      "#8D6E63",
      "#78909C",
      "#5C6BC0",
      "#EC407A",
      "#26C6DA",
      "#9CCC65",
      "#FFB74D",
      "#8E24AA",
      "#F44336",
      "#00ACC1",
      "#7CB342",
      "#FDD835",
    ];
    return palette[index % palette.length];
  };

  const [movieStats, setMovieStats] = useState({
    years: {},
    origins: {},
    genres: {},
    ratings: {},
    IMDbs: {},
    languages: {},
    total: 0,
  });

  const [seriesStats, setSeriesStats] = useState({
    years: {},
    origins: {},
    IMDbs: {},
    genres: {},
    total: 0,
  });

  const [isroStats, setIsroStats] = useState({
    status: {},
    launchConfig: {},
    launchSite: {},
    launchOrbit: {},
    launchYear: {},
    total: 0,
  });

  useEffect(() => {
    getDataBase({ isApp: true })
      .then((data) => {
        // Movies stats
        const mYears = {},
          mGenres = {},
          mRatings = {},
          mOrigins = {},
          mIMDBs = {},
          mLanguages = {};
        if (Array.isArray(data.movies)) {
          data.movies.forEach((item) => {
            // Years
            mYears[item.Year] = (mYears[item.Year] || 0) + 1;
            // Genres
            if (item.Genre) {
              item.Genre.split(",").forEach((g) => {
                const genre = g.trim();
                mGenres[genre] = (mGenres[genre] || 0) + 1;
              });
            }
            // Origin
            if (item.Origin) {
              item.Origin.split(",").forEach((g) => {
                const origin = g.trim();
                mOrigins[origin] = (mOrigins[origin] || 0) + 1;
              });
            }
            // Ratings
            if (item.Rating) {
              mRatings[item.Rating] = (mRatings[item.Rating] || 0) + 1;
            }
            // IMDb
            if (item.IMDB) {
              mIMDBs[item.IMDB] = (mIMDBs[item.IMDB] || 0) + 1;
            }
            // Languages
            if (item.Language) {
              item.Language.split(",").forEach((l) => {
                const lang = l.trim();
                mLanguages[lang] = (mLanguages[lang] || 0) + 1;
              });
            }
          });
        }
        setMovieStats({
          years: mYears,
          genres: mGenres,
          origins: mOrigins,
          ratings: mRatings,
          IMDbs: mIMDBs,
          languages: mLanguages,
          total: data.movies?.length || 0,
        });

        // Series stats
        const sYears = {},
          sGenres = {},
          sIMDBs = {},
          sOrigins = {};
        if (Array.isArray(data.series)) {
          data.series.forEach((item) => {
            sYears[item.Year] = (sYears[item.Year] || 0) + 1;
            if (item.Genre) {
              item.Genre.split(",").forEach((g) => {
                const genre = g.trim();
                sGenres[genre] = (sGenres[genre] || 0) + 1;
              });
            }
            // Origin
            if (item.Origin) {
              item.Origin.split(",").forEach((g) => {
                const origin = g.trim();
                sOrigins[origin] = (sOrigins[origin] || 0) + 1;
              });
            }
            // IMDb
            if (item.IMDB) {
              sIMDBs[item.IMDB] = (sIMDBs[item.IMDB] || 0) + 1;
            }
          });
        }
        setSeriesStats({
          years: sYears,
          origins: sOrigins,
          IMDbs: sIMDBs,
          genres: sGenres,
          total: data.series?.length || 0,
        });

        // ISRO stats
        const iStatus = {},
          iConfig = {},
          iSite = {},
          iOrbit = {},
          iLaunch = {};
        if (Array.isArray(data.isro)) {
          data.isro.forEach((item) => {
            if (item.Result) {
              iStatus[item.Result] = (iStatus[item.Result] || 0) + 1;
            }
            if (item.Config) {
              iConfig[item.Config] = (iConfig[item.Config] || 0) + 1;
            }
            if (item.LaunchSite) {
              iSite[item.LaunchSite] = (iSite[item.LaunchSite] || 0) + 1;
            }
            if (item.Orbit) {
              iOrbit[item.Orbit] = (iOrbit[item.Orbit] || 0) + 1;
            }
            if (item.Date) {
              var Year = new Date(item.Date).getFullYear();
              iLaunch[Year] = (iLaunch[Year] || 0) + 1;
            }
          });
        }
        setIsroStats({
          status: iStatus,
          launchConfig: iConfig,
          launchSite: iSite,
          launchOrbit: iOrbit,
          launchYear: iLaunch,
          total: data.isro?.length || 0,
        });
      })
      .catch((err) => {
        toast.error("Error", err);
        console.log("Error :>", err);
      });
    // eslint-disable-next-line
  }, []);

  // Add this function near the top of your component (outside of render)
  const getChartOptionsWithTitle = (title) => ({
    plugins: {
      title: {
        display: true,
        text: title,
        position: "bottom",
        color: "#1769aa",
        font: {
          size: 18,
          weight: "bold",
          family: "Times New Roman",
        },
        padding: {
          top: 10,
          bottom: 10,
        },
      },
      legend: {
        labels: {
          font: {
            size: 13,
          },
        },
      },
    },
  });

  const chartItems = [
    {
      key: "multiStats",
      content: (
        <div className={styles.subSection}>
          <Chart
            className={styles.subChart}
            type="doughnut"
            data={createMergedGenreDoughnutData(
              movieStats.genres,
              seriesStats.genres,
              "Movies",
              "Series"
            )}
          />
          <Chart
            className={styles.subChart}
            type="pie"
            data={createPieData(movieStats.ratings, "Ratings", true)}
            options={getChartOptionsWithTitle("Ratings")}
          />
          <Chart
            className={styles.subChart}
            type="pie"
            data={createPieData(movieStats.languages, "Languages", true)}
            options={getChartOptionsWithTitle("Languages")}
          />
        </div>
      ),
    },
    {
      key: "yearBar",
      content: (
        <Chart
          height="120%"
          className={styles.mainChart}
          type="bar"
          data={createMergedYearBarData(
            movieStats.years,
            seriesStats.years,
            "Movies",
            "Series"
          )}
          options={getChartOptionsWithTitle("Releasing Year")}
        />
      ),
    },
    {
      key: "originLine",
      content: (
        <Chart
          height="120%"
          className={styles.mainChart}
          type="line"
          data={createMergedYearBarData(
            movieStats.origins,
            seriesStats.origins,
            "Movies",
            "Series"
          )}
          options={getChartOptionsWithTitle("Origin")}
        />
      ),
    },
    {
      key: "imdbLine",
      content: (
        <Chart
          height="120%"
          className={styles.mainChart}
          type="line"
          data={createMergedYearBarData(
            movieStats.IMDbs,
            seriesStats.IMDbs,
            "Movies",
            "Series"
          )}
          options={getChartOptionsWithTitle("IMDb Ratings")}
        />
      ),
    },
  ];

  const isroChartItems = [
    {
      key: "isroStats",
      content: (
        <div className={styles.subSection}>
          <Chart
            className={styles.subChart}
            type="pie"
            data={createPieData(isroStats.launchSite, "Site", false)}
            options={getChartOptionsWithTitle("Launch Site")}
          />
          <Chart
            className={styles.subChart}
            type="pie"
            data={createPieData(isroStats.launchOrbit, "Orbit", false)}
            options={getChartOptionsWithTitle("Launch Orbit")}
          />
          <Chart
            className={styles.subChart}
            type="pie"
            data={createPieData(isroStats.status, "Result", false)}
            options={getChartOptionsWithTitle("Launch Result")}
          />
        </div>
      ),
    },
    {
      key: "configStat",
      content: (
        <Chart
          height="120%"
          className={styles.mainChart}
          type="line"
          data={createBarData(isroStats.launchConfig, "Config", false)}
          options={getChartOptionsWithTitle("Rocket Config")}
        />
      ),
    },
    {
      key: "configStat",
      content: (
        <Chart
          height="120%"
          className={styles.mainChart}
          type="line"
          data={createBarData(isroStats.launchYear, "Year", false)}
          options={getChartOptionsWithTitle("Launch Year")}
        />
      ),
    },
  ];

  return (
    <Card
      unstyled="false"
      subTitle={<span className="pageTitle">Dashboard</span>}
    >
      <Card className="pageContent">
        <div className={styles.stats}>
          <div className={styles.section}>
            <Card title="🎬 Movie & 📺 Series Statistics">
              <Carousel
                value={chartItems}
                itemTemplate={(item) => (
                  <div className={styles.carouselItem}>{item.content}</div>
                )}
                numVisible={1}
                numScroll={1}
                // showNavigators={false}
                showIndicators={false}
                circular
                autoplayInterval={5000}
                className={styles.chartCarousel}
              />
            </Card>
          </div>
          <div className={styles.section}>
            <Card title="🚀 ISRO Statistics">
              <Carousel
                value={isroChartItems}
                itemTemplate={(item) => (
                  <div className={styles.carouselItem}>{item.content}</div>
                )}
                numVisible={1}
                numScroll={1}
                // showNavigators={false}
                showIndicators={false}
                circular
                autoplayInterval={5000}
                className={styles.chartCarousel}
              />
              {/* <div className={styles.subSection}>
                <Chart
                  className={styles.subChart}
                  type="pie"
                  data={createPieData(isroStats.launchSite, "Site", false)}
                  options={getChartOptionsWithTitle("Launch Site")}
                />
                <Chart
                  className={styles.subChart}
                  type="pie"
                  data={createPieData(isroStats.launchOrbit, "Orbit", false)}
                  options={getChartOptionsWithTitle("Launch Orbit")}
                />
                <Chart
                  className={styles.subChart}
                  type="pie"
                  data={createPieData(isroStats.status, "Result", false)}
                  options={getChartOptionsWithTitle("Launch Result")}
                />
              </div>
              <div className={styles.subSection}>
                <Chart
                  className={styles.subChart}
                  style={{ width: "48%" }}
                  type="line"
                  data={createBarData(isroStats.launchConfig, "Config", false)}
                  options={getChartOptionsWithTitle("Rocket Config")}
                />
                <Chart
                  className={styles.subChart}
                  style={{ width: "48%" }}
                  type="line"
                  data={createBarData(isroStats.launchYear, "Year", false)}
                  options={getChartOptionsWithTitle("Launch Year")}
                />
              </div> */}
            </Card>
          </div>
        </div>
      </Card>
    </Card>
  );
}
