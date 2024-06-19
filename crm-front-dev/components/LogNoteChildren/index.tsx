import { Grid, Avatar, Button, Tooltip } from "@mui/material";
import styles from "./style.module.scss";
import getLinkAvatar from "../../utility/getLinkAvatar";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import { useCallback, useEffect, useState } from "react";
import {
  FOMAT_DATE_TIME,
  LogNoteActions,
  URL_API_FILE_ATTACHMENT,
} from "../../constants";
import { connect } from "react-redux";
import {
  updateComment,
  clearData,
  postComment,
} from "../../redux/actions/comment";
import Link from "next/link";
import Reply from "../Reply";
import { useRouter } from "next/router";
import { SlackCounter, SlackSelector } from "@charkour/react-reactions";
import moment from "moment";
import CommentBox from "../Input/InputTiny/CommentBox";
import useTrans from "../../utils/useTran";
import getNameFileUpload from "../../utility/getNameFileUpload";
import { checkLinkComment } from "../../utility/checkLinkComment";

const INIT_UPDATE_COMMENT = {
  comment: "",
};

const INIT_POST_REPLY = {
  object: "",
  objectId: null,
  action: null,
  comment: "",
  note_id: null,
  usersId: "",
};

const LogNoteChildren = (props: any) => {
  const trans = useTrans();
  const { updateComment, postComment } = props;
  const { isLoggedInUserId, key, object, objectId } = props;
  const [openInputTiny, setOpenInputTiny] = useState<boolean>(false);
  const [openReply, setOpenReply] = useState<boolean>(false);
  const { attachment } = props.log;
  const [showReply, setShowReply] = useState<boolean>(false);
  const [openReactMenu, setOpenReactMenu] = useState<boolean>(false);
  const [newCommen, setNewComnen] = useState<boolean>(false);
  const [newReply, setNewReply] = useState<boolean>(false);
  const { dataDetailProfile } = props?.profile;
  const [formUpdateComment, setFormUpdateComment] = useState<any>({
    ...INIT_UPDATE_COMMENT,
    comment: props?.log?.comment,
  });
  const [dataUpdateComment, setDataUpdateComment] = useState();

  const INIT_POST_COMMENT = {
    object: "",
    objectId: null,
    action: null,
    emoji: "",
    note_id: null,
    usersId: "",
  };

  useEffect(() => {
    if (formUpdateComment.comment) {
      setDataUpdateComment(formUpdateComment.comment);
    }
  }, [formUpdateComment.comment]);

  const formPostComment = {
    ...INIT_POST_COMMENT,
    action: LogNoteActions.REACTION,
    objectId: Number(props?.log.log_notes_object_id),
    object: props?.log?.createdUser?.object,
    note_id: Number(props?.log?.id),
  };
  const router = useRouter();

  useEffect(() => {
    if (router.query.view) {
      setShowReply(true);
    }
  }, [router.query]);

  const [formReplyComment, setFormReplyComment] = useState<any>({
    ...INIT_POST_REPLY,
    object: object,
    objectId: Number(objectId),
    note_id: Number(props?.log?.id),
    action: LogNoteActions.COMMENT,
  });

  const handleLinkFile = () => {
    return URL_API_FILE_ATTACHMENT + attachment;
  };

  useEffect(() => {
    setFormUpdateComment({
      ...formUpdateComment,
      comment: props?.log?.comment,
    });

    setFormReplyComment({
      ...formReplyComment,
      object: object,
      objectId: Number(objectId),
      note_id: Number(props?.log?.id),
      action: LogNoteActions.COMMENT,
    });
  }, [props.log]);

  const handleOpenUpdateComment = () => {
    setOpenInputTiny(true);
  };

  const handleOpenReply = () => {
    setOpenReply(!openReply);
  };

  const handleSaveReply = () => {
    postComment(formReplyComment);
    setShowReply(true);
    setOpenReply(false);
    setNewComnen(false);
    handleCloseReply();
  };

  const handleCloseReply = () => {
    setOpenReply(false);
  };

  const handleChangeReply = useCallback(
    (key: any, value: any) => {
      setFormReplyComment({
        ...formReplyComment,
        [key]: value,
      });
    },
    [formReplyComment, setFormReplyComment]
  );

  const handleShowReply = useCallback(() => {
    setShowReply((prevShowReply) => !prevShowReply);
  }, []);

  const handleHideReply = useCallback(() => {
    setShowReply(false);
  }, []);

  const handleCancelUpdateComment = useCallback(() => {
    setOpenInputTiny(false);
  }, []);

  const handleChangeCommentUpdate = (key: any, value: any) => {
    setFormUpdateComment({
      ...formUpdateComment,
      [key]: value,
    });
  };

  const handleUpdateComment = () => {
    if (props.log.id) {
      updateComment(formUpdateComment, props?.log?.id);
      handleCancelUpdateComment();
      clearData("dataUpdateComment");
      setNewComnen(false);
    }
  };

  function handleMouseLeave() {
    setOpenReactMenu(false);
  }

  const handleClickFastEmj = useCallback(
    (value: any) => {
      if (value) {
        postComment({
          ...formPostComment,
          emoji: value,
        });
        setOpenReactMenu(false);
      }
    },
    [formPostComment, postComment]
  );

  const setComment = useCallback(() => {
    setNewComnen(true);
  }, []);

  useEffect(() => {
    if (newCommen) {
      handleUpdateComment();
    }
  }, [newCommen]);

  useEffect(() => {
    if (newReply) {
      handleSaveReply();
    }
  }, [newReply]);

  useEffect(() => {
    if (formReplyComment?.comment) {
      const regex = /<span id="(\d+)".*?>(.*?)<\/span>/g;
      let match;
      const idArray = [];
      while ((match = regex.exec(formReplyComment?.comment))) {
        idArray.push(match[1]);
      }
      const idString = idArray.join(", ");
      setFormReplyComment({ ...formReplyComment, usersId: idString });
    }
  }, [formReplyComment?.comment]);

  if (props.log) {
    const deleteComment = props.deleteHandle;
    const { comment, author, type, id, replyData, createdUser, deleted } =
      props.log;
    const showReplyData = replyData
      ?.map((item: any) =>
        item?.comment !== null
          ? {
              emoji: item?.reaction,
              by: item?.author?.first_name + " " + item?.author?.last_name,
            }
          : null
      )
      .filter((item: any) => item !== null);
    const newData = replyData?.slice()?.reverse();

    const replyDataList = replyData
      ?.map((item: any) =>
        item?.reaction !== null
          ? {
              emoji: item?.reaction,
              by: item?.author?.first_name + " " + item?.author?.last_name,
            }
          : null
      )
      .filter((item: any) => item !== null);

    const handleHoverMouse = () => {
      setOpenReactMenu((prevState: any) => !prevState);
    };

    return (
      <div onMouseLeave={handleMouseLeave}>
        <Grid container spacing={1} mb={2} key={key} id={`${id}`}>
          <Grid item xs={12} md={12}>
            <div className={styles["lognote-items"]}>
              <div style={{ marginLeft: "20px" }} className={styles["user"]}>
                <Tooltip
                  title={createdUser?.first_name + " " + createdUser?.last_name}
                  key={1}
                  style={{
                    marginRight: "4px",
                  }}
                >
                  <Avatar
                    src={
                      createdUser?.profileImg
                        ? getLinkAvatar(createdUser?.profileImg)
                        : ""
                    }
                    alt="Picture of the author"
                    sx={{ width: 50, height: 50, marginTop: "10px" }}
                  />
                </Tooltip>
              </div>
              <div
                style={{ marginTop: "5px" }}
                className={
                  Number(router?.query?.view) == id
                    ? styles["lognote-items-viewed"]
                    : styles["content"]
                }
              >
                <div className={styles["comment"]}>
                  <div>
                    <span className={styles["name-log"]}>
                      {createdUser.first_name
                        ? createdUser.first_name + " " + createdUser.last_name
                        : trans.customer.delete_user}
                    </span>

                    {(type === "log" ||
                      type === "file" ||
                      type === "file-raw") && (
                      <span
                        className={styles["comment-cnt"]}
                        dangerouslySetInnerHTML={{
                          __html: comment,
                        }}
                      />
                    )}
                  </div>

                  {type === "log" && (
                    <div className={styles["time"]}>
                      {moment(createdUser?.time).format(FOMAT_DATE_TIME)}
                    </div>
                  )}

                  {(type === "comment" ||
                    type === "edit-comment" ||
                    type === "file" ||
                    type === "file-raw") && (
                    <div className={styles["time"]}>
                      {moment(createdUser?.time).format(FOMAT_DATE_TIME)}
                    </div>
                  )}

                  {type === "edit-comment" && deleted !== true && (
                    <div className={styles["editted"]}>
                      <i>(edited)</i>
                    </div>
                  )}
                </div>

                {(type === "comment" || type === "edit-comment") &&
                  !openInputTiny && (
                    <div>
                      {!deleted && (
                        <div className={styles["box-cmt"]}>
                          <span
                            className={`${styles["comment-cnt"]}`}
                            dangerouslySetInnerHTML={{
                              __html: checkLinkComment(comment),
                            }}
                          />
                        </div>
                      )}
                      {deleted && (
                        <div className={styles["box-cmt"]}>
                          <span className={styles["comment-cnt-deleted"]}>
                            <i>{trans.contact.this_comment_was_deleted}</i>
                          </span>
                        </div>
                      )}
                      {replyDataList?.length > 0 && (
                        <div className={styles["comment-counter"]}>
                          <SlackCounter
                            counters={replyDataList}
                            user={
                              dataDetailProfile?.profile?.first_name +
                              " " +
                              dataDetailProfile?.profile?.last_name
                            }
                            onSelect={handleClickFastEmj}
                          />
                        </div>
                      )}
                      <div className={styles["line-comment"]}>
                        <Button
                          className={styles["add-comment-emoji"]}
                          onClick={handleHoverMouse}
                        >
                          <Tooltip
                            title={trans.task.add_emoji}
                            key={1}
                            style={{
                              marginRight: "4px",
                            }}
                          >
                            <AddReactionOutlinedIcon
                              className={styles["emoji-inc"]}
                            />
                          </Tooltip>
                        </Button>
                        <div
                          className={styles["reply-line"]}
                          onClick={handleShowReply}
                          id={id}
                        >
                          {showReplyData?.length > 0
                            ? `(${showReplyData?.length})`
                            : ""}{" "}
                          {trans.task.reply}
                        </div>
                        {!openInputTiny && (
                          <div>
                            {isLoggedInUserId === author?.id &&
                              deleted !== true && (
                                <div
                                  className={styles["reply-line"]}
                                  onClick={handleOpenUpdateComment}
                                >
                                  {trans.task.edit}
                                </div>
                              )}
                          </div>
                        )}
                        {!openInputTiny && (
                          <div>
                            {isLoggedInUserId === author?.id &&
                              deleted !== true && (
                                <div
                                  className={styles["reply-line"]}
                                  onClick={() => deleteComment(id)}
                                >
                                  {trans.task.delete}
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {(type === "comment" || type === "edit-comment") &&
                  openInputTiny && (
                    <div className={styles["box-edit-cmt"]}>
                      <CommentBox
                        handleChange={handleChangeCommentUpdate}
                        keyword="comment"
                        value={dataUpdateComment}
                        handleCancelPostNewComment={handleCancelUpdateComment}
                        handlePostNewComment={setComment}
                      />
                    </div>
                  )}

                {openReactMenu &&
                  (type === "comment" || type === "edit-comment") && (
                    <div className={styles["reaction-box"]}>
                      <div className={styles["reaction-box-con"]}>
                        <SlackSelector onSelect={handleClickFastEmj} />
                      </div>
                    </div>
                  )}

                {type === "file" && (
                  <div className={styles["file-image"]}>
                    <img src={handleLinkFile()} />
                  </div>
                )}

                {type === "file-raw" && (
                  <div className={styles["file-image"]}>
                    <Link href={handleLinkFile()} passHref>
                      <a target="_blank" className="text-cursor text-link ml-8">
                        {getNameFileUpload(attachment)}
                      </a>
                    </Link>
                  </div>
                )}

                {(type === "file-raw" || type === "file") && (
                  <div className={styles["line-comment-file"]}>
                    {openReactMenu && (
                      <div className={styles["reaction-box"]}>
                        <div className={styles["reaction-box-con"]}>
                          <SlackSelector onSelect={handleClickFastEmj} />
                        </div>
                      </div>
                    )}
                    {replyDataList?.length > 0 && (
                      <div className={styles["comment-counter"]}>
                        <SlackCounter
                          counters={replyDataList}
                          user={
                            dataDetailProfile?.profile?.first_name +
                            " " +
                            dataDetailProfile?.profile?.last_name
                          }
                          onSelect={handleClickFastEmj}
                        />
                      </div>
                    )}
                    <div className={styles["file-reaction"]}>
                      <Button
                        className={styles["add-comment-emoji"]}
                        onClick={handleHoverMouse}
                      >
                        <Tooltip
                          title={"Add Emoji"}
                          key={1}
                          style={{
                            marginRight: "4px",
                          }}
                        >
                          <AddReactionOutlinedIcon
                            className={styles["emoji-inc"]}
                          />
                        </Tooltip>
                      </Button>
                    </div>
                    <div
                      className={styles["reply-line"]}
                      onClick={handleShowReply}
                      id={id}
                    >
                      {showReplyData?.length > 0
                        ? `(${showReplyData?.length})`
                        : ""}{" "}
                      {trans.task.reply}
                    </div>

                    {!openInputTiny && (
                      <div>
                        {isLoggedInUserId === createdUser?.id && (
                          <div
                            className={styles["reply-line"]}
                            onClick={() => deleteComment(id)}
                          >
                            {trans.task.delete}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Grid>
        </Grid>
        {showReply && (
          <Grid container spacing={1} mb={2} key={key}>
            {newData?.map((items: any, index: any) => {
              return (
                <Reply
                  isLoggedInUserId={isLoggedInUserId}
                  key={items?.id}
                  log={items}
                  deleteHandle={deleteComment}
                  objectId={object?.id}
                  object={object}
                  profile={dataDetailProfile}
                />
              );
            })}
            {(type === "comment" || type === "edit-comment") && (
              <>
                {!openReply ? (
                  <div className={styles["commen-box"]}>
                    <div
                      className={styles["commen-box-btn"]}
                      onClick={handleOpenReply}
                    >
                      {trans.task.write_a_comment}
                    </div>
                  </div>
                ) : (
                  <div className={styles["form-reply"]}>
                    <CommentBox
                      handleChange={handleChangeReply}
                      keyword="comment"
                      handleCancelPostNewComment={handleHideReply}
                      handlePostNewComment={setNewReply}
                    />
                  </div>
                )}
              </>
            )}
          </Grid>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};

const mapStateToProps = (state: any) => ({
  comment: state?.comment,
  deal: state?.deal,
  profile: state?.profile,
});

const mapDispatchToProps = {
  updateComment,
  postComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogNoteChildren);
