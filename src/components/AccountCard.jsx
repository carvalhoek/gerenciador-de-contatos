import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import Logout from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmPasswordDialog from "./ConfirmPasswordDialog";

function AccountCard({ handleLogout, handleDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
        <Avatar sx={{ width: 48, height: 48 }}></Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            handleLogout();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Deletar Conta
        </MenuItem>
      </Menu>
      <ConfirmPasswordDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        onConfirm={() => {
          handleDelete();
          setDialogOpen(false);
        }}
      />
    </>
  );
}
export default AccountCard;
