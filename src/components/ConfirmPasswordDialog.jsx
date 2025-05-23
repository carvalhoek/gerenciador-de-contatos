import { useState } from "react";
import PasswordInput from "./PasswordInput";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { confirmCurrentUserPassword } from "../utils/AuthService";
import CancelButton from "./CancelButton";
import ConfirmButton from "./ConfirmButton";
import { Stack } from "@mui/material";

export default function ConfirmPasswordDialog({
  open,
  handleClose,
  onConfirm,
}) {
  const [password, setPassword] = useState("");

  const handleCancel = () => {
    setPassword("");
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmCurrentUserPassword(password)) {
      onConfirm();
    } else {
      alert("Senha não corresponde.");
      setPassword("");
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Deletar sua conta</DialogTitle>

        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              Para confirmar a exclusão, digite sua senha. Todos os seus dados
              serão excluídos permanentemente.
            </DialogContentText>
            <PasswordInput
              required
              id="password"
              name="password"
              label="Confirme sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleCancel}>Cancelar</CancelButton>
          <ConfirmButton type="submit">Confirmar</ConfirmButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
