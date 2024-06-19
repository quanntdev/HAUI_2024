import { Divider, Typography, Box, Avatar, Tooltip } from "@mui/material";
import { Chat } from "@mui/icons-material";
import styles from "./style.module.scss";
import getLinkAvatar from "../../utility/getLinkAvatar";
import { useState, useEffect, useCallback } from "react";
import { FILE_SIZE_MAX, LogNoteActions, rowsPerPage } from "../../constants";
import PaginationDefault from "../Pagination";
import { connect } from "react-redux";
import LogNoteChildren from "../LogNoteChildren";
import LinearProgress from "@mui/material/LinearProgress";
import { getListNotification } from "../../redux/actions/notification";
import { getDetailProfile } from "../../redux/actions/profile";
import {
  deleteComment,
  updateComment,
  postComment,
  uploadFile,
  uploadFileRaw,
  clearData,
} from "../../redux/actions/comment";
import { errorToast } from "../../BaseAxios/toast";
import { useRouter } from "next/router";
import CommentBox from "../Input/InputTiny/CommentBox";
import useTrans from "../../utils/useTran";

const INIT_POST_COMMENT = {
  object: "",
  objectId: null,
  action: null,
  comment: "",
  usersId: "",
};

const INIT_DATA_UPLOAD_FILE = {
  object: "",
  objectId: null,
  action: null,
  attachment: null,
  userId: null,
};

