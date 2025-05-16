import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { cpf } from "cpf-cnpj-validator";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Stack, TextField, MenuItem, Autocomplete } from "@mui/material";
import { debounce } from "lodash";
import CancelButton from "./CancelButton";
import ConfirmButton from "./ConfirmButton";
import { getAddressByCEP, getCepByAddress } from "../utils/CepService";
import { getCoordinatesByContact } from "../utils/googleGeocodeService";
import SimpleInput from "./SimpleInput";
import { googleMapsApiKey } from "../keys";
// ALTERAR Lista de unidades federativas
const BR_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

// Schema de validação
const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().refine((val) => cpf.isValid(val), "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido")
    .optional(),
  state: z.enum(BR_STATES, {
    errorMap: () => ({ message: "Estado é obrigatório" }),
  }),
  city: z.string().min(1, "Cidade é obrigatória"),
  address: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  latitude: z.number({ invalid_type_error: "Latitude obrigatória" }),
  longitude: z.number({ invalid_type_error: "Longitude obrigatória" }),
});

export default function ContactDialog({
  open,
  mode = "create",
  initialData = {},
  onCancel,
  onSubmit,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData.name || "",
      cpf: initialData.cpf || "",
      phone: initialData.phone || "",
      cep: initialData.cep || "",
      state: initialData.state || "",
      city: initialData.city || "",
      address: initialData.address || "",
      number: initialData.number || "",
      complement: initialData.complement || "",
      latitude: initialData.latitude ?? null,
      longitude: initialData.longitude ?? null,
    },
  });

  const watchedCEP = watch("cep");
  const watchedState = watch("state");
  const watchedCity = watch("city");
  const watchedAddress = watch("address");
  const [addressOptions, setAddressOptions] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Atualiza valores quando initialData mudar
  useEffect(() => {
    reset({
      name: initialData.name || "",
      cpf: initialData.cpf || "",
      phone: initialData.phone || "",
      cep: initialData.cep || "",
      state: initialData.state || "",
      city: initialData.city || "",
      address: initialData.address || "",
      number: initialData.number || "",
      complement: initialData.complement || "",
      latitude: initialData.latitude ?? null,
      longitude: initialData.longitude ?? null,
    });
    console.log("initialData", initialData);
  }, [initialData, reset]);

  // Debounce evita chamadas excessivas
  const lookupByCep = useMemo(
    () =>
      debounce(async (cep) => {
        try {
          const data = await getAddressByCEP(cep);
          setValue("state", data.uf);
          setValue("city", data.localidade);
          setValue("address", data.logradouro);
        } catch (err) {
          console.error(err);
        }
        setLoadingAddress(false);
      }, 500),
    [setValue]
  );

  // Debounce evita chamadas excessivas
  const lookupByAddress = useMemo(
    () =>
      debounce(async (state, city, address) => {
        setLoadingAddress(true);
        if (!state || !city || !address) {
          setLoadingAddress(false);
          return;
        }
        try {
          const list = await getCepByAddress(state, city, address);
          // manter apenas uma entrada por combinação logradouro  cidade
          const map = new Map();
          list.forEach((item) => {
            const key = `${item.logradouro}::${item.localidade}`;
            if (!map.has(key)) {
              map.set(key, item);
            }
          });
          const uniqueItems = Array.from(map.values());
          // montar opções com label e payload completo
          const options = uniqueItems.map((item) => ({
            label: `${item.logradouro} - ${item.localidade}`,
            value: item,
          }));
          setAddressOptions(options);
        } catch (err) {
          console.error(err);
          setAddressOptions([]);
        } finally {
          setLoadingAddress(false);
        }
      }, 500),
    [setLoadingAddress, setAddressOptions]
  );

  // Efeitos de busca
  useEffect(() => {
    setLoadingAddress(true);
    if (watchedCEP && /^\d{5}-?\d{3}$/.test(watchedCEP)) {
      lookupByCep(watchedCEP);
    }
  }, [watchedCEP, lookupByCep]);

  useEffect(() => {
    setLoadingAddress(true);
    lookupByAddress(watchedState, watchedCity, watchedAddress);
  }, [watchedState, watchedCity, watchedAddress, lookupByAddress]);

  const submitHandler = (data) => {
    const id = mode === "create" ? uuidv4() : initialData.id;
    onSubmit({ id, ...data }, mode);
  };
  async function handleGeocode() {
    try {
      // obtém todos os campos de endereço do form
      const { cep, state, city, address, number, complement } = getValues();
      console.log("form", { cep, state, city, address, number, complement });
      // chave de API injetada via props ou env
      const coords = await getCoordinatesByContact(
        { cep, state, city, address, number, complement },
        googleMapsApiKey
      );
      setValue("latitude", coords.lat);
      setValue("longitude", coords.lng);
    } catch (err) {
      console.error("Erro ao geocodificar:", err);
    }
  }
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "edit" ? "Editar Contato" : "Criar Contato"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={2}>
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
          <TextField
            label="CEP"
            {...register("cep")}
            error={!!errors.cep}
            helperText={errors.cep?.message}
            fullWidth
          />

          <Controller
            name="state"
            control={control}
            defaultValue={initialData.state || ""}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                fullWidth
                disablePortal
                options={BR_STATES}
                value={value}
                onChange={(_, newVal) => onChange(newVal)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Estado"
                    error={!!errors.state}
                    helperText={errors.state?.message}
                    fullWidth
                  />
                )}
              />
            )}
          />

          <TextField
            label="Cidade"
            {...register("city")}
            error={!!errors.city}
            helperText={errors.city?.message}
            fullWidth
          />
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                options={addressOptions}
                loading={loadingAddress}
                inputValue={field.value}
                onInputChange={(_, v) => field.onChange(v)}
                getOptionLabel={(opt) => opt.label}
                onChange={(_, opt) =>
                  opt && setValue("address", opt.value.logradouro)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Endereço"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    fullWidth
                  />
                )}
              />
            )}
          />
          <TextField
            label="Número"
            {...register("number")}
            error={!!errors.number}
            helperText={errors.number?.message}
            fullWidth
          />
          <TextField
            label="Complemento"
            {...register("complement")}
            error={!!errors.complement}
            helperText={errors.complement?.message}
            fullWidth
          />
          {/* 4) Campos de latitude e longitude */}
          <SimpleInput
            label="Latitude"
            type="number"
            {...register("latitude", { valueAsNumber: true })}
            error={!!errors.latitude}
            helperText={errors.latitude?.message}
            fullWidth
          />
          <SimpleInput
            label="Longitude"
            type="number"
            {...register("longitude", { valueAsNumber: true })}
            error={!!errors.longitude}
            helperText={errors.longitude?.message}
            fullWidth
          />

          {/* 5) Botão para buscar coordenadas */}
          <Button variant="outlined" onClick={handleGeocode}>
            Buscar Coordenadas
          </Button>
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
