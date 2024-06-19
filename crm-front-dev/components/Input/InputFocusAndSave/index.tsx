import { TextField, Typography } from "@mui/material";


const InputFocusAndSave = (props: any) => {
  const {
    value,
    size,
    onChange,
    onClick,
    onBlur,
    style,
    className,
    editTitle,
    keyword,
  } = props;

  return (
    <>
      {
        editTitle ?
          <TextField
            value={value}
            style={style}
            size={size}
            className={className}
            onChange={(e: any) => onChange(keyword, e.target.value)}
            onBlur={onBlur}
            variant="standard"
            fullWidth
          /> :
          <Typography
            className="title-text"
            onClick={onClick}
          >
            {value}
          </Typography>
      }
    </>
  )
}

export default InputFocusAndSave;
