import React from "react";
import { TextField, Grid, Checkbox } from "@material-ui/core";
import { useFormContext, Controller } from "react-hook-form";
// import { CheckBox } from '@material-ui/icons'

const FormInput = ({ name, label }) => {
  const { control } = useFormContext();
  return (
    <Grid item xs={12} sm={6}>
      <Controller
        as={TextField}
        fullWidth
        label={label}
        name={name}
        control={control}
        defaultValue=""
      />
    </Grid>
  );
};

export default FormInput;
