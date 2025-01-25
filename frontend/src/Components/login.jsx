import { GoogleLogin } from "react-google-login";

const clientId = import.meta.env.VITE_CLIENT_ID;

function Login() {
  const onSuccess = (res) => {
    console.log("LOGIN SUCCESS! Current User:", res.profileObj);
  };

  const onFailure = (res) => {
    console.log("LOGIN FAILED! res:", res);
  }

  <div id="signInButton">
    <GoogleLogin
      clientId={clientId}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy="single_host_origin"
      isSignedIn={true}
    />
  </div>;
}

export default Login;