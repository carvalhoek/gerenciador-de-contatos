import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { cpf } from "cpf-cnpj-validator";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import CancelButton from "./CancelButton";
import ConfirmButton from "./ConfirmButton";
import SimpleInput from "./SimpleInput";

// Schema de validação
const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().refine((val) => cpf.isValid(val), "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
});

/**
 * ContactDialog
 * @param {Object} props
 * @param {boolean} props.open - Controla se o dialog está aberto
 * @param {'create'|'edit'} [props.mode] - Modo do diálogo: 'create' ou 'edit'
 * @param {Object} [props.initialData] - Dados iniciais para edição
 * @param {Function} props.onCancel - Função chamada ao cancelar
 * @param {Function} props.onSubmit - Função chamada ao enviar (recebe os dados validados)
 */
export default function ContactDialog({
  open,
  mode = "create",
  initialData = {},
  onCancel,
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData.name || "",
      cpf: initialData.cpf || "",
      phone: initialData.phone || "",
    },
  });

  // Atualiza os valores quando initialData mudar
  React.useEffect(() => {
    reset({
      name: initialData.name || "",
      cpf: initialData.cpf || "",
      phone: initialData.phone || "",
    });
  }, [initialData, reset]);

  const submitHandler = (data) => {
    // Gera um ID para novos contatos ou mantém o existente em modo de edição
    const id = mode === "create" ? uuidv4() : initialData.id;
    onSubmit({ id, ...data }, mode);
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "edit" ? "Editar Contato" : "Criar Contato"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <SimpleInput
            label="Nome"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
          <SimpleInput
            label="CPF"
            {...register("cpf")}
            error={!!errors.cpf}
            helperText={errors.cpf?.message}
            fullWidth
          />
          <SimpleInput
            label="Telefone"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={onCancel}>Cancelar</CancelButton>
        <ConfirmButton
          onClick={handleSubmit(submitHandler)}
          variant="contained"
        >
          {mode === "edit" ? "Salvar" : "Criar"}
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
}
