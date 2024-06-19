import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordDefault = (props: any) => {
  const {
    name,
    value,
    showPass,
    setShowPass,
    handleChange,
    errorText,
    labelText,
    require = true,
  } = props;
  const handleShowPass = () => setShowPass(!showPass);

  return (
    <>
      <Typography
        display="inline"
        className={require ? "require" : ""}
      >
        {labelText}
      </Typography>
      <TextField
        onChange={(e: any) =>
          name
            ? handleChange(name, e.target.value)
            : handleChange(e.target.value)
        }
        fullWidth
        type={showPass ? "text" : "password"}
        name={name}
        value={value ?? ""}
        error={!!errorText}
        helperText={errorText ?? ""}
        autoComplete="new-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowPass}
                edge="end"
              >
                {value?.length > 0 &&
                  (showPass ? <VisibilityOff /> : <Visibility />)}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};
export default PasswordDefault;
