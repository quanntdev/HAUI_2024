import { Avatar, Button, Tooltip } from "@mui/material";
import getLinkAvatar from "../../utility/getLinkAvatar";
import styles from "./style.module.scss";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRouter } from "next/router";
import linkConversion from "../../utility/linkConversion";
import { useCallback, useEffect, useState } from "react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import {
  FOMAT_DATE_TIME,
  LogNoteActions,
  TYPE_LOGNOTE_COMMENT,
  TYPE_LOGNOTE_FILE,
  TYPE_LOGNOTE_FILE_RAM,
  URL_API_FILE_ATTACHMENT,
} from "../../constants";
import ModelBox from "../LogNoteChildren/ModelBox";
import { SlackSelector, SlackCounter } from "@charkour/react-reactions";
import ReactionBox from "../ReactionBox";
import {
  deleteComment,
  updateComment,
  postComment,
  uploadFile,
  uploadFileRaw,
  clearData,
} from "../../redux/actions/comment";
import { connect } from "react-redux";
import getNameFileUpload from "../../utility/getNameFileUpload";
import useTrans from "../../utils/useTran";
import moment from "moment";
import { checkLinkComment } from "../../utility/checkLinkComment";

const INIT_POST_COMMENT = {
  object: "",
  objectId: null,
  action: null,
  emoji: "",
  note_id: null,
};

const LognoteDashBoard = (props: any) => {
  const trans = useTrans();
  const { dataLog, postComment, isLoggedInUserId } = props;
  const router = useRouter();
  const [showMore, setShowMore] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<any>({
    x: null,
    y: null,
  });
  const [openMenu, setOpenMenu] = useState<any>(false);
  const [openReactMenu, setOpenReactMenu] = useState<boolean>(false);
  const [openEmojiList, setOpenEmojiList] = useState<boolean>(false);
  const [htmlContent, setHtmlContent] = useState("");
  const formPostComment = {
    ...INIT_POST_COMMENT,
    action: LogNoteActions.REACTION,
    objectId: Number(dataLog?.log_notes_object_id),
    object: dataLog?.createdUser?.object,
    note_id: Number(dataLog?.id),
  };

  const handleLink = (object: any, objectId: any, lognoteId: any) => {
    const link: any = linkConversion(object, objectId);
    router.push(link);
  };

  const replyData = dataLog?.replyData
    ?.map((item: any) =>
      item?.reaction !== null
        ? {
            emoji: item?.reaction,
            by: item?.author?.first_name + " " + item?.author?.last_name,
          }
        : null
    )
    .filter((item: any) => item !== null);

  function truncateHTML(html: any, limit: any) {
    const text = html || html?.innerText;
    if (text?.length > limit) {
      return html.substring(0, html.indexOf(text.substring(limit))) + "...";
    }
    return html;
  }

  const truncatedHTML = truncateHTML(dataLog?.comment, 500);

  const showMoreContent = useCallback(() => {
    setShowMore((prevState) => !prevState);
  }, [setShowMore]);

  const handleLinkFile = () => {
    return URL_API_FILE_ATTACHMENT + dataLog?.attachment;
  };

  const contentFile = (link: any, name: any) => {
    return `
    <a href=${link}  target="_blank" style="color:blue; text-decoration: underline; margin-left: 30px">
      ${getNameFileUpload(name)}
    </a>`;
  };

  function handleContextMenu(event: any) {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    setContextMenuPosition({
      x: event.clientX - rect.left ?? 0,
      y: event.clientY - rect.top ?? 0,
    });
    setOpenMenu(true);
  }

  function handleMouseLeave() {
    setOpenMenu(false);
    setOpenReactMenu(false);
    setOpenEmojiList(false);
  }

  const transformLocation = (link: any, lognoteId: any = null) => {
    const url = new URL(link);
    const protocol = url.protocol;
    const domain = url.hostname;
    const port = url.port;
    const path = lognoteId
      ? linkConversion(
          dataLog?.createdUser.object,
          dataLog?.log_notes_object_id,
          lognoteId
        )
      : linkConversion(
          dataLog?.createdUser.object,
          dataLog?.log_notes_object_id
        );
    return `${protocol}//${domain}${port ? ":" : ""}${port}${path}`;
  };

  const showLognote = () => {
    const link: any = linkConversion(
      dataLog?.createdUser.object,
      dataLog?.log_notes_object_id,
      Number(dataLog?.id)
    );
    window.location.href = link;
  };

  const handleHoverMouse = () => {
    setOpenReactMenu(true);
  };

  const openListEmoji = useCallback(() => {
    setOpenReactMenu(false);
    setOpenEmojiList(true);
  }, [setOpenReactMenu, setOpenEmojiList]);

  const handleClickFastEmj = useCallback(
    (value: any) => {
      if (value) {
        postComment({
          ...formPostComment,
          emoji: value,
        });
      }
    },
    [formPostComment, postComment]
  );

  const convertUserObject = (userObject: any) => {
    switch (userObject) {
      case "customers":
        return trans.menu.customer;

      case "contacts":
        return trans.menu.contact;

      case "deals":
        return trans.menu.deal;

      case "orders":
        return trans.menu.order;

      case "invoices":
        return trans.menu.invoice;

      case "tasks":
        return trans.menu.task;

      case "payments":
        return trans.menu.payment;

      case "payment_partner":
        return trans.menu.payment_partner;

      case "invoice_partner":
        return trans.menu.invoice_partner;

      default:
        return userObject;
    }
  };

  const handleLinkCustomer = (idCustomer: any) => {
    const link: any = `/customer/${idCustomer}`;
    router.push(link);
  };

  useEffect(() => {
    let htmlContent = "";

    if (showMore) {
      htmlContent = dataLog?.comment;
    } else {
      const truncatedContent = truncatedHTML;

      if (
        dataLog?.type === TYPE_LOGNOTE_FILE_RAM ||
        dataLog?.type === TYPE_LOGNOTE_FILE
      ) {
        const fileContent = contentFile(handleLinkFile(), dataLog?.attachment);
        htmlContent = truncatedContent + fileContent;
      } else {
        htmlContent = truncatedContent;
      }
    }

    setHtmlContent(htmlContent);

    // Use the htmlContent value or perform further logic here
  }, [showMore, dataLog, truncatedHTML, contentFile, handleLinkFile]);

  return (
    <div className={styles["lognote_Das"]}>
      <div
        onContextMenu={handleContextMenu}
        onMouseLeave={handleMouseLeave}
        onMouseOver={handleHoverMouse}
        className={styles["lognote-items"]}
      >
        {openReactMenu && dataLog?.type === TYPE_LOGNOTE_COMMENT && (
          <ReactionBox
            handleClickFastEmj={handleClickFastEmj}
            openListEmoji={openListEmoji}
          />
        )}
        {openEmojiList && dataLog?.type === TYPE_LOGNOTE_COMMENT && (
          <div className={styles["quickly-react-full"]}>
            <SlackSelector onSelect={handleClickFastEmj} />
          </div>
        )}
        {openMenu && (
          <ModelBox
            location={contextMenuPosition}
            showFile={
              dataLog?.type === TYPE_LOGNOTE_FILE ||
              dataLog?.type === TYPE_LOGNOTE_FILE_RAM
                ? true
                : false
            }
            linkLogNote={transformLocation(
              window.location.href,
              Number(dataLog?.id)
            )}
            linkFile={handleLinkFile()}
            more={true}
            user={{
              profile:
                dataLog?.createdUser?.first_name +
                " " +
                dataLog?.createdUser?.last_name,
              id: Number(dataLog?.createdUser?.id),
            }}
            object={{
              name: dataLog?.lognote_title,
              link: transformLocation(window.location.href),
            }}
          />
        )}

        <div className={styles["user"]}>
          <Tooltip
            title={
              dataLog?.createdUser?.first_name + dataLog?.createdUser?.last_name
            }
            key={1}
            style={{
              marginRight: "4px",
            }}
          >
            <Avatar
              src={getLinkAvatar(dataLog?.createdUser?.profileImg)}
              alt="Picture of the author"
              sx={{ width: 50, height: 50 }}
            />
          </Tooltip>
        </div>

        <div className={styles["lognote-dashboard-content"]}>
          <div className={styles["header"]}>
            {dataLog?.createdUser?.first_name &&
            dataLog?.createdUser?.last_name ? (
              <>
                <span className={styles["name"]}>
                  {dataLog?.createdUser?.first_name +
                    " " +
                    dataLog?.createdUser?.last_name}
                </span>
              </>
            ) : (
              <span className={styles["name"]}>
                {trans.customer.delete_user}
              </span>
            )}
            <span className={styles["icon-to"]}>
              <ArrowCircleRightIcon className={styles["icon-to-ic"]} />
            </span>

            {dataLog?.lognote_title != " " ? (
              <span className={styles["object"]}>
                {convertUserObject(dataLog?.createdUser?.object)}
                <span
                  onClick={(e) =>
                    handleLink(
                      dataLog?.createdUser?.object,
                      dataLog?.log_notes_object_id,
                      dataLog?.id
                    )
                  }
                  className={styles["object-type"]}
                >
                  {dataLog?.lognote_title
                    ? dataLog?.lognote_title
                    : `#${dataLog?.log_notes_object_id}`}
                </span>
              </span>
            ) : (
              <span className={styles["object"]}>
                {trans.customer.delete_customer}
              </span>
            )}

            {dataLog?.lognote_title != " " && (
              <span>
                {dataLog?.createdUser?.object == "deals" && (
                  <span style={{ marginLeft: "10px" }}>
                    ( {trans.menu.customer}
                    <i
                      onClick={(e) => handleLinkCustomer(dataLog?.customer_id)}
                      className={styles["object-name-customer"]}
                    >
                      {dataLog?.deal_customer_name}
                    </i>{" "}
                    )
                  </span>
                )}
              </span>
            )}

            <span
              className={styles["time"]}
              onClick={dataLog?.lognote_title !== " " ? showLognote : undefined}
            >
              <i>
                <AccessTimeIcon className={styles["time-icon"]} />
                {moment(dataLog?.createdUser?.time).format(FOMAT_DATE_TIME)}
              </i>
            </span>
          </div>
          <div
            className={styles["body"]}
            dangerouslySetInnerHTML={{ __html: checkLinkComment(htmlContent) }}
          ></div>
          {dataLog?.comment?.length > 500 && (
            <Button
              onClick={showMoreContent}
              className={styles["show-all-content"]}
            >
              {showMore ? "Collapse" : "More"}
            </Button>
          )}
        </div>
      </div>

      {dataLog?.type === TYPE_LOGNOTE_COMMENT && replyData.length > 0 && (
        <div className={styles["quickly-react-counter"]}>
          <SlackCounter
            counters={replyData}
            user={
              isLoggedInUserId?.profile?.first_name +
              " " +
              isLoggedInUserId?.profile?.last_name
            }
            onSelect={handleClickFastEmj}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  comment: state?.comment,
});

const mapDispatchToProps = {
  postComment,
  deleteComment,
  uploadFile,
  updateComment,
  uploadFileRaw,
  clearData,
};

export default connect(mapStateToProps, mapDispatchToProps)(LognoteDashBoard);
