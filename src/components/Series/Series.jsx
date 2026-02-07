import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import styles from "./series.module.scss";
import useAxios from "../../hooks/useAxios";
import { GET_SERIES, GET_DATABASE } from "../../assets/apis/apiList";
import DynamicDataView from "../Reusables/DynamicDataView/DynamicDataView";
import LoadingCard from "../Reusables/LoadingCard/LoadingCard";
import { Card } from "primereact/card";
import { getAuthUser } from "../../helpers/authUser";

const rawRule = {
  year: null,
  network: null,
  genre: null,
  origin: null,
};

export default function Series() {
  const [seriesData, setSeriesData] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [origins, setOrigins] = useState([]);

  const [filters, setFilters] = useState(rawRule);

  const {
    callApi: getSeriesList,
    errors,
    loading,
    progress,
    cancelRequest,
    downloadFile,
  } = useAxios(GET_SERIES);

  useEffect(() => {
    let { userID } = getAuthUser();
    try {
      getSeriesList({ userID: userID })
        .then((res) => {
          if (res == "noUser") return toast.error("Error", "No User Logged In");
          setSeriesData(res.series);
          setNetworks(res.networks);
          setGenres(res.genres);
          setOrigins(res.origins);
          setYears(res.years);
        })
        .catch((err) => {
          toast.error("Error", err);
          console.log("Error :>", err);
        })
        .finally(() => {
          console.log("Axios Function Stopped.");
        });

      // Cancel if needed
      // cancelRequest();

      // Download a file
      // downloadFile("/getSeriesData", "series.xlsx");
      if (errors) toast.error("Error", errors);
    } catch (err) {
      console.log("Error while fetching Server :>", err);
      toast.error("Error", err);
    }
  }, []);

  useEffect(() => {
    const filtered = seriesData.filter((m) => {
      return (
        (!filters.year || m.Year == filters.year.year) &&
        (!filters.network || m.Network == filters.network.network) &&
        (!filters.genre || m.Genre.includes(filters.genre.genre)) &&
        (!filters.origin || m.Origin.includes(filters.origin.origin))
      );
    });
    setFilteredSeries(filtered);
  }, [seriesData, filters]);

  const renderFilters = () => {
    return (
      <div className={styles.filters}>
        <Dropdown
          className={styles.selection}
          showClear
          value={filters?.year}
          options={years}
          optionLabel="year"
          onChange={(e) => setFilters({ ...filters, year: e.value })}
          placeholder="Year"
        />
        <Dropdown
          className={styles.selection}
          showClear
          value={filters?.network}
          options={networks}
          optionLabel="network"
          onChange={(e) => setFilters({ ...filters, network: e.value })}
          placeholder="Network"
        />
        <Dropdown
          className={styles.selection}
          showClear
          value={filters?.genre}
          options={genres}
          optionLabel="genre"
          onChange={(e) => setFilters({ ...filters, genre: e.value })}
          placeholder="Genre"
        />
        <Dropdown
          className={styles.selection}
          showClear
          value={filters?.origin}
          options={origins}
          optionLabel="origin"
          onChange={(e) => setFilters({ ...filters, origin: e.value })}
          placeholder="Origin"
        />
      </div>
    );
  };

  const resetData = () => {
    setFilters(rawRule);
  };

  return (
    <Card unstyled="false" subTitle={<span className="pageTitle">Series</span>}>
      <Card className="pageContent">
        <div className={styles.seriesGrid}>
          {loading ? (
            <LoadingCard />
          ) : (
            <DynamicDataView
              filters={renderFilters()}
              data={filteredSeries}
              handleReset={resetData}
            />
          )}
        </div>
      </Card>
    </Card>
  );
}
