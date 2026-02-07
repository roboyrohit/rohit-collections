import React, { useContext, useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import styles from "./movies.module.scss";
import useAxios from "../../hooks/useAxios";
import { Card } from "primereact/card";
import { GET_MOVIES, GET_DATABASE } from "../../assets/apis/apiList";
import { ToastContext } from "../../hooks/ToastProvider/ToastProvider";
import DynamicDataView from "../Reusables/DynamicDataView/DynamicDataView";
import LoadingCard from "../Reusables/LoadingCard/LoadingCard";
import { getAuthUser } from "../../helpers/authUser";

const rawRule = {
  year: null,
  rating: null,
  genre: null,
  origin: null,
  language: null,
  franchise: null,
};

export default function Movies() {
  const [moviesData, setMoviesData] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const toast = useContext(ToastContext);

  const [filters, setFilters] = useState(rawRule);

  const {
    callApi: getMoviesList,
    errors,
    loading,
    progress,
    cancelRequest,
    downloadFile,
  } = useAxios(GET_MOVIES);

  useEffect(() => {
    let { userID } = getAuthUser();
    try {
      getMoviesList({ userID: userID })
        .then((res) => {
          if (res == "noUser") return toast.error("Error", "No User Logged In");
          setMoviesData(res.movies);
          setRatings(res.ratings);
          setGenres(res.genres);
          setOrigins(res.origins);
          setYears(res.years);
          setLanguages(res.languages);
          setFranchises(res.franchises);
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
      // downloadFile("/getMoviesData", "movies.xlsx");
      if (errors) toast.error("Error", errors);
    } catch (err) {
      console.log("Error while fetching Server :>", err);
      toast.error("Error", err);
    }
  }, []);

  useEffect(() => {
    const filtered = moviesData.filter((m) => {
      return (
        (!filters.year || m.Year == filters.year.year) &&
        (!filters.rating || m.Rating == filters.rating.rating) &&
        (!filters.genre || m.Genre.includes(filters.genre.genre)) &&
        (!filters.origin || m.Origin.includes(filters.origin.origin)) &&
        (!filters.language || m.Language.includes(filters.language.language)) &&
        (!filters.franchise ||
          m.Franchise.includes(filters.franchise.franchise))
      );
    });
    if (moviesData.length && !filtered.length)
      toast.info("No Data", "No Movies for selection.");
    setFilteredMovies(filtered);
  }, [moviesData, filters]);

  const renderFilters = () => {
    return (
      <div className={styles.filters}>
        <Dropdown
          className={styles.selection}
          filter
          showClear
          value={filters?.year}
          options={years}
          optionLabel="year"
          onChange={(e) => setFilters({ ...filters, year: e.value })}
          placeholder="Year"
        />
        <Dropdown
          className={styles.selection}
          filter
          showClear
          value={filters?.rating}
          options={ratings}
          optionLabel="rating"
          onChange={(e) => setFilters({ ...filters, rating: e.value })}
          placeholder="Rating"
        />
        <Dropdown
          className={styles.selection}
          filter
          showClear
          value={filters?.genre}
          options={genres}
          optionLabel="genre"
          onChange={(e) => setFilters({ ...filters, genre: e.value })}
          placeholder="Genre"
        />
        <Dropdown
          className={styles.selection}
          filter
          showClear
          value={filters?.origin}
          options={origins}
          optionLabel="origin"
          onChange={(e) => setFilters({ ...filters, origin: e.value })}
          placeholder="Origin"
        />
        <Dropdown
          className={styles.selection}
          filter
          showClear
          value={filters?.language}
          options={languages}
          optionLabel="language"
          onChange={(e) => setFilters({ ...filters, language: e.value })}
          placeholder="Langauge"
        />
        <Dropdown
          className={styles.selection}
          filter
          showClear
          value={filters?.franchise}
          options={franchises}
          optionLabel="franchise"
          onChange={(e) => setFilters({ ...filters, franchise: e.value })}
          placeholder="Franchise"
        />
      </div>
    );
  };

  const resetData = () => {
    setFilters(rawRule);
  };

  return (
    <Card unstyled="false" subTitle={<span className="pageTitle">Movies</span>}>
      <Card className="pageContent">
        <div className={styles.movieGrid}>
          {loading ? (
            <LoadingCard />
          ) : (
            <DynamicDataView
              filters={renderFilters()}
              data={filteredMovies}
              handleReset={resetData}
            />
          )}
        </div>
      </Card>
    </Card>
  );
}
