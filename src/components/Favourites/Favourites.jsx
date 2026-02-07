import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Card } from "primereact/card";
import styles from "./favourites.module.scss";
import { getAuthUser } from "../../helpers/authUser";
import { GET_USER_LIST } from "../../assets/apis/apiList";
import LoadingCard from "../Reusables/LoadingCard/LoadingCard";
import { ToastContext } from "../../hooks/ToastProvider/ToastProvider";
import DynamicDataView from "../Reusables/DynamicDataView/DynamicDataView";

export default function Favourites() {
  const [favouriteData, setFavouriteData] = useState([]);
  const toast = useContext(ToastContext);

  const { callApi: getUserList, loading, errors } = useAxios(GET_USER_LIST);

  useEffect(() => {
    let { userID } = getAuthUser();
    try {
      getUserList({ userID: userID, type: "liked" })
        .then((res) => {
          if (res == "noUser") return toast.error("Error", "No User Logged In");
          setFavouriteData(res);
        })
        .catch((err) => {
          toast.error("Error", err);
          console.log("Error :>", err);
        })
        .finally(() => {
          console.log("Axios Function Stopped.");
        });

      if (errors) {
        console.log("Error Occurred :>", errors);
      }
    } catch (err) {
      console.log("Error while fetching Server :>", err);
    }
  }, []);

  return (
    <Card
      unstyled="false"
      subTitle={<span className="pageTitle">Favourites</span>}
    >
      <Card className="pageContent">
        <div className={styles.dataGrid}>
          {loading ? <LoadingCard /> : <DynamicDataView data={favouriteData} />}
        </div>
      </Card>
    </Card>
  );
}
