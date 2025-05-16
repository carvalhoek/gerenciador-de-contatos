import { TextField } from "@mui/material";

// fornece uma maneira fácil de estilizar o input padrão ao longo da aplicação
function SimpleInput(props) {
  return (
    <TextField
      fullWidth
      {...props}
      className="border border-slate-300 outline-slate-500 px-4 py-2 rounded-md"
    />
  );
}
export default SimpleInput;
