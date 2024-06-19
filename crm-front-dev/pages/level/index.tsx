import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import useTrans from "../../utils/useTran";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import Breadcrumb from "../../components/Breadcumb";
import InputSearch from "../../components/Input/InputSearch";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlineOutlinedIcon from "@mui/icons-material/Edit";

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
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import {
  deleteLevelCustomer,
  searchCustomerLevel,
} from "../../redux/actions/customerLevel";
import FormCreateLevelCustomer from "../../components/CustomerLevel/FormCreateLevelCustomer";
import router from "next/router";

const LevelCustomerPage: NextPage = (props: any) => {
  const trans = useTrans();

  const { searchCustomerLevel, deleteLevelCustomer } = props;
  const {
    dataCustomerLevel,
    dataCreateLevelCustomer,
    dataDeleteLevelCustomer,
    dataUpdateLevelCustomer,
  } = props.level;

  const [openModal, setOpenModal] = useState(false);
  const [showLevelCustomer, setShowLevelCustomer] = useState(null);

  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, [setOpenModal, openModal]);

  const handleDeleteLevelCustomer = (id: any) => () => {
    deleteLevelCustomer(id);
  };

  const handleEditCustomerLevel = (item: any) => () => {
    setOpenModal(true);
    setShowLevelCustomer(item);
  };

  useEffect(() => {
    if (!openModal) {
      setShowLevelCustomer(null);
    }
  }, [openModal]);

  useEffect(() => {
    if (router.query) {
      const query = router.query?.keyword
        ? `&name=${router.query?.keyword}`
        : "";
      searchCustomerLevel(query);
    }
  }, [
    router.query,
    dataCreateLevelCustomer,
    dataDeleteLevelCustomer,
    dataUpdateLevelCustomer,
  ]);

  return (
    <>
      <Breadcrumb
        title={trans.menu.level_customer}
        icon={<FormatListNumberedRtlIcon />}
      />

      <div className={styles["header"]}>
        <InputSearch filter={false} placeholder={trans.level.level_name} />
        <div>
          <Button
            variant="contained"
            className={styles["btn_create"]}
            onClick={handleOpenModal}
          >
            {trans.level.add_level_customer}
          </Button>
        </div>
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }} className="mt-3">
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ padding: "10px" }}
                  width="10%"
                  className="text-align-left"
                >
                  #
                </TableCell>
                <TableCell
                  sx={{ padding: "10px" }}
                  width="10%"
                  className="text-align-left"
                >
                  {trans.customer.name}
                </TableCell>
                <TableCell
                  sx={{ padding: "10px" }}
                  width="20%"
                  className="text-align-left"
                >
                  {trans.task.description}
                </TableCell>
                <TableCell
                  sx={{ padding: "10px" }}
                  width="10%"
                  className="text-align-center"
                >
                  {trans.task.action}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataCustomerLevel?.map((items: any, index: number) => (
                <TableRow key={items?.id}>
                  <TableCell sx={{ padding: "10px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ padding: "10px" }}>{items?.name}</TableCell>
                  <TableCell sx={{ padding: "10px" }}>
                    {items.description}
                  </TableCell>
                  <TableCell
                    sx={{ padding: "10px" }}
                    className="text-align-center"
                  >
                    <IconButton
                      color="error"
                      onClick={handleDeleteLevelCustomer(items?.id)}
                    >
                      <Tooltip
                        title={trans.task.delete}
                        style={{
                          display: "inline-block",
                          marginRight: "4px",
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </Tooltip>
                    </IconButton>

                    <IconButton color="success">
                      <Tooltip
                        title={trans.task.edit}
                        style={{
                          display: "inline-block",
                          marginRight: "4px",
                        }}
                      >
                        <EditOutlineOutlinedIcon
                          onClick={handleEditCustomerLevel(items)}
                        />
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <FormCreateLevelCustomer
        itemEdit={showLevelCustomer}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  level: state.customerLevel,
});

const mapDispatchToProps = {
  searchCustomerLevel,
  deleteLevelCustomer,
};

export default connect(mapStateToProps, mapDispatchToProps)(LevelCustomerPage);
