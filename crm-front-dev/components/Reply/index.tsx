import { Grid, Avatar, Tooltip, Button } from "@mui/material";
import styles from "./style.module.scss";
import getLinkAvatar from "../../utility/getLinkAvatar";
import { useCallback, useEffect, useState } from "react";
import { EMOJI, LogNoteActions } from "../../constants";
import { connect } from "react-redux";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import {
  updateComment,
  clearData,
  postComment,
} from "../../redux/actions/comment";
import CommentBox from "../Input/InputTiny/CommentBox";
import {
  SlackCounter,
  SlackSelector,
  SlackSelectorHeader,
} from "@charkour/react-reactions";
import { useRouter } from "next/router";
import useTrans from "../../utils/useTran";
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
  emoji: "",
};

const ReplyComment = function (props: any) {
  const trans = useTrans();
  const { updateComment, postComment, profile } = props;
  const { isLoggedInUserId, key, object, objectId } = props;
  const [openInputTiny, setOpenInputTiny] = useState<boolean>(false);
  const [newCommen, setNewComnen] = useState<boolean>(false);
  const [openReactMenu, setOpenReactMenu] = useState<boolean>(false);
  const [formUpdateComment, setFormUpdateComment] = useState<any>({
    ...INIT_UPDATE_COMMENT,
    comment: props?.log?.comment,
  });
  const router = useRouter();

  const formReplyComment = {
    ...INIT_POST_REPLY,
    object: object,
    objectId: Number(objectId),
    note_id: Number(props?.log?.id),
    action: LogNoteActions.COMMENT,
  };

  useEffect(() => {
    setFormUpdateComment({
      ...formUpdateComment,
      comment: props?.log?.comment,
    });
  }, [props.log]);

  const handleOpenUpdateComment = useCallback(() => {
    setOpenInputTiny(true);
  }, [setOpenInputTiny]);

  const handleCancelUpdateComment = useCallback(() => {
    setOpenInputTiny(false);
  }, [setOpenInputTiny]);

  const handleChangeCommentUpdate = useCallback(
    (key: any, value: any) => {
      setFormUpdateComment((prevFormUpdateComment: any) => ({
        ...prevFormUpdateComment,
        [key]: value,
      }));
    },
    [setFormUpdateComment]
  );

  const handleUpdateComment = () => {
    if (props.log.id) {
      updateComment(formUpdateComment, props?.log?.id);
      handleCancelUpdateComment();
      clearData("dataUpdateComment");
    }
  };

  useEffect(() => {
    if (newCommen) {
      handleUpdateComment();
    }
  }, [newCommen]);

  const handleHoverMouse = useCallback(() => {
    setOpenReactMenu((prevOpenReactMenu: any) => !prevOpenReactMenu);
  }, [setOpenReactMenu]);

  const handleClickFastEmj = useCallback(
    (value: any) => {
      if (value) {
        postComment({
          ...formReplyComment,
          emoji: value,
        });
        setOpenReactMenu(false);
      }
    },
    [formReplyComment, postComment, setOpenReactMenu]
  );

  function handleMouseLeave() {
    setOpenReactMenu(false);
  }

  SlackSelectorHeader.defaultProps = {
    tabs: [
      {
        icon: EMOJI.MINE,
        id: "mine",
      },
      {
        icon: EMOJI.PEOPLE,
        id: "people",
      },
      {
        icon: EMOJI.NATURE,
        id: "nature",
      },
      {
        icon: EMOJI.FOOD_AND_DRINK,
        id: "food-and-drink",
      },
      {
        icon: EMOJI.ACTIVITY,
        id: "activity",
      },
      {
        icon: EMOJI.TRAVEL_AND_PLACES,
        id: "travel-and-places",
      },
      {
        icon: EMOJI.OBJECTS,
        id: "objects",
      },
      {
        icon: EMOJI.SYMBOLS,
        id: "symbols",
      },
      {
        icon: EMOJI.FLAGS,
        id: "flags",
      },
    ],
  };

  if (props.log && props.log.comment) {
    const deleteComment = props.deleteHandle;
    const { comment, author, time, type, id, ReplyReaction } = props.log;
    const replyDataList = ReplyReaction?.map((item: any) =>
      item?.reaction !== null
        ? {
            emoji: item?.reaction,
            by: item?.author?.first_name + " " + item?.author?.last_name,
          }
        : null
    ).filter((item: any) => item !== null);
    return (
      <div
        onMouseLeave={handleMouseLeave}
        className={styles["reply-children"]}
        key={key}
      >
        <Grid container spacing={1} mb={2} key={key} id={`${id}`}>
          <div
            className={styles["lognote-items"]}
            key={key}
            style={{
              border: Number(router?.query?.view) == id ? "1px solid red" : "",
              borderRadius: Number(router?.query?.view) == id ? "3px" : "",
              padding: Number(router?.query?.view) == id ? "5px" : "",
            }}
          >
            <div className={styles["user"]}>
              <Tooltip
                title={author?.first_name + " " + author?.last_name}
                key={1}
                style={{
                  marginRight: "4px",
                }}
              >
                <Avatar
                  src={
                    author?.profileImg ? getLinkAvatar(author?.profileImg) : ""
                  }
                  alt="Picture of the author"
                  sx={{ width: 30, height: 30 }}
                />
              </Tooltip>
            </div>

            <div className={styles["content"]}>
              <div className={styles["comment"]}>
                <div className={styles["name-log"]}>
                  {author?.first_name + " " + author?.last_name}
                </div>
                {(type === "log" || type === "file" || type === "file-raw") && (
                  <span
                    className={styles["comment-cnt"]}
                    dangerouslySetInnerHTML={{
                      __html: comment,
                    }}
                  />
                )}
                {(type === "comment" || type === "edit-comment") && (
                  <div className={styles["time"]}>{time}</div>
                )}
                {type === "edit-comment" && (
                  <div className={styles["editted"]}>
                    <i>(edited)</i>
                  </div>
                )}
              </div>
              {(type === "log" || type === "file" || type === "file-raw") && (
                <div className={styles["time"]}>{time}</div>
              )}
              {(type === "comment" || type === "edit-comment") &&
                !openInputTiny && (
                  <div>
                    <div className={styles["box-cmt"]}>
                      <span
                        className={styles["comment-cnt"]}
                        dangerouslySetInnerHTML={{
                          __html: checkLinkComment(comment),
                        }}
                      />
                    </div>
                    <div className={styles["line-comment"]}>
                      {ReplyReaction?.length > 0 && (
                        <div className={styles["comment-counter"]}>
                          <SlackCounter
                            counters={replyDataList}
                            user={
                              profile?.profile?.first_name +
                              " " +
                              profile?.profile?.last_name
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
                      {!openInputTiny && (
                        <div>
                          {isLoggedInUserId === author?.id && (
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
                          {isLoggedInUserId === author?.id && (
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
                      value={formUpdateComment?.comment}
                      handleCancelPostNewComment={handleCancelUpdateComment}
                      handlePostNewComment={setNewComnen}
                    />
                  </div>
                )}
              {openReactMenu && (
                <div className={styles["reaction-box"]}>
                  <div className={styles["reaction-box-con"]}>
                    <SlackSelector onSelect={handleClickFastEmj} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Grid>
      </div>
    );
  } else {
    return <></>;
  }
};

const mapStateToProps = (state: any) => ({
  comment: state?.comment,
  deal: state?.deal,
});

const mapDispatchToProps = {
  updateComment,
  postComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReplyComment);
