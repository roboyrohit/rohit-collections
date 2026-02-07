import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import styles from "./isro.module.scss";
import useAxios from "../../hooks/useAxios";
import { GET_ISRO_LAUNCHS, GET_DATABASE } from "../../assets/apis/apiList";
import DynamicDataView from "../Reusables/DynamicDataView/DynamicDataView";
import LoadingCard from "../Reusables/LoadingCard/LoadingCard";
import { Card } from "primereact/card";

const rawRule = {
  year: null,
  launcher: null,
  launchPad: null,
  orbit: null,
  result: null,
}

export default function Isro() {
  const [isroData, setIsroData] = useState([]);
  const [filteredIsro, setFilteredIsro] = useState([]);
  const [launchers, setLaunchers] = useState([]);
  const [launchPads, setlaunchPads] = useState([]);
  const [orbits, setOrbits] = useState([]);
  const [years, setYears] = useState([]);
  const [results, setResults] = useState([]);

  const [filters, setFilters] = useState(rawRule);

  const {
    callApi: getIsroLaunch,
    errors,
    loading,
    progress,
    cancelRequest,
    downloadFile,
  } = useAxios(GET_ISRO_LAUNCHS);

  useEffect(() => {
    try {
      getIsroLaunch()
        .then((res) => {
          setIsroData(res.isroLaunches);
          setLaunchers(res.launchers);
          setlaunchPads(res.launchPads);
          setOrbits(res.orbits);
          setResults(res.results);
          setYears(res.years);
        })
        .catch((err) => {
          console.log("Error :>", err);
        })
        .finally(() => {
          console.log("Axios Function Stopped.");
        });

      // Cancel if needed
      // cancelRequest();

      // Download a file
      // downloadFile(isro", "series.xlsx");
      if (errors) {
        console.log("Error Occurred :>", errors);
      }
    } catch (err) {
      console.log("Error while fetching Server :>", err);
    }
  }, []);

  useEffect(() => {
    const filtered = isroData.filter((m) => {
      return (
        (!filters.launcher || m.Config == filters.launcher.launcher) &&
        (!filters.launchPad || m.LaunchSite == filters.launchPad.launchPad) &&
        (!filters.orbit || m.Orbit == filters.orbit.Orbit) &&
        (!filters.result || m.Result == filters.result.Result) &&
        (!filters.year || m.Date.includes(filters.year.Year))
      );
    });
    setFilteredIsro(filtered);
  }, [isroData, filters]);

  const renderFilters = () => {
    return (
      <div className={styles.filters}>
        <Dropdown
          className={styles.selection}
          showClear
          value={filters?.launcher}
          options={launchers}
          optionLabel="launcher"
          onChange={(e) => setFilters({ ...filters, launcher: e.value })}
          placeholder="Launcher"
        />
        <Dropdown
          className={styles.selection}
          showClear
          value={filters?.launchPad}
          options={launchPads}
          optionLabel="launchPad"
          onChange={(e) => setFilters({ ...filters, launchPad: e.value })}
          placeholder="Launch Pad"
        />
        <Dropdown
          className={styles.selection}
          showClear
          value={filters?.orbit}
          options={orbits}
          optionLabel="Orbit"
          onChange={(e) => setFilters({ ...filters, orbit: e.value })}
          placeholder="Orbit"
        />
        <Dropdown
          className={styles.selection}
          showClear
          value={filters?.result}
          options={results}
          optionLabel="Result"
          onChange={(e) => setFilters({ ...filters, result: e.value })}
          placeholder="Result"
        />
        <Dropdown
          className={styles.selection}
          showClear
          value={filters?.year}
          options={years}
          optionLabel="Year"
          onChange={(e) => setFilters({ ...filters, year: e.value })}
          placeholder="Year"
        />
      </div>
    );
  };

  const resetData = () => {
    setFilters(rawRule);
  };

  return (
    <Card unstyled="false" subTitle={<span className="pageTitle">ISRO</span>}>
      <Card className="pageContent">
        <div className={styles.isroGrid}>
          {loading ? (
            <LoadingCard />
          ) : (
            <DynamicDataView filters={renderFilters()} data={filteredIsro} handleReset={resetData} />
          )}
        </div>
      </Card>
    </Card>
  );
}
