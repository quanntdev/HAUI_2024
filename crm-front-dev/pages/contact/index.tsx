import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { NextPage } from "next";
import styles from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { IconAddressBook } from "@tabler/icons";
import { connect } from "react-redux";
import {
  searchContact,
  deleteContact,
  clearData,
} from "../../redux/actions/contact";
import Breadcrumb from "../../components/Breadcumb";
import PaginationDefault from "../../components/Pagination";
import { keyPage, rowsPerPage } from "../../constants";
import FormCreateOrUpdateContact from "../../components/Contact/FormCreateOrUpdateContact";
import ModalDelete from "../../components/Modal/ModalDelete";
import InputSearch from "../../components/Input/InputSearch";
import { useRouter } from "next/router";
import { getPageFromParams } from "../../helpers";
import HeadMeta from "../../components/HeadMeta";
import { showGender } from "../../constants/contact";
import Link from "next/link";
import QueryListBar from "../../components/QueryListBar";
import setParamFilter from "../../utility/querySearch";
import useTrans from "../../utils/useTran";

const Contact: NextPage = (props: any) => {
  const { dataContactList, dataDeleteContact, dataUpdateContact } =
    props.contact;
  const { searchContact, deleteContact } = props;
  const [contactId, setContactId] = useState<number>();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openFormModal, setOpenFormModal] = useState<boolean>(false);
  const router = useRouter();
  const [querySearch, setQuerySearch] = useState<string>("");
  const [itemIndex, setItemIndex] = useState<number>(1);

  useEffect(() => {
    const page = getPageFromParams(router.query[keyPage]);
    setItemIndex(page * rowsPerPage + 1);
    if (!page) {
      setItemIndex(1);
    }
    const querySearch = setParamFilter(rowsPerPage, page, router)
    setQuerySearch(querySearch);
    searchContact(querySearch);
    clearData("dataContactDetail");
  }, [searchContact, router.query]);

  useEffect(() => {
    if (dataDeleteContact || dataUpdateContact) {
      clearData("dataDeleteContact");
      clearData("dataContactList");
      searchContact(querySearch);
      clearData("dataContactDetail");
    }
  }, [dataDeleteContact, querySearch, dataUpdateContact]);
  const handleToShowContact = (id: number) => router.push(`/contact/${id}`);


  const handleOpenForm = (action: boolean, contactId: any) => {
    setOpenFormModal(action);
    setContactId(contactId);
    clearData("dataContactDetail");
  };

  const trans = useTrans();

  return (
    <>
      <HeadMeta title={trans.menu.contact} />
      <Breadcrumb
        title={trans.menu.contact}
        icon={<IconAddressBook className={styles["icons"]} />}
      />
      <div className={styles["page-title"]}>
        <div className={styles["search"]}>
          <InputSearch
            filter={true}
            placeholder={`${trans.menu.customer}, ${trans.customer.name}, ${trans.contact.email}`}
            notOnlySearch={true}
            type="contact"
          />
        </div>
        <div className={styles["btn"]}>
          <Button
            onClick={() => handleOpenForm(true, null)}
            className="btn_create"
          >
            {trans.contact.create_contact}
          </Button>
        </div>
      </div>
      <QueryListBar />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="5%">#</TableCell>
                <TableCell width="20%">{trans.customer.name}</TableCell>
                <TableCell width="10%">{trans.contact.gender}</TableCell>
                <TableCell width="25%">{trans.menu.customer}</TableCell>
                <TableCell width="20%">{trans.contact.email}</TableCell>
                <TableCell width="20%">{trans.contact.phone}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataContactList?.items?.map((contact: any, index: number) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell className="list-index">
                    {dataContactList?.items?.length > 0 && itemIndex + index}
                  </TableCell>
                  <TableCell
                    onClick={() => handleToShowContact(contact?.id)}
                    className="text-cursor"
                  >
                    <Link
                      href={window.location.origin + "/contact/" + contact?.id}
                      className="text-overflow"
                    >
                      {`${contact?.firstName} ${contact?.lastName}`}
                    </Link>
                  </TableCell>
                  <TableCell>{showGender(contact?.gender)}</TableCell>
                  {contact?.customer?.name ? (
                    <TableCell
                      className="text-overflow text-cursor"
                    >
                      <Link
                        href={
                          window.location.origin +
                          "/customer/" +
                          contact?.customer?.id
                        }
                        className="text-overflow"
                      >
                        {contact?.customer?.name || ""}
                      </Link>
                    </TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                  <TableCell>
                    <div className="text-overflow">{contact?.email}</div>
                  </TableCell>
                  <TableCell>{contact?.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {dataContactList?.total > rowsPerPage && (
        <PaginationDefault total={dataContactList?.total} />
      )}
      {!!contactId && (
        <ModalDelete
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          action={() => deleteContact(contactId)}
          title={trans.contact.you_re_about_to_delete_your_contact}
          content={trans.contact.this_contact_will_be_permenently_removed_and_you_won_t_be_able_to_see_them_again_}
        />
      )}
      <FormCreateOrUpdateContact
        openEditModal={openFormModal}
        setOpenEditModal={setOpenFormModal}
        id={contactId}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  contact: state.contact,
});

const mapDispatchToProps = {
  searchContact,
  deleteContact,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
