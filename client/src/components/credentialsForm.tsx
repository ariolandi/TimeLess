// import * asReact from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styles, standardMarginPercent } from "./styles";
import { SubmitButton } from "./components";
import { InputParams, InputField } from "./textField";

export interface CredentialsFormProps {
  params: InputParams[];
  buttonText: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CredentialsForm({
  params,
  buttonText,
  onSubmit: onSubmit,
}: CredentialsFormProps) {
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
          onSubmit={onSubmit}
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
                    required={true}
                  />
                </Grid>
              );
            })}

            <Grid item xs={12}>
              <SubmitButton buttonText={buttonText} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
