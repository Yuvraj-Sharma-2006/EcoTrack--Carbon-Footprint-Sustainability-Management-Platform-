require("dotenv").config();

const sendVerificationMail = async (email, code) => {
  try {
    const scriptUrl = process.env.APPS_SCRIPT_URL;
    const secret = process.env.APPS_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      throw new Error("Email service environment variables are missing");
    }

    const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
       },
       body: JSON.stringify({
          secret,
          email,
          code: String(code)
       }),
     signal: AbortSignal.timeout(30000)
    });

    // Pehle JSON parse mat karo
   const responseText = await response.text();

    // Ab check karo ki response JSON hai ya nahi
   let result;

   try {
    result = JSON.parse(responseText);
   } catch (err) {
    throw new Error(
    "Apps Script returned non-JSON response: " +
      responseText.slice(0, 300)
    );
   }

    if (!response.ok || !result.success) {
     throw new Error(result.message || "Email service failed");
    }

    return result;
  } catch (error) {
    console.error("Verification email failed:", error.message);
    throw error;
  }
};

module.exports = sendVerificationMail;
