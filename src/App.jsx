import React from "react";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme you prefer
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./hooks/ToastProvider/ToastProvider";
import Isro from "./components/Isro/Isro";
import Movies from "./components/Movies/Movies";
import Series from "./components/Series/Series";
import Watchlist from "./components/Watched/Watched";
import Database from "./components/Database/Database";
import Home from "./components/StaticPages/Home/Home";
import About from "./components/StaticPages/About/About";
import Bookmarks from "./components/Bookmarks/Bookmarks";
import Favourites from "./components/Favourites/Favourites";
import Contact from "./components/StaticPages/Contact/Contact";
import MainLayout from "./components/Layouts/MainLayout/MainLayout";
import Documentaries from "./components/Documentaries/Documentaries";
import LoadingCard from "./components/Reusables/LoadingCard/LoadingCard";
import Unauthorized from "./components/Reusables/Unauthorized/Unauthorized";
import PageNotFound from "./components/Reusables/PageNotFound/PageNotFound";
import AuthSwitcher from "./components/StaticPages/AuthSwitcher/AuthSwitcher";
import UnoGameBoard from "./components/UnoGame/UnoGameBoard";

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            {/* <Route index path="/" element={<Home />} /> */}
            <Route index path="/" element={<Database />} />
            <Route path="/auth" element={<AuthSwitcher />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/isro" element={<Isro />} />
            <Route path="/documentaries" element={<Documentaries />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/watched" element={<Watchlist />} />
            <Route path="/watched" element={<Watchlist />} />
            <Route path="/unogame" element={<UnoGameBoard />} />
            <Route path="/services" element={<LoadingCard info="Page is under development" />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}
