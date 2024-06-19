import { useRouter } from "next/router";

const PaymentSuccess  = ()  => {
  const router = useRouter()

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '500px',
    backgroundColor: '#f8f9fa',
    color: '#343a40',
    textAlign: 'center',
    width: "30%",
    margin: "7% auto",
    boxShadow: "5px 10px #ccc",
    borderRadius: "5px"
  };

  const iconStyle = {
    fontSize: '4rem',
    color: '#28a745',
    padding: "20px 40px",
    border: "5px solid #28a745",
    borderRadius: "50%"
  };

  const messageStyle = {
    fontSize: '1.5rem',
    margin: '20px 0',
  };

  const message2Style = {
    padding: "10px",
    marginBottom: "10px"
  }

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>✓</div>
      <div style={messageStyle}>Payment Successful!</div>
      <div style={message2Style}>Our staff will update and send information to you in a few minutes</div>
      <button style={buttonStyle} onClick={() => router.push("/")}>
        Go to our website
      </button>
    </div>
  );
};

export default (PaymentSuccess);
