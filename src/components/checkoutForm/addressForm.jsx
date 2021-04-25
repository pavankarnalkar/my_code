import React, { useState, useEffect } from "react";
import {
  InputLabel,
  Select,
  MenuLabel,
  Button,
  Grid,
  Typography,
  MenuItem,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "./CustomTextFields";
import { commerce } from "../../lib/commerce";

const AddressForm = ({ checkoutToken, next }) => {
  const methods = useForm();
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingSubDivisions, setShippingSubDivisions] = useState([]);
  const [shippingSubDivision, setShippingSubDivision] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));

  const subdivisions = Object.entries(shippingSubDivisions).map(
    ([code, name]) => ({
      id: code,
      label: name,
    })
  );

  const options = shippingOptions.map((sO) => ({
    id: sO.id,
    label: `${sO.description} - (${sO.price.formatted_with_symbol})`,
  }));

  console.log(countries, "countries");
  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );
    console.log(countries, "countries");
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
    console.log(shippingCountries, "shippingCountries");
  };

  const fetchSubdivision = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(
      countryCode
    );
    setShippingSubDivisions(subdivisions);
    setShippingSubDivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    country,
    region = null
  ) => {
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      { country, region }
    );
    console.log(options, "options");

    setShippingOptions(options);
    setShippingOption(options[0]);
  };

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchSubdivision(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubDivisions)
      fetchShippingOptions(
        checkoutToken.id,
        shippingCountry,
        shippingSubDivision
      );
  }, [shippingSubDivisions]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) =>
            next({
              ...data,
              shippingCountry,
              shippingSubDivision,
              shippingOption,
            })
          )}
        >
          <Grid container spacing={3}>
            <FormInput name="firstName" label="First Name" required />
            <FormInput name="lastName" label="Lirst Name" required />
            <FormInput name="address1" label="Address" required />
            <FormInput name="email" label="Email" required />
            <FormInput name="city" label="City" required />
            <FormInput name="zip" label="ZIP / Postal code" required />
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select
                value={shippingCountry}
                fullWidth
                onChange={(e) => setShippingCountry(e.target.value)}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select
                value={shippingSubDivision}
                fullWidth
                onChange={(e) => setShippingSubDivision(e.target.value)}
              >
                {subdivisions.map((subdivision) => (
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select
                value={shippingOption}
                fullWidth
                onChange={(e) => setShippingOption(e.target.value)}
              >
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button component={Link} to="/cart" variant="outlined">
              Back To Cart
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
