import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import {CardElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {PaymentElement} from '@stripe/react-stripe-js';

const INIT_ERROR = {
  invoiceId: "",
  orderId: "",
  customerId: "",
  paymentDate: "",
  methodId: "",
  amount: "",
  notes: "",
  transactionId: "",
};

const FormCreatePaymentStripe = (props: any) => {
  const {
    openModal,
    setOpenModal,
    checkOutToken
  } = props;
  const stripePromise = loadStripe('pk_test_51NGuuDExHzsfvFYJdtigMrA7UempNYVB6lCo2omAHvKSOWdiHeGwoRN3bK0Pabi3I6d8q64CLV5P4ROVLC7g0yoZ00f4IuBNpA');
  const optionStripe = {
    clientSecret: checkOutToken,
  };

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = async (event: any) => {
      event.preventDefault();
      if (!stripe || !elements) {
        return;
      }
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: process.env.NEXT_PUBLIC_CLIENT_ADDRESS + '/payment-success'  ?? "https://api.stripe",
        },
      });
    };
    return (
      <form onSubmit={handleSubmit}>
        <PaymentElement/>
        <button type="submit" disabled={!stripe}>Submit</button>
      </form>
    );
  };

  return (
    <><Dialog
    open={openModal}
    // onClose={handleCloseEditModal}
    scroll="body"
    aria-labelledby="scroll-dialog-title"
    aria-describedby="scroll-dialog-description"
    maxWidth="lg"
    fullWidth={true}
  >
    <DialogTitle
      id="scroll-dialog-title"
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6">Input your card Info</Typography>
      <Button onClick={() => {}}>
        <Close />
      </Button>
    </DialogTitle>
    <Divider />
    <DialogContent>
      <Elements stripe={stripePromise} options={optionStripe}>
        <CheckoutForm />
      </Elements>
    </DialogContent>
  </Dialog></>
  )
}

export default (FormCreatePaymentStripe)
