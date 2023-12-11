import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

function VerifyUserPage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // const history = useHistory();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [userEmail, setUserEmail] = useState("");

  const handleVerification = async () => {
    try {
      const token = searchParams.get("token"); // Get the verification token from the URL params
      // window.alert(token);
      // alert(token);
      const response = await api.post("/auth/verify-account", {
        token: token,
      });

      const data = await response.data;

      if (response.status === 200) {
        toast.success("Your Account is Verified");
        setVerificationStatus("verified");
        navigate("/");
        // Optionally, redirect the user to a success page or login page
        // history.push('/'); // Redirect to login after successful verification
      } else {
        toast.error("Error: ", data.message);
        setVerificationStatus("failed");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error: ", error);
      console.error("Error verifying account:", error);
      setVerificationStatus("failed");
    }
  };

  // Function to resend verification email
  const handleResendVerification = async () => {
    try {
      const response = await api.post("/auth/resend-verify-account", {
        email: userEmail,
      });

      if (response.status === 200) {
        // Handle successful resend (optional)
        // For example, show a success message or notification
      } else {
        // Handle failure to resend (optional)
        // For example, display an error message to the user
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      // Handle error (optional)
    }
  };

  // useEffect(() => {
  //   // Automatically verify account on page load (optional)
  //   handleVerification();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // Empty dependency array ensures the effect runs once

  let message;
  switch (verificationStatus) {
    case "verifying":
      message = "Verify Your Account!";
      break;
    case "verified":
      message = "Account verified successfully!";
      break;
    case "failed":
      message =
        "Failed to verify your account. Please try again or contact support.";
      break;
    default:
      message = "verify your account";
  }

  return (
    <div>
      <h2>Account Verification</h2>
      {/* <p>{message}</p> */}
      {verificationStatus !== "verified" && ( // Display button only if not verified
        <button onClick={handleVerification}>{message}</button>
      )}
      <input
        type="email"
        placeholder="Enter your email to resend the verification"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      />
      <button onClick={handleResendVerification}>ResendVerification</button>
    </div>
  );
}

export default VerifyUserPage;
