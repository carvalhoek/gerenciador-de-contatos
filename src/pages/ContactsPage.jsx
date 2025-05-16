import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import ContactList from "../components/ContactList";
import ContactDialog from "../components/ContactDialog";
import {
  getCurrentUserContacts,
  addContact,
  updateContact,
  deleteContact,
} from "../utils/contacts";
import SimpleInput from "../components/SimpleInput";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [asc, setAsc] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentContact, setCurrentContact] = useState({});

  // Carrega contatos do usuário atual ao montar
  useEffect(() => {
    try {
      const list = getCurrentUserContacts();
      setContacts(list);
    } catch (err) {
      alert(`Erro ao carregar contatos: ${err}`);
    }
  }, []);

  // Filtra e ordena contatos
  const filteredContacts = useMemo(() => {
    return contacts
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.cpf.includes(searchTerm)
      )
      .sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return asc ? -1 : 1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return asc ? 1 : -1;
        return 0;
      });
  }, [contacts, searchTerm, asc]);

  // Abre diálogo em modo "criação"
  const handleNew = () => {
    setCurrentContact({});
    setMode("create");
    setDialogOpen(true);
  };

  // Abre diálogo em modo "edição"
  const handleEdit = (contact) => {
    setCurrentContact(contact);
    setMode("edit");
    setDialogOpen(true);
  };

  // Fecha sem salvar
  const handleCancel = () => {
    setDialogOpen(false);
  };

  // Recebe os dados validados do dialog e persiste via serviço
  const handleSubmit = (data, mode) => {
    try {
      if (mode === "create") {
        const list = addContact(data);
        setContacts(list);
      } else {
        const list = updateContact(data);
        setContacts(list);
      }
      setDialogOpen(false);
    } catch (err) {
      alert(`Erro ao salvar contato: ${err}`);
    }
  };

  const handleDelete = (contactId) => {
    try {
      const list = deleteContact(contactId);
      setContacts(list);
    } catch (err) {
      alert(`Erro ao deletar contato: ${err}`);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <SimpleInput
            variant="outlined"
            size="small"
            placeholder="Pesquisar"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton color="primary" onClick={handleNew}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={() => setAsc((prev) => !prev)}>
            <SortByAlphaIcon />
          </IconButton>
        </Stack>

        <ContactDialog
          open={dialogOpen}
          mode={mode}
          initialData={currentContact}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />

        <ContactList
          contacts={filteredContacts}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </Grid>
      <Grid size={8}>
        <Item className="bg-amber-900">size=4</Item>
      </Grid>
    </Grid>
  );
}
