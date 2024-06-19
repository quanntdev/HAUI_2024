import React, { useCallback, useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcumb";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import useTrans from "../../utils/useTran";
import { connect } from "react-redux";
import { deleteIndustry, getIndustry } from "../../redux/actions/industry";
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
import EditOutlineOutlinedIcon from "@mui/icons-material/Edit";
import InputSearch from "../../components/Input/InputSearch";
import styles from "./styles.module.scss";
import FormCreateOrUpdateIndustry from "../../components/Industry/formCreateOrUpdateIndustry";
import router from "next/router";

const Industry = (props: any) => {
  const trans = useTrans();
  const { getIndustry, deleteIndustry } = props;
  const { dataIndustryList, dataDeleteIndustry } = props.industry;

  const [showIndustry, setShowIndustry] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, [setOpenModal, openModal]);

  useEffect(() => {
    getIndustry();
  }, [dataDeleteIndustry]);

  const handleDeleteIndustry = (id: any) => () => {
    deleteIndustry(id);
  };

  const handleEditIndustry = (item: any) => () => {
    setOpenModal(true);
    setShowIndustry(item);
  };

  useEffect(() => {
    if (!openModal) {
      setShowIndustry(null);
    }
  }, [openModal]);

  useEffect(() => {
    if (router.query) {
      const query = router.query?.keyword
        ? `&name=${router.query?.keyword}`
        : "";
      getIndustry(query);
    }
  }, [router.query]);

  return (
    <div>
      <Breadcrumb title={trans.menu.industry} icon={<HomeWorkOutlinedIcon />} />

      <div className={styles["header"]}>
        <InputSearch filter={false} placeholder={trans.menu.industry} />
        <div>
          <Button
            onClick={handleOpenModal}
            variant="contained"
            className={styles["btn_create"]}
          >
            {trans.industry.add_industry}
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
                  width="5%"
                  className="text-align-left"
                >
                  #
                </TableCell>
                <TableCell
                  sx={{ padding: "10px" }}
                  width="20%"
                  className="text-align-left"
                >
                  {trans.customer.name}
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
              {dataIndustryList?.map((items: any, index: number) => (
                <TableRow key={items?.id}>
                  <TableCell sx={{ padding: "10px" }}>{index + 1}</TableCell>
                  <TableCell sx={{ padding: "10px" }}>{items?.name}</TableCell>
                  <TableCell
                    sx={{ padding: "10px" }}
                    className="text-align-center"
                  >
                    <IconButton
                      color="error"
                      onClick={handleDeleteIndustry(items?.id)}
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
                          onClick={handleEditIndustry(items)}
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

      <FormCreateOrUpdateIndustry
        itemEdit={showIndustry}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  industry: state.industry,
});

const mapDispatchToProps = {
  getIndustry,
  deleteIndustry,
};

export default connect(mapStateToProps, mapDispatchToProps)(Industry);
