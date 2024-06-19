import { Button, Tooltip } from "@mui/material";
import styles from "./style.module.scss";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import { EMOJI } from "../../constants";

const ReactionBox = (props: any) => {
  const { handleClickFastEmj, openListEmoji, right } = props;
  return (
    <>
      <div className={styles["quickly-react"]} style={{right: right ?? "100px"}}>
        <Tooltip title="Like">
          <Button
            className={styles["quickly-react-button"]}
          >
          <div onClick={() => handleClickFastEmj(EMOJI.LIKE)}>{EMOJI.LIKE}</div>
          </Button>
        </Tooltip>
        <Tooltip title="Tym">
          <Button
            className={styles["quickly-react-button"]}
          >
            <div onClick={() => handleClickFastEmj(EMOJI.TYM)}>{EMOJI.TYM}</div>
          </Button>
        </Tooltip>
        <Tooltip title="Taking a look">
          <Button
            className={styles["quickly-react-button"]}
          >
          <div onClick={() => handleClickFastEmj(EMOJI.LOOK)}>{EMOJI.LOOK}</div>
          </Button>
        </Tooltip>
        <Tooltip title="Done">
          <Button
            className={styles["quickly-react-button"]}
          >
            <div onClick={() => handleClickFastEmj(EMOJI.DONE)}>{EMOJI.DONE}</div>
          </Button>
        </Tooltip>
        <Tooltip title="Nicely Done">
          <Button
            className={styles["quickly-react-button"]}
          >
            <div onClick={() => handleClickFastEmj(EMOJI.NICELY_DONE)}>{EMOJI.NICELY_DONE}</div>
          </Button>
        </Tooltip>
        <Tooltip title="Add Emoji">
          <Button
            className={styles["quickly-react-button"]}
            onClick={openListEmoji}
          >
            <AddReactionOutlinedIcon />
          </Button>
        </Tooltip>
      </div>
    </>
  );
};

export default ReactionBox;
