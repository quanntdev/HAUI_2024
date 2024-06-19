import { connect } from "react-redux";
import { NextPage } from "next";
import Breadcrumb from "../../components/Breadcumb";
import styles from "./styles.module.scss";
import WifiChannelIcon from "@mui/icons-material/WifiChannel";
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
import { clearData } from "../../redux/actions/user";
import InputSearch from "../../components/Input/InputSearch";

import router from "next/router";

import {
  getSaleChannel,
  deleteSaleChannel,
  createSaleChannel,
} from "../../redux/actions/saleChannel";

import FormCreateSaleChannel from "../../components/SaleChannel/FormCreateSaleChannel";
import useTrans from "../../utils/useTran";

const CountryPage: NextPage = (props: any) => {
  const { getSaleChannel, deleteSaleChannel } = props;
  const { dataSaleChannelList, dataDeleteSaleChannel, dataCreateSaleChannel } =
    props.saleChannel;
  const [openModal, setOpenModal] = useState(false);
  const trans = useTrans();

  useEffect(() => {
    getSaleChannel();
  }, []);

  const handleDeleteSaleChannel = useCallback((id: any) => {
    deleteSaleChannel(id);
  }, [deleteSaleChannel]);

  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, [setOpenModal]);

  useEffect(() => {
    if (dataDeleteSaleChannel || dataCreateSaleChannel) getSaleChannel();
  }, [dataDeleteSaleChannel, dataCreateSaleChannel]);

  useEffect(() => {
    if (router.query) {
      const query = router.query?.keyword
        ? `&name=${router.query?.keyword}`
        : "";
      getSaleChannel(query);
    }
  }, [router.query, dataDeleteSaleChannel, dataCreateSaleChannel]);

  return (
    <>
      <Breadcrumb
        title={trans.sale_channel.sale_channel}
        icon={<WifiChannelIcon />}
      />
      <div className={styles["header"]}>
        <InputSearch
          filter={false}
          placeholder={trans.sale_channel.sale_channel}
        />
        <div>
          <Button
            variant="contained"
            className={styles["btn_create"]}
            onClick={handleOpenModal}
          >
            {trans.sale_channel.title_add}
          </Button>
        </div>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }} className="mt-3">
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: "11px" }} width="10%">
                  #
                </TableCell>
                <TableCell
                  sx={{ padding: "11px" }}
                  width="20%"
                  className="text-align-left"
                >
                  {trans.sale_channel.channel_name}
                </TableCell>
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
              {dataSaleChannelList?.map((items: any, index: number) => (
                <TableRow key={items?.id}>
                  <TableCell sx={{ padding: "11px" }}>
                    <div className="text-overflow">{index + 1}</div>
                  </TableCell>
                  <TableCell sx={{ padding: "11px" }}>{items?.name}</TableCell>

                  <TableCell
                    sx={{ padding: "11px" }}
                    className="text-align-center"
                  >
                    <IconButton
                      color="error"
                    >
                      <div onClick={() => handleDeleteSaleChannel(items?.id)}>
                      <Tooltip
                        title={trans.task.delete}
                        style={{
                          display: "inline-block",
                          marginRight: "4px",
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </Tooltip>
                      </div>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <FormCreateSaleChannel
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  saleChannel: state.saleChannel,
});

const mapDispatchToProps = {
  getSaleChannel,
  createSaleChannel,
  deleteSaleChannel,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CountryPage);
