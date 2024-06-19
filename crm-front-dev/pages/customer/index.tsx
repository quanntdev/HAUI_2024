import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import type { NextPage } from "next";
import styles from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { searchCustomer } from "../../redux/actions/customer";
import Breadcrumb from "../../components/Breadcumb";
import PaginationDefault from "../../components/Pagination";
import { keyPage, rowsPerPage } from "../../constants";
import FormCreateOrUpdateCustomer from "../../components/Customer/FormCreateOrUpdateCustomer";
import InputSearch from "../../components/Input/InputSearch";
import { useRouter } from "next/router";
import { getPageFromParams } from "../../helpers";
import { IconBuildingCommunity } from "@tabler/icons";
import HeadMeta from "../../components/HeadMeta";
import { searchCustomerLevel } from "../../redux/actions/customerLevel";
import FilterStatusButtonRe from "../../components/Button/FilterStatusButton/FilterStatusButtonRe";
import { getCountries } from "../../redux/actions/countries";
import { getCities } from "../../redux/actions/city";
import { CUSTOMER_PRIORITY_LIST } from "../../constants/customer";
import FilterUserAssignedButton from "../../components/Button/FilterUserAssignedButton";
import { searchUser } from "../../redux/actions/user";
import Link from "next/link";
import MutiSelect from "../../components/Input/MutiSelect";
import QueryListBar from "../../components/QueryListBar";
import useTrans from "../../utils/useTran";
import { getSaleChannel } from "../../redux/actions/saleChannel";

