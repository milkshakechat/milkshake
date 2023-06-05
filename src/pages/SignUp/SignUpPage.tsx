import { useCallback, useState } from "react";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import config from "@/config.env";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [displayStatus, setDisplayStatus] = useState<"signup" | "check_verify">(
    "signup"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth();

  const signup = useCallback(() => {
    console.log("Signup!");
    setSubmitted(true);
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      // ?email= is unsafe, it can lead to session hijacking. [docs](https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0&_gl=1*1ilz4ci*_ga*MzQxODYyOTgzLjE2ODU1Mjk0Mzk.*_ga_CW55HF8NVT*MTY4NTkxNjMzNC45LjEuMTY4NTkxNjQ1Ni4wLjAuMA..#security_concerns)
      url: `${config.VERIFY_EMAIL_DOMAIN}/app/signup/verify?email=`,
      // This must be true.
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        setDisplayStatus("check_verify");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message);
        setSubmitted(false);
      });
  }, [email]);

  return (
    <div>
      <h1>Sign Up Page</h1>
      <br />

      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitted}
      ></input>
      <button onClick={() => signup()} disabled={submitted}>
        Sign Up
      </button>
      <br />
      <span style={{ color: "red" }}>{errorMessage}</span>

      <br />
      {displayStatus === "check_verify" && (
        <span>Check your email to verify</span>
      )}
    </div>
  );
};

export default SignUpPage;
