import { connect } from "react-redux";
import { NextPage } from "next";
import Breadcrumb from "../../components/Breadcumb";
import styles from "./styles.module.scss";
import PublicIcon from "@mui/icons-material/Public";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import React, { useCallback, useEffect, useState } from "react";
import InputSearch from "../../components/Input/InputSearch";
import ModalDelete from "../../components/Modal/ModalDelete";
import { useRouter } from "next/router";
import { getCountries, deleteCountry } from "../../redux/actions/countries";
import FormCreateCountry from "../../components/Country/FormCreateCountry";
import axios from "axios";
import { ISO3166API } from "../../constants";
import { State } from "country-state-city";
import { createCities } from "../../redux/actions/city";
import useTrans from "../../utils/useTran";
import setParamFilter from "../../utility/querySearch";

const CountryPage: NextPage = (props: any) => {
  const trans = useTrans();
  const router = useRouter();
  const { getCountries, deleteCountry, createCities } = props;
  const { dataCountryList, dataDeleteCountry } = props.country;
  const { dataCreateCity } = props.city;
  const [openModal, setOpenModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [nameCountryList, setNameCountryList] = useState([]);
  const [idCountry, setIdCountry] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [syncCity, setSyncCity] = useState<any>();

  useEffect(() => {
    getCountries();
    fetchData();
  }, []);

  useEffect(() => {
    if (!openModal) getCountries();
  }, [openModal]);

  useEffect(() => {
    const querySearch = setParamFilter(null, null, router);
    getCountries(querySearch);
  }, [dataDeleteCountry, dataCreateCity, router.query]);

  useEffect(() => {
    if (dataCountryList && countries) {
      setNameCountryList(
        countries.filter((item) =>
          dataCountryList.some(({ name }: any) => item["cca2"] === name)
        )
      );
    }
  }, [dataCountryList, countries]);

  const findIdCountry = (codeCountry: string) => {
    if (dataCountryList) {
      setIdCountry(
        dataCountryList.filter((item: any) => item.name === codeCountry)
      );
    }
  };

  const handleDeleteUser = (codeCountry: string) => {
    if (dataCountryList) {
      const country = dataCountryList.filter(
        (item: any) => item.name === codeCountry
      );
      deleteCountry(country[0].id);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  async function fetchData() {
    const response = await axios.get(ISO3166API);
    setCountries(
      response.data.sort((a: any, b: any) =>
        a.name.common.localeCompare(b.name.common)
      )
    );
  }

  async function getCityOfCountry(countryCode: any) {
    const city = await State.getStatesOfCountry(countryCode);
    const listCity = city.map((item) => item.name);
    const dataUpdate = {
      countryCode: countryCode,
      name: listCity.toString(),
    };
    createCities(dataUpdate);
  }

  const AsyncData = useCallback(
    (data: any) => {
      setSyncCity(data);
      setOpenDeleteModal(true);
    },
    [setSyncCity, setOpenDeleteModal]
  );

  const findObject = (key: any) => {
    const Object = dataCountryList?.find((obj: any) => obj.name === key);
    if (Object && Object.cities.length > 0) {
      return false;
    }
    return true;
  };

  const handleModalDelete = useCallback(() => {
    getCityOfCountry(syncCity);
  }, [getCityOfCountry, syncCity]);

  return (
    <>
      <Breadcrumb title={trans.country.country} icon={<PublicIcon />} />
      <div className={styles["header"]}>
        <InputSearch filter={false} placeholder={trans.country.country} />
        <div>
          <Button
            variant="contained"
            className={styles["btn_create"]}
            onClick={handleOpenModal}
          >
            {trans.country.create_country}
          </Button>
        </div>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }} className="mt-3">
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: "11px" }} width="10%">
                  {trans.country.code}
                </TableCell>
                <TableCell sx={{ padding: "11px" }} width="20%">
                  {trans.country.country_name}
                </TableCell>
                <TableCell sx={{ padding: "11px" }} width="20%"></TableCell>
                <TableCell
                  sx={{ padding: "11px" }}
                  width="10%"
                  className="text-align-center"
                >
                  {trans.country.action}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nameCountryList?.map((country: any, index: number) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: "11px" }}>
                    <div className="text-overflow">{country?.cca2}</div>
                  </TableCell>

                  <TableCell sx={{ padding: "11px" }}>
                    {country?.name.common}
                  </TableCell>
                  <TableCell sx={{ padding: "11px" }}>
                    {findObject(country?.cca2) ? (
                      <Button
                        className={styles["synchronize"]}
                        color="success"
                        variant="contained"
                      >
                        <div onClick={() => AsyncData(country?.cca2)}>
                          {trans.country.synchronize_data}
                        </div>
                      </Button>
                    ) : (
                      <></>
                    )}
                  </TableCell>

                  <TableCell
                    sx={{ padding: "11px" }}
                    className="text-align-center"
                  >
                    <IconButton color="error">
                      <Tooltip
                        title={trans.task.delete}
                        style={{
                          display: "inline-block",
                          marginRight: "4px",
                        }}
                      >
                        <div onClick={() => handleDeleteUser(country?.cca2)}>
                          <DeleteOutlineOutlinedIcon />
                        </div>
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <ModalDelete
              openModal={openDeleteModal}
              setOpenModal={setOpenDeleteModal}
              action={handleModalDelete}
              title={trans.country.about_update_country}
              content={trans.country.about_update_country_content}
              textAction={trans.country.text_agree}
              status={"success"}
            />
          </Table>
        </TableContainer>
      </Paper>
      <FormCreateCountry
        openModal={openModal}
        setOpenModal={setOpenModal}
        countries={countries}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  country: state.country,
  city: state.city,
});

const mapDispatchToProps = {
  getCountries,
  deleteCountry,
  createCities,
};

export default connect(mapStateToProps, mapDispatchToProps)(CountryPage);
