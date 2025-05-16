import { Button } from "@mui/material";

function ConfirmButton(props) {
  return <Button {...props}>{props.children}</Button>;
}

export default ConfirmButton;
