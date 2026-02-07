
import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import styles from './documentaries.module.scss';
import useAxios from "../../hooks/useAxios";
import { GET_DOCUMENTARIES, GET_DATABASE } from "../../assets/apis/apiList";
import { getAuthUser } from "../../helpers/authUser";
import { ToastContext } from "../../hooks/ToastProvider/ToastProvider";
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import DocumentaryCard from './DocumentaryCard';
import SkeletonCard from './SkeletonCard';
import { Badge } from 'primereact/badge';

const rawRule = {
    year: null,
    owner: null
};
export default function Documentaries() {
    const [docData, setDocData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [years, setYears] = useState([]);
    const [owners, setOowners] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [filters, setFilters] = useState(rawRule);

    const toast = useContext(ToastContext);

    const {
        callApi: getDocumentaryList,
        errors,
        loading,
        progress,
        cancelRequest,
        downloadFile,
    } = useAxios(GET_DOCUMENTARIES);

    useEffect(() => {
        let { userID } = getAuthUser();
        try {
            getDocumentaryList({ userID: userID })
                .then((res) => {
                    if (res == "noUser") return toast.error("Error", "No User Logged In");
                    setDocData(res.documentaries);
                    setYears(res.years);
                    setOowners(res.owners);
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
            // downloadFile("/getDocumentariesData", "movies.xlsx");
            if (errors) toast.error("Error", errors);
        } catch (err) {
            console.log("Error while fetching Server :>", err);
            toast.error("Error", err);
        }
    }, []);

    useEffect(() => {
        const filtered = docData.filter((m) => {
            return (
                (!filters.year || m.Year == filters.year.year) &&
                (!filters.owner || m.Owner == filters.owner.owner)
            );
        });
        if (docData.length && !filtered.length)
            toast.info("No Data", "No Documentary for selection.");
        setFilteredData(filtered);
    }, [docData, filters]);

    useEffect(() => {
        if (searchValue.length >= 3) {
            setFilters(rawRule);
            const search = searchValue.toLowerCase();
            let filtered = [...docData].filter((m) =>
                Object.values(m).some(
                    (val) => val && val.toString().toLowerCase().includes(search)
                )
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(docData);
        }
    }, [searchValue]);


    return (
        <Card unstyled="false" subTitle={<span className="pageTitle">Documentaries</span>}>
            <Card className="pageContent">
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
                        value={filters?.owner}
                        options={owners}
                        optionLabel="owner"
                        onChange={(e) => setFilters({ ...filters, owner: e.value })}
                        placeholder="Owners"
                    />
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"> </InputIcon>
                        <InputText
                            className={styles.selection}
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
                        onClick={() => { setSearchValue(""), setFilters(rawRule) }}
                    ></Button>
                    <Button className={styles.listed} icon="pi pi-tags" severity="success">
                        <Badge value={filteredData.length} severity="danger"></Badge>
                    </Button>
                </div>
                <div className={styles.documentariesContainer}>
                    {filteredData.length ? filteredData.map((doc, index) => (
                        <DocumentaryCard index={index} data={doc} styles={styles} />
                    ))
                        :
                        <SkeletonCard styles={styles} />
                    }
                </div>
            </Card>
        </Card>
    );
};