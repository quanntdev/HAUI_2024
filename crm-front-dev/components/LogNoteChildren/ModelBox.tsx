import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TabIcon from "@mui/icons-material/Tab";
import ImageIcon from "@mui/icons-material/Image";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import styles from "./style.module.scss";
import {successToast } from "../../BaseAxios/toast";
import CategoryIcon from '@mui/icons-material/Category';
import useTrans from "../../utils/useTran";

export default function ModelBox(props: any) {
  const {
    location,
    showFile,
    linkLogNote,
    linkFile,
    more,
    object,
  } = props;
  const trans = useTrans()

  const copyLogNote = function (link:any){
    if (link) {
      navigator.clipboard.writeText(link)
        .then(() => {
          successToast(trans.home.copy_success);
        })
        .catch((error) => {
          successToast(trans.home.copy_error);
        });
    } else {
      return;
    }
  }

  const openNewTab = (link:any) => {
    window.open(link, '_blank');
  }

  const openNewImage = () => {
    if(linkFile) {
        return window.open(linkFile, '_blank');
    } else {
        return;
    }
  }

  return (
    <div className={styles["right-modal-box-pra"]}>
      <div
        style={{
          top: location.y,
          left: location.x,
        }}
        className={styles["right-modal-box"]}
      >
        <div className={styles["list-items"]}>
          <div
            onClick={() => copyLogNote(linkLogNote)}
            className={styles["items"]}
          >
            <ContentCopyIcon className={styles["icons"]} />
            <div className={styles["content"]}>{ trans.home.copy_link_lognote }</div>
          </div>
          <div onClick={() => openNewTab(linkLogNote)} className={styles["items"]}>
            <TabIcon className={styles["icons"]} />
            <div className={styles["content"]}>{ trans.home.link_to_new_tab }</div>
          </div>
          <div
            onClick={() => openNewImage()}
            className={showFile ? styles["items"] : styles["items-disable"]}
          >
            <ImageIcon className={styles["icons"]} />
            <div className={styles["content"]}>
              { trans.home.open_file_in_new_tab }
            </div>
          </div>
          <div
            onClick={() => copyLogNote(linkFile)}
            className={showFile ? styles["items"] : styles["items-disable"]}
          >
            <AddPhotoAlternateIcon className={styles["icons"]} />
            <div className={styles["content"]}>{ trans.home.copy_Image_File }</div>
          </div>
          {more && (
            <>
              <div className={styles["line"]}></div>
              <div
                onClick={() => openNewTab(object?.link)}
                className={styles["items"]}
              >
                <CategoryIcon className={styles["icons"]} />
                <div className={styles["content"]}>{ trans.home.view } <span className={styles["content-span"]}>[ {object?.name} ]</span></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