const LogNote = (props: any) => {
  const {
    title,
    postComment,
    deleteComment,
    isLoggedInUserId,
    object,
    objectName,
    logNotes,
    getObject,
    uploadFileRaw,
    clearData,
    getDetailProfile,
    onEditDes,
  } = props;
  const { dataDetailProfile } = props?.profile;
  const [showActivity, setShowActivity] = useState<boolean>(true);
  const [postComments, setPostComments] = useState<boolean>(false);
  const [openLoading, setOpenLoading] = useState<boolean>(false);
  const [pageOrderItem, setPageOrderItem] = useState<number>(1);
  const [newCommen, setNewComnen] = useState<boolean>(false);
  const [querySearch, setQuerySearch] = useState<string>(
    `limit=${rowsPerPage}&offset=${(pageOrderItem - 1) * rowsPerPage}`
  );

  const router = useRouter();

  const [formPostComment, setFormPostComment] = useState<any>({
    ...INIT_POST_COMMENT,
    object: objectName,
  });
  const [formUploadFileRaw, setFormUploadFileRaw] = useState<any>({
    ...INIT_DATA_UPLOAD_FILE,
    object: objectName,
  });
  const {
    dataPostComment,
    dataCommentDelete,
    dataUploadFile,
    dataUpdateComment,
    loadingComment,
    error,
  } = props?.comment;

  useEffect(() => {
    if (
      dataPostComment ||
      dataCommentDelete ||
      dataUploadFile ||
      dataUpdateComment
    ) {
      setFormPostComment(INIT_POST_COMMENT);
      setPostComments(false);
      if (router?.query?.view) {
        removeQueryParam(["view"]);
      }
    }
  }, [dataPostComment, dataCommentDelete, dataUploadFile, dataUpdateComment]);

  const removeQueryParam = (paramList: any) => {
    const pathname = router.pathname;
    const query: any = router.query;
    const params = new URLSearchParams(query);
    paramList.forEach((param: any) => {
      params.delete(param);
    });
    router.replace({ pathname, query: params.toString() }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (!dataDetailProfile) {
      getDetailProfile();
    }
  }, [dataDetailProfile]);

  useEffect(() => {
    if (object) {
      setFormPostComment({
        object: objectName,
        objectId: Number(object?.id),
        action: LogNoteActions.COMMENT,
        comment: formPostComment?.comment ?? "",
        usersId: "",
      });
      setFormUploadFileRaw({
        object: objectName,
        objectId: Number(object?.id),
        action: LogNoteActions.UPLOAD_FILE_RAW,
        attachment: null,
        userId: isLoggedInUserId,
      });
    }
  }, [object]);

  useEffect(() => {
    if (formPostComment?.comment) {
      const regex = /<span id="(\d+)".*?>(.*?)<\/span>/g;
      let match;
      const idArray = [];
      while ((match = regex.exec(formPostComment?.comment))) {
        idArray.push(match[1]);
      }
      const idString = idArray.join(", ");
      setFormPostComment({ ...formPostComment, usersId: idString });
    }
  }, [formPostComment?.comment]);

  const handleChangeComment = (key: any, value: any) => {
    setFormPostComment({
      ...formPostComment,
      [key]: value,
    });
  };

  useEffect(() => {
    setPageOrderItem(1);
    setQuerySearch(`limit=${rowsPerPage}&offset=0`);
  }, [dataPostComment]);

  useEffect(() => {
    if (object?.id && !onEditDes) {
      getObject(object?.id, querySearch);
    }
  }, [
    querySearch,
    dataPostComment,
    dataCommentDelete,
    dataUploadFile,
    dataUpdateComment,
    onEditDes,
  ]);

  const handlePostNewComment = () => {
    if (formPostComment?.comment !== "") {
      postComment(formPostComment);
      setPostComments(false);
      getObject(object?.id, querySearch);
      setNewComnen(false);
    }
  };

  const handlePostComment = () => {
    setPostComments(true);
  };

  const handleCancelPostNewComment = useCallback(() => {
    setFormPostComment({ ...formPostComment, comment: "", usersId: "" });
    setPostComments(false);
  }, [setFormPostComment, setPostComments, formPostComment]);

  const setComment = useCallback(() => {
    setNewComnen(true);
  }, [setNewComnen]);

  useEffect(() => {
    if (newCommen) {
      handlePostNewComment();
    }
  }, [newCommen]);

  useEffect(() => {
    if (error) {
      setOpenLoading(false);
    }
  }, [error]);

  const handleUp = useCallback(
    (file: any) => {
      setOpenLoading(true);
      const newFile = new File([file], getNameFile(file.name));

      if (newFile.size > FILE_SIZE_MAX) {
        errorToast("File is too big");
        setOpenLoading(false);
        return;
      }

      const action = file.type.startsWith("image/")
        ? LogNoteActions.UPLOAD_FILE
        : LogNoteActions.UPLOAD_FILE_RAW;

      const newData = {
        ...formUploadFileRaw,
        action,
        attachment: newFile,
      };

      uploadFileRaw(newData);
      clearData("dataUploadFile");
    },
    [formUploadFileRaw, uploadFileRaw]
  );

  useEffect(() => {
    if (loadingComment) {
      setOpenLoading(true);
    } else {
      setOpenLoading(false);
    }
  }, [loadingComment]);

  function getNameFile(str: any) {
    const type = str.split(".").pop();
    return encodeURIComponent(str) + "." + type;
  }

  function changeToSlug(str: string) {
    str = str.toLowerCase();
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/[đĐ]/g, "d");
    str = str.replace(/([^0-9a-z-\s])/g, "");
    str = str.replace(/(\s+)/g, "-");
    str = str.replace(/-+/g, "-");
    return str;
  }
  const id: any = router.query.view;
  if (id) {
    document
      .getElementById(`${Number(id)}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const trans = useTrans();

  return (
    <>
      <Box
        sx={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
        }}
        className={styles["detail-right-box"]}
      >
        <Box className={styles["detail-right-flex"]}>
          <Typography className={styles["detail-title"]}>
            <Chat className={styles["detail-icon"]} />
            {title}
          </Typography>
          <span
            className="text-cursor text-link"
            onClick={() => setShowActivity(!showActivity)}
          >
            {showActivity
              ? `${trans?.task.hide_details}`
              : `${trans?.task.show_detail}`}
          </span>
        </Box>
        {openLoading ? <LinearProgress /> : ""}
        <Divider />
        {showActivity && (
          <Box
            className={`${styles["detail-right-content"]} ${styles["detail-right-comment"]}`}
          >
            <Box className="mt-8">
              <div className={styles["box-comment"]}>
                <div className={styles["user"]}>
                  <Tooltip
                    title={
                      dataDetailProfile?.profile?.first_name +
                      " " +
                      dataDetailProfile?.profile?.last_name
                    }
                    key={1}
                    style={{
                      marginRight: "4px",
                    }}
                  >
                    <Avatar
                      src={
                        dataDetailProfile?.profile?.profileImg
                          ? getLinkAvatar(
                              dataDetailProfile?.profile?.profileImg
                            )
                          : ""
                      }
                      alt="Picture of the author"
                      sx={{ width: 40, height: 40 }}
                    />
                  </Tooltip>
                </div>
                {postComments ? (
                  <div className={styles["commen-box-show"]}>
                    <CommentBox
                      handleChange={handleChangeComment}
                      keyword="comment"
                      value={formPostComment?.comment}
                      handleCancelPostNewComment={handleCancelPostNewComment}
                      handlePostNewComment={setComment}
                      handleUpload={handleUp}
                    />
                  </div>
                ) : (
                  <div className={styles["commen-box"]}>
                    <div
                      className={styles["commen-box-btn"]}
                      onClick={handlePostComment}
                    >
                      {trans.task.write_a_comment}
                    </div>
                  </div>
                )}
              </div>
            </Box>
            <Box className={styles["content"]}>
              {logNotes?.items?.map((item: any, index: any) => (
                <LogNoteChildren
                  isLoggedInUserId={isLoggedInUserId}
                  key={item?.id}
                  log={item}
                  deleteHandle={deleteComment}
                  objectId={object?.id}
                  object={objectName}
                />
              ))}
            </Box>
          </Box>
        )}
        {showActivity && logNotes?.total > rowsPerPage && (
          <PaginationDefault
            total={logNotes?.total}
            setQuerySearch={setQuerySearch}
            paginateByParamUrl={false}
            setCustomPage={setPageOrderItem}
            customPage={pageOrderItem}
          />
        )}
      </Box>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  comment: state?.comment,
  profile: state?.profile,
});

const mapDispatchToProps = {
  postComment,
  deleteComment,
  uploadFile,
  updateComment,
  uploadFileRaw,
  clearData,
  getListNotification,
  getDetailProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogNote);
