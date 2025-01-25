import { GoogleLogout } from "react-google-login";


const clientId = import.meta.env.VITE_CLIENT_ID;

const Logout = () => {

  const onSuccess = () => {
    console.log("LOGOUT SUCCESS! ");
  }

  return (
    <GoogleLogout
      clientId={clientId}
      buttonText="Logout"
      onLogoutSuccess={onSuccess}
    />
  )
}

export default Logout;