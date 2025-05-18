import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";

function ContactList({
  contacts,
  handleDelete,
  handleEdit,
  handleContactLocationSelect,
}) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (contact) => {
    setSelectedContact(contact);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedContact(null);
  };
  const onDeleteContact = (id) => {
    handleDelete(id);
  };
  const onEditContact = (contact) => {
    handleEdit(contact);
  };
  const onContactLocationSelect = (contact) => {
    handleContactLocationSelect(contact);
  };
  return (
    <div>
      <List className="space-y-2">
        {contacts.map((contact) => (
          <ListItem
            className="bg-slate-200 hover:bg-slate-300 cursor-pointer"
            key={contact.id}
            secondaryAction={
              <div className="flex gap-2">
                <IconButton
                  edge="end"
                  aria-label="editar"
                  onClick={() => onEditContact(contact)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="deletar"
                  onClick={() => handleClickOpen(contact)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            }
          >
            <ListItemText
              onClick={() => onContactLocationSelect(contact)}
              primary={contact.name + " - " + contact.cpf}
              secondary={contact.phone}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Deletar Contato"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você tem certeza que deseja deletar o contato{" "}
            {selectedContact?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={() => {
              onDeleteContact(selectedContact.id);
              handleClose();
            }}
            color="error"
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ContactList;
