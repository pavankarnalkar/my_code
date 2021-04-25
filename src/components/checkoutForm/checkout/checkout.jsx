import React, { useState, useEffect } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  CssBaseline,
  Button,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
// import classes from '*.module.css'
import useStyles from "./styles";
import AddressForm from "../addressForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib/commerce";
const steps = ["Shipping Address", "Payment Details"];
const Checkout = ({ cart, order, handleCaptureCheckout, error }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setcheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const history = useHistory();
  const [isFinished, setIsFinished] = useState(false);
  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: "cart",
        });
        console.log(token, "token");
        setcheckoutToken(token);
      } catch (error) {
        console.log(error);
      }
    };

    generateToken();
  }, [cart]);

  const next = (data) => {
    console.log(data, "formData");
    setShippingData(data);
    nextStep();
  };

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const timeOut = () => {
    setTimeout(() => {
      setIsFinished(true);
      console.log(isFinished, "isFinished");
    }, 3000);
  };
  let Confirmation = () =>
    order.customer ? (
      <>
        <div>
          <Typography variant="h5">
            Thank you for your purchase,{order.customer.firstName}{" "}
            {order.customer.lastName}
          </Typography>
          <Divider className={classes.divider} />
          <Typography variant="subtitle2">
            Order ref: {order.customer_reference}
          </Typography>
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">
          Back To Home
        </Button>
      </>
    ) : isFinished ? (
      <>
        <div>
          <Typography variant="h5">Thank you for your purchase</Typography>
          <Divider className={classes.divider} />
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">
          Back To Home
        </Button>
      </>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );
  if (error) {
    <>
      <Typography variant="h5">Error:{error}</Typography>
      <br />
      <Button component={Link} to="/" variant="outlined" type="button">
        Back To Home
      </Button>
    </>;
  }
  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        onCaptureCheckout={handleCaptureCheckout}
        nextStep={nextStep}
        backStep={backStep}
        timeOut={timeOut}
      />
    );

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.steps}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
