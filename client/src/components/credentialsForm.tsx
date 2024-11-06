// import * asReact from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styles, standardMarginPercent } from "./styles";
import { SubmitButton } from "./components";
import { InputParams, InputField } from "./inputField";
import { colors, Typography } from "@mui/material";
import { useState } from "react";

export interface CredentialsFormProps {
  params: InputParams[];
  buttonText: string;
  errorText: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CredentialsForm({
  params,
  buttonText,
  errorText,
  onSubmit: onSubmit,
}: CredentialsFormProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fieldsWithErrors = params
      .filter((field) => field.required && field.value.trim() === "")
      .map((field) => field.name);
    setErrors(fieldsWithErrors);

    if (fieldsWithErrors.length === 0) onSubmit(event);
  };

  return (
    <Container component="main">
      <Box
        sx={{
          ...styles.formBorder,
          ...{
            color: "primary.main",
            padding: standardMarginPercent,
          },
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          width="100%"
          sx={{
            ...{ mt: 3 },
            ...styles.column,
          }}
        >
          <Grid container spacing={2}>
            {params.map((field) => {
              return (
                <Grid item xs={12} key={field.name}>
                  <InputField
                    field={field}
                    fullWidth={true}
                    error={errors.includes(field.name)}
                  />
                </Grid>
              );
            })}

            <Grid item xs={12}>
              <SubmitButton buttonText={buttonText} />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{color: "secondary.main" }}> {errorText} </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
