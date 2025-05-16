import { TextField } from "@mui/material";

function SimpleInput(props) {
  return (
    <TextField
      {...props}
      className="border border-slate-300 outline-slate-500 px-4 py-2 rounded-md"
    />
  );
}
export default SimpleInput;
