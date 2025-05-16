import { Button } from "@mui/material";

function CancelButton(props) {
  return (
    <Button color="error" {...props}>
      {props.children}
    </Button>
  );
}

export default CancelButton;
