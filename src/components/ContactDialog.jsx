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
import { Stack, MenuItem, Autocomplete, Divider, Grid } from "@mui/material";
import { debounce } from "lodash";
import CancelButton from "./CancelButton";
import ConfirmButton from "./ConfirmButton";
import { getAddressByCEP, getCepByAddress } from "../utils/CepService";
import { getCoordinatesByContact } from "../utils/googleGeocodeService";
import SimpleInput from "./SimpleInput";
import { googleMapsApiKey } from "../keys";
import { BR_STATES } from "../utils/Data";

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
      latitude: initialData.latitude ?? "",
      longitude: initialData.longitude ?? "",
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
      latitude: initialData.latitude ?? "",
      longitude: initialData.longitude ?? "",
    });
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
          alert(err);
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

        const letterCountAdress = (address.match(/[A-Za-z]/g) || []).length;
        const letterCountCity = (city.match(/[A-Za-z]/g) || []).length;

        if (letterCountAdress <= 3 || letterCountCity <= 3) {
          // se tiver 3 letras ou menos, não faz a requisição evitando o erro da API
          setLoadingAddress(false);
          return;
        }

        if (!state || !city || !address) {
          setLoadingAddress(false);
          return;
        }
        try {
          const list = await getCepByAddress(state, city, address);
          // filtrar única ocorrência por (logradouro + complemento + "-" + localidade)
          const seen = new Set();
          const options = list
            .filter((item) => {
              const key = `${item.logradouro}|${item.complemento}|${item.localidade}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            })
            .map((item) => ({
              label: `${item.logradouro}${
                item.complemento ? ` ${" - " + item.complemento}` : ""
              } - ${item.localidade}`,
              payload: item,
            }));
          setAddressOptions(options);
        } catch (err) {
          alert(err);
          setAddressOptions([]);
        } finally {
          setLoadingAddress(false);
        }
      }, 500),
    [setLoadingAddress, setAddressOptions]
  );

  const handleAdressSelect = (cep, state, city) => {
    setValue("cep", cep);
    setValue("state", state);
    setValue("city", city);
  };

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
      // chave de API injetada via props ou env
      const coords = await getCoordinatesByContact(
        { cep, state, city, address, number, complement },
        googleMapsApiKey
      );
      setValue("latitude", coords.lat);
      setValue("longitude", coords.lng);
    } catch (err) {
      alert(`Erro ao geocodificar: ${err}`);
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

          <Stack direction="row" spacing={2}>
            <Controller
              name="cpf"
              control={control}
              defaultValue={initialData.cpf || ""}
              rules={{
                required: "CPF é obrigatório",
                pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              }}
              render={({ field }) => (
                <SimpleInput
                  {...field}
                  label="CPF"
                  error={!!errors.cpf}
                  helperText={errors.cpf?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              defaultValue={initialData.phone || ""}
              rules={{
                required: "Telefone é obrigatório",
                pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
              }}
              render={({ field }) => (
                <SimpleInput
                  {...field}
                  label="Telefone"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  fullWidth
                />
              )}
            />
          </Stack>

          <Controller
            name="cep"
            control={control}
            defaultValue={initialData.cep || ""}
            rules={{
              required: "CEP é obrigatório",
              pattern: /^\d{5}-\d{3}$/,
            }}
            render={({ field }) => (
              <SimpleInput
                {...field}
                label="CEP"
                error={!!errors.cep}
                helperText={errors.cep?.message}
                fullWidth
              />
            )}
          />

          <Grid container spacing={2}>
            <Grid size={4}>
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
                      <SimpleInput
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
            </Grid>
            <Grid size={8}>
              <Controller
                name="city"
                control={control}
                defaultValue={initialData.city || ""}
                rules={{
                  required: "Cidade é obrigatória",
                }}
                render={({ field }) => (
                  <SimpleInput
                    {...field}
                    label="Cidade"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>

          <Controller
            name="address"
            control={control}
            defaultValue={initialData.address || ""}
            render={({ field }) => (
              <Autocomplete
                freeSolo
                options={addressOptions}
                loading={loadingAddress}
                inputValue={field.value}
                onInputChange={(_, v) => field.onChange(v)}
                getOptionLabel={(opt) => opt.label}
                onChange={(_, opt) => {
                  if (!opt) return;
                  // grava apenas o logradouro
                  field.onChange(opt.payload.logradouro);
                  // atualiza CEP, estado e cidade
                  handleAdressSelect(
                    opt.payload.cep,
                    opt.payload.uf,
                    opt.payload.localidade
                  );
                }}
                renderInput={(params) => (
                  <SimpleInput
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

          <Grid container spacing={2}>
            <Grid size={4}>
              <SimpleInput
                label="Número"
                {...register("number")}
                error={!!errors.number}
                helperText={errors.number?.message}
                fullWidth
              />
            </Grid>
            <Grid size={8}>
              <SimpleInput
                label="Complemento"
                {...register("complement")}
                error={!!errors.complement}
                helperText={errors.complement?.message}
                fullWidth
              />
            </Grid>
          </Grid>

          <Divider />

          <Stack direction="row" spacing={2}>
            <Controller
              name="latitude"
              control={control}
              defaultValue={initialData.latitude ?? ""}
              rules={{
                required: "Latitude é obrigatória",
                validate: (value) =>
                  !isNaN(parseFloat(value)) || "Latitude inválida",
              }}
              render={({ field }) => (
                <SimpleInput
                  {...field}
                  slotProps={{ input: { readOnly: true } }}
                  label="Latitude"
                  error={!!errors.latitude}
                  helperText={errors.latitude?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="longitude"
              control={control}
              defaultValue={initialData.longitude ?? ""}
              rules={{
                required: "Longitude é obrigatória",
                validate: (value) =>
                  !isNaN(parseFloat(value)) || "Longitude inválida",
              }}
              render={({ field }) => (
                <SimpleInput
                  {...field}
                  slotProps={{ input: { readOnly: true } }}
                  label="Longitude"
                  error={!!errors.longitude}
                  helperText={errors.longitude?.message}
                  fullWidth
                />
              )}
            />
          </Stack>

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