const Customer: NextPage = (props: any) => {
  const {
    dataCustomerList,
    dataDeleteCustomer,
    dataUpdateCustomer,
    dataCreateCustomer,
  } = props.customer;
  const { dataCountryList } = props.country;
  const { dataCustomerLevel } = props.level;
  const { dataCityList } = props.city;
  const { dataUserList } = props.user;
  const { dataSaleChannelList } = props.saleChannel;
  const {
    searchCustomer,
    searchCustomerLevel,
    getCountries,
    getCities,
    searchUser,
    getSaleChannel,
  } = props;
  const [customerId, setCustomerId] = useState<number>();
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const router = useRouter();
  const [querySearch, setQuerySearch] = useState<string>("");
  const [itemIndex, setItemIndex] = useState<number>(1);
  const [levelId, setLevelId] = useState<number | null>(null);
  const [chanelId, setChanelId] = useState<number | null>(null);
  const [countryId, setCountryId] = useState<number | null>(null);
  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(0);
  const [querySearchFilter, setQuerySearchFilter] = useState<string>(
    `limit=${rowsPerPage}&offset=0`
  );
  const [disableCity, setDisableCity] = useState<boolean>(true);
  const [userAssignedId, setUserAssignedId] = useState<number | null>(null);
  const handleToShowCustomer = (id: number) => router.push(`/customer/${id}`);

  useEffect(() => {
    const page = getPageFromParams(router.query[keyPage]);
    if (page) {
      setItemIndex(page * rowsPerPage + 1);
    }
    if (!page) {
      setItemIndex(1);
    }
    const querySearch =
      `limit=${rowsPerPage}&offset=${page * rowsPerPage}` +
      (router.query?.keyword ? `&keyword=${router.query?.keyword}` : "") +
      (router.query?.levelId ? `&levelId=${router.query?.levelId}` : "") +
      (router.query?.chanelId ? `&chanelId=${router.query?.chanelId}` : "") +
      (router.query?.priorityId
        ? `&priorityId=${router.query?.priorityId}`
        : "") +
      (router.query?.userAssign
        ? `&userAssign=${router.query?.userAssign}`
        : "") +
      (router.query?.countryId ? `&countryId=${router.query?.countryId}` : "") +
      (router.query?.listPriority
        ? `&listPriority=${router.query?.listPriority}`
        : "") +
      (router.query?.provinceId
        ? `&provinceId=${router.query?.provinceId}`
        : "") +
      (router.query?.customerId
        ? `&customerId=${router.query?.customerId}`
        : "") +
      (router.query?.cid ? `&cid=${router.query?.cid}` : "");
    setQuerySearch(querySearch);
    searchCustomer(querySearch);
  }, [searchCustomer, router.query, dataUpdateCustomer]);

  useEffect(() => {
    if (!dataCustomerLevel) {
      searchCustomerLevel();
    }

    if (!dataCountryList) {
      getCountries();
    }

    if (!dataUserList) {
      searchUser();
    }
  }, [router.query]);

  useEffect(() => {
    if (router.query?.levelId) {
      setLevelId(Number(router.query?.levelId));
    }
    if (router.query?.countryId) {
      setCountryId(Number(router.query?.countryId));
    }
    if (router.query?.provinceId) {
      setProvinceId(Number(router.query?.provinceId));
    }
    if (router.query?.chanelId) {
      setChanelId(Number(router.query?.chanelId));
    }
  }, [router.query]);

  useEffect(() => {
    if (Object.entries(router.query).length === 0) {
      setLevelId(null);
      setChanelId(null);
      setUserAssignedId(null);
      setCountryId(null);
      setProvinceId(null);
    }
    if (!router.query?.countryId) {
      setDisableCity(true);
    }
  }, [router.query]);

  useEffect(() => {
    setProvinceId(
      router.query?.provinceId ? Number(router.query?.provinceId) : null
    );

    if (countryId) {
      setDisableCity(false);
    }
  }, [countryId]);

  useEffect(() => {
    searchCustomer(querySearchFilter);
  }, [querySearchFilter]);

  useEffect(() => {
    if (countryId) {
      getCities(countryId);
    }
  }, [countryId]);

  const dataLevel = dataCustomerLevel?.map((key: any) => ({
    id: key?.id,
    name: key?.name,
  }));

  const dataCountry = dataCountryList?.map((key: any) => ({
    id: key?.id,
    name: key?.name,
  }));

  const dataCity = dataCityList?.map((key: any) => ({
    id: key?.id,
    name: key?.name,
  }));

  useEffect(() => {
    if (dataDeleteCustomer || dataCreateCustomer) {
      searchCustomer(querySearch);
    }
  }, [
    dataDeleteCustomer,
    dataCreateCustomer,
    searchCustomer,
    querySearch,
    dataUpdateCustomer,
  ]);

  const handleOpenForm = (action: boolean, customerId: any) => {
    setOpenFormModal(action);
    setCustomerId(customerId);
  };

  const trans = useTrans();

  useEffect(() => {
    getSaleChannel();
  }, []);

  const dataChanel = dataSaleChannelList?.map((key: any) => ({
    id: key?.id,
    name: key?.name,
  }));

  // Filter Sale Chanel

  function filterSaleChanel(keyword: any) {
    const query = `&chanelId=${keyword}`;
    router.push({
      pathname: router.pathname,
      query: query,
    });
  }

  return (
    <>
      <HeadMeta title={trans.menu.customer} />
      <Breadcrumb
        title={trans.menu.customer}
        prevPage={null}
        icon={<IconBuildingCommunity className={styles["icons"]} />}
      />
      <div className={styles["page-title"]}>
        <div className={styles["search"]}>
          <InputSearch
            dataChanel={dataChanel}
            dataLevel={dataLevel}
            dataCountry={dataCountry}
            dataUserList={dataUserList}
            placeholder={trans.customer.customer_name}
            notOnlySearch={true}
            type="customer"
          />
        </div>
        <div className={styles["btn"]}>
          <Button
            onClick={() => handleOpenForm(true, null)}
            className="btn_create"
          >
            {trans.customer.create_customer}
          </Button>
        </div>
      </div>
      <div className={styles["page-filter"]}>
        <MutiSelect
          selectOption={CUSTOMER_PRIORITY_LIST}
          object="listPriority"
          placeholder={trans.customer.all_priority}
        />

        <FilterStatusButtonRe
          dataStatusList={dataLevel}
          statusId={levelId}
          setStatusId={setLevelId}
          setQuerySearch={setQuerySearchFilter}
          setPage={setPage}
          keyword={"levelId"}
          placeholder={trans.customer.all_level}
          querySearchFilter={querySearchFilter}
        />

        <FilterStatusButtonRe
          dataStatusList={dataChanel}
          statusId={chanelId}
          setStatusId={setChanelId}
          setQuerySearch={setQuerySearchFilter}
          setPage={setPage}
          keyword={"chanelId"}
          placeholder={trans.sale_channel.sale_channel}
          querySearchFilter={querySearchFilter}
        />

        <FilterStatusButtonRe
          dataStatusList={dataCountry}
          statusId={countryId}
          setStatusId={setCountryId}
          setQuerySearch={setQuerySearchFilter}
          setPage={setPage}
          keyword={"countryId"}
          placeholder={trans.customer.all_country}
          querySearchFilter={querySearchFilter}
          keywordReset={"provinceIdLabel"}
          labelReset={"provinceId"}
        />

        <FilterStatusButtonRe
          dataStatusList={dataCity}
          statusId={provinceId}
          setStatusId={setProvinceId}
          setQuerySearch={setQuerySearchFilter}
          setPage={setPage}
          keyword={"provinceId"}
          placeholder={trans.customer.all_province}
          disable={disableCity}
          querySearchFilter={querySearchFilter}
        />

        <FilterUserAssignedButton
          dataUserList={dataUserList}
          setPage={setPage}
          setQuerySearch={setQuerySearch}
          setUserAssignedId={setUserAssignedId}
          userAssignedId={userAssignedId}
        />
      </div>
      <QueryListBar />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="5%">#</TableCell>
                <TableCell width="10%" className="text-align-center">
                  CID
                </TableCell>
                <TableCell width="15%">{trans.customer.name}</TableCell>
                <TableCell width="10%">{trans.customer.priority}</TableCell>
                <TableCell width="7%" className="text-align-center">
                  {trans.customer.level}
                </TableCell>
                <TableCell width="10%" className="text-align-center">
                  {trans.customer.country}
                </TableCell>
                <TableCell width="10%">{trans.customer.province}</TableCell>
                <TableCell width="15%">{trans.customer.assigned}</TableCell>
                <TableCell width="30%">Sale Chanel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataCustomerList?.items?.map((customer: any, index: number) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell className="list-index">
                    {dataCustomerList?.items?.length > 0 && itemIndex + index}
                  </TableCell>
                  <TableCell className="text-align-center">
                    {customer?.country?.name}
                    {customer?.country?.name && customer?.cidCode && "-"}
                    {customer?.cidCode}
                  </TableCell>
                  <TableCell
                    className="text-cursor"
                    onClick={() => handleToShowCustomer(customer.id)}
                  >
                    <Link
                      href={window.location.origin + "/customer/" + customer.id}
                      className="text-overflow"
                    >
                      {customer?.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {customer?.priority && (
                      <Chip
                        label={
                          customer?.priority
                            ? CUSTOMER_PRIORITY_LIST[
                                Number(customer?.priority) - 1
                              ]?.label
                            : ""
                        }
                        style={{
                          background: customer?.priority
                            ? CUSTOMER_PRIORITY_LIST[
                                Number(customer?.priority) - 1
                              ]?.backgroundcolor
                            : "",
                          color: customer?.priority
                            ? CUSTOMER_PRIORITY_LIST[
                                Number(customer?.priority) - 1
                              ]?.color
                            : "",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-align-center">
                    <Tooltip
                      title={customer?.level?.description}
                      style={{
                        display: "inline-block",
                        marginRight: "4px",
                        cursor: "default",
                      }}
                    >
                      <div>{customer?.level?.name}</div>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-align-center">
                    <div>{customer?.country?.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>{customer?.city?.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {customer?.userAssign?.profile?.first_name
                        ? customer?.userAssign?.profile?.first_name +
                          " " +
                          customer?.userAssign?.profile?.last_name
                        : ""}
                    </div>
                  </TableCell>
                  <TableCell
                    sx={
                      customer?.channel?.name
                        ? {
                            cursor: "pointer",
                            color: "blue",
                          }
                        : {}
                    }
                    onClick={() =>
                      customer?.channel?.name &&
                      filterSaleChanel(customer.channel.id)
                    }
                  >
                    {customer?.channel?.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {dataCustomerList?.total > rowsPerPage && (
        <PaginationDefault total={dataCustomerList?.total} />
      )}
      <FormCreateOrUpdateCustomer
        openModal={openFormModal}
        setOpenModal={setOpenFormModal}
        id={customerId}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  customer: state.customer,
  level: state.customerLevel,
  country: state.country,
  city: state?.city,
  user: state?.user,
  saleChannel: state.saleChannel,
});

const mapDispatchToProps = {
  searchCustomer,
  searchCustomerLevel,
  getCountries,
  getCities,
  searchUser,
  getSaleChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Customer);
