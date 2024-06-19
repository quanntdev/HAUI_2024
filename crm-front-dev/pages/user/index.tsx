import styles from "./styles.module.scss";
import Breadcrumb from "../../components/Breadcumb";
import PersonIcon from "@mui/icons-material/Person";
import {
  Avatar,
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PaginationDefault from "../../components/Pagination";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { searchUser, clearData, deleteUser } from "../../redux/actions/user";
import { NextPage } from "next";
import { keyPage, rowsPerPage, userRoles } from "../../constants";
import FormCreateOrUpdateUser from "../../components/User/FormCreateOrUpdateUser";
import InputSearch from "../../components/Input/InputSearch";
import ModalDelete from "../../components/Modal/ModalDelete";
import { useRouter } from "next/router";
import { getPageFromParams } from "../../helpers";
import getLinkAvatar from "../../utility/getLinkAvatar";
import useTrans from "../../utils/useTran";
import { renderGenderUser } from "../../utility/renderGenderUser";

const User: NextPage = (props: any) => {
  const trans = useTrans();
  const { dataUserList, dataDeleteUser, dataUpdateUser } = props.user;
  const { searchUser } = props;
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [querySearch, setQuerySearch] = useState<string>("");
  const [showUser, setShowUser] = useState(null);
  const [userId, setUserId] = useState<number>();

  useEffect(() => {
    const page = getPageFromParams(router.query[keyPage]);
    const querySearch =
      `limit=${rowsPerPage}&offset=${page * rowsPerPage}` +
      (router.query?.keyword ? `&keyword=${router.query?.keyword}` : "");
    setQuerySearch(querySearch);
    searchUser(querySearch);
  }, [searchUser, router.query]);

  useEffect(() => {
    if (dataDeleteUser || dataUpdateUser) {
      searchUser(querySearch);
      clearData("dataDeleteUser");
      clearData("dataUserList");
    }
  }, [dataDeleteUser, querySearch, dataUpdateUser]);

  const handleOpenModal = useCallback(() => {
    setShowUser(null);
    setOpenModal(true);
  }, []);

  const handleDeleteUser = useCallback((userId: number) => {
    setOpenDeleteModal(true);
    setUserId(userId);
  }, []);

  const handleEditUser = (user: any) => () => {
    setShowUser(user);
    setOpenModal(true);
  };
  


  return (
    <>
      <Breadcrumb title={trans.menu.user} icon={<PersonIcon />} />
      <div className={styles["user_list"]}>
        <div className={styles["header"]}>
          <InputSearch filter={false} placeholder={trans.contact.email} />
          <div>
            <Button
              variant="contained"
              className={styles["btn_create"]}
              onClick={handleOpenModal}
            >
              {trans.user.create_user}
            </Button>
          </div>
        </div>
        <Paper sx={{ width: "100%", overflow: "hidden" }} className="mt-3">
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: "12px" }} width="30%">
                    {trans.user.full_name}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }} width="10%">
                    {trans.contact.gender}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }} width="20%">
                    {trans.contact.email}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }} width="15%">
                    {trans.contact.phone}
                  </TableCell>
                  <TableCell sx={{ padding: "12px" }} width="10%">
                    {trans.customer_detail.position}
                  </TableCell>
                  <TableCell
                    sx={{ padding: "12px" }}
                    width="10%"
                    className="text-align-center"
                  >
                    {trans.task.action}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataUserList?.items?.map((user: any, index: number) => (
                  <TableRow
                    key={dataUserList?.items?.id}
                    className={styles["table-row"]}
                  >
                    <TableCell sx={{ padding: "12px" }}>
                      <div
                        className="text-overflow"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Avatar
                          src={
                            user?.profile?.profileImg
                              ? getLinkAvatar(user?.profile?.profileImg)
                              : ""
                          }
                          alt="Picture of the author"
                          sx={{ width: 24, height: 24 }}
                        />
                        <div style={{ marginLeft: "5px" }}>
                          {`${user?.profile?.first_name} ${user?.profile?.last_name}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ padding: "12px" }}>
                      {renderGenderUser(user?.profile?.gender)}
                    </TableCell>
                    <TableCell sx={{ padding: "12px" }}>
                      <div className="text-overflow">{user?.email}</div>
                    </TableCell>
                    <TableCell sx={{ padding: "12px" }}>
                      {user?.profile?.phone}
                    </TableCell>
                    <TableCell sx={{ padding: "12px" }}>
                      {userRoles.find((role) => role.key === user?.role)
                        ?.value ?? ""}
                    </TableCell>
                    <TableCell
                      sx={{ padding: "12px" }}
                      className="text-align-center"
                    >
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(user?.id)}
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
                      <IconButton aria-label="edit" color="default">
                        <Tooltip
                          title={trans.task.edit}
                          style={{
                            display: "inline-block",
                            marginRight: "4px",
                          }}
                        >
                          <EditIcon onClick={handleEditUser(user)} />
                        </Tooltip>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <FormCreateOrUpdateUser
          user={showUser}
          openModal={openModal}
          setOpenModal={setOpenModal}
          querySearch={querySearch}
        />
        {dataUserList?.total > rowsPerPage && (
          <PaginationDefault total={dataUserList?.total} />
        )}
        {!!userId && (
          <ModalDelete
            openModal={openDeleteModal}
            setOpenModal={setOpenDeleteModal}
            action={deleteUser(userId)}
            title={trans.user.about_delete_user}
            content={trans.user.about_delete_user_content}
          />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
});

const mapDispatchToProps = {
  searchUser,
  clearData,
  deleteUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
