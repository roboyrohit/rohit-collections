import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Badge } from "primereact/badge";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import styles from "./dynamicDataView.module.scss";
import ListItem from "./ListItem/ListItem";
import GridItem from "./GridItem/GridItem";
import ViewModal from "./ViewModal/ViewModal"; // <-- import here
import ListSkeleton from "./ListItem/ListSkeleton";
import GridSkeleton from "./GridItem/GridSkeleton";

export default function DynamicDataView({ filters, data, handleReset }) {
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [searchValue, setSearchValue] = useState("");

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    setProducts(data);
  }, [data]);

  useEffect(() => {
    if (searchValue.length >= 3) {
      const search = searchValue.toLowerCase();
      let filtered = [...data].filter((m) =>
        Object.values(m).some(
          (val) => val && val.toString().toLowerCase().includes(search)
        )
      );
      setProducts(filtered);
    } else {
      setProducts(data);
    }
  }, [searchValue]);

  const handleResetSearch = () => {
    setSearchValue("");
    handleReset()
  };

  const getSeverity = (product) => {
    if (product.Result === "Failure") {
      return "danger";
    } else if (product.Result === "Partial Failure") {
      return "warning";
    } else if (product.Result === "Success") {
      return "success";
    } else if (product.IMDB >= 7) {
      return "success";
    } else if (product.IMDB >= 4) {
      return "warning";
    } else if (product.IMDB <= 3 && product.IMDB > 0) {
      return "danger";
    } else {
      return "info";
    }
  };

  // Handler to open modal with data
  const handleOpenModal = (item) => {
    setModalData(item);
    setModalVisible(true);
  };

  const itemTemplate = (product, layout, index) => {
    if (!product) return;
    if (layout === "list") {
      return (
        <ListItem
          data={product}
          key={product.id || product._id || product.Name || index}
          severity={getSeverity}
          onShowDetail={() => handleOpenModal(product)}
        />
      );
    } else if (layout === "grid") {
      return (
        <GridItem
          data={product}
          key={product.id || product._id || product.Name || index}
          severity={getSeverity}
          onShowDetail={() => handleOpenModal(product)}
        />
      );
    }
  };

  const listTemplate = (products, layout) => {
    return (
      <div className={styles.grid}>
        {products.map((product, index) => itemTemplate(product, layout, index))}
      </div>
    );
  };

  const header = () => {
    return (
      <div className={styles.layoutSwitch}>
        {filters}
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            placeholder="Search Here... !"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </IconField>
        <Button
          icon="pi pi-times"
          className={styles.resetBtn}
          raised
          outlined
          severity="danger"
          onClick={handleResetSearch}
        ></Button>
        <Button className={styles.listed} icon="pi pi-tags" severity="success">
          <Badge value={products.length} severity="danger"></Badge>
        </Button>
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    );
  };

  return (
    <div className={styles.dataView}>
      <DataView
        value={products}
        listTemplate={listTemplate}
        layout={layout}
        header={header()}
        paginator
        rows={12}
        emptyMessage={layout == "list" ? <ListSkeleton /> : <GridSkeleton />}
      />
      <ViewModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        data={modalData}
        severity={getSeverity}
      />
    </div>
  );
}
