
const REGISTRATION_ENABLED = false;

const TURNSTILE_SITE_KEY = "0x4AAAAAAGTKuv7gDn_5aTIA";

const REGISTRATION_ENDPOINT =
  "https://fywijrfymmhctxfvawnv.supabase.co/functions/v1/venom-registration";

const panel = document.getElementById("registrationFormPanel");
const form = document.getElementById("venomRegistrationForm");
const title = document.getElementById("registrationFormTitle");
const ageGroup = document.getElementById("registrationAgeGroup");
const registrationType = document.getElementById("registrationType");
const message = document.getElementById("registrationMessage");
const submitButton = document.getElementById("submitRegistration");
const cancelButton = document.getElementById("cancelRegistration");

const registrationButtons = document.querySelectorAll(
  "[data-age-group][data-registration-type]"
);

let widgetId = null;
let securityToken = "";
let submitting = false;

function updateSubmitButton() {
  submitButton.disabled =
    !REGISTRATION_ENABLED ||
    !securityToken ||
    submitting;
}

function setMessage(text) {
  message.textContent = text;
}

function resetSecurity() {
  securityToken = "";
  updateSubmitButton();

  if (widgetId !== null && window.turnstile) {
    window.turnstile.reset(widgetId);
  }
}

function initializeTurnstile() {
  if (!window.turnstile) {
    setMessage(
      "Security verification is loading. Please try again."
    );
    return;
  }

  if (widgetId !== null) {
    resetSecurity();
    return;
  }

  widgetId = window.turnstile.render(
    "#registrationTurnstile",
    {
      sitekey: TURNSTILE_SITE_KEY,
      action: "venom_registration",
      theme: "dark",

      callback: function (token) {
        securityToken = token;
        setMessage("");
        updateSubmitButton();
      },

      "expired-callback": function () {
        securityToken = "";
        updateSubmitButton();
        setMessage("Security verification expired.");
      },

      "error-callback": function () {
        securityToken = "";
        updateSubmitButton();
        setMessage("Security verification failed. Please try again.");
      }
    }
  );
}

registrationButtons.forEach((button) => {

  button.disabled = !REGISTRATION_ENABLED;

  button.addEventListener("click", () => {

    if (!REGISTRATION_ENABLED || submitting) return;

    form.reset();

    ageGroup.value = button.dataset.ageGroup;
    registrationType.value = button.dataset.registrationType;

    const typeLabel =
      registrationType.value === "tryout"
        ? "TRYOUT"
        : "PICK-UP PLAYER";

    title.textContent =
      `${ageGroup.value} ${typeLabel} REGISTRATION`;

    panel.hidden = false;

    setMessage("");
    initializeTurnstile();

    panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});

cancelButton.addEventListener("click", () => {

  if (submitting) return;

  form.reset();
  resetSecurity();
  setMessage("");
  panel.hidden = true;

});

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

submitButton.addEventListener("click", async () => {

  if (!REGISTRATION_ENABLED || submitting) return;

  if (!form.reportValidity()) return;

  if (!securityToken) {
    setMessage("Please complete security verification.");
    return;
  }

  submitting = true;
  updateSubmitButton();
  cancelButton.disabled = true;

  registrationButtons.forEach((button) => {
    button.disabled = true;
  });

  setMessage("Submitting registration...");

  try {

    const data = Object.fromEntries(
      new FormData(form).entries()
    );

    data.guardian_consent =
      document.getElementById("guardianConsent").checked;

    data.turnstile_token = securityToken;

    const response = await fetch(
      REGISTRATION_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.json();

    if (!response.ok || result.success !== true) {
      setMessage(
        result.error || "Unable to submit registration."
      );
      return;
    }

    form.reset();

    setMessage(
      "Registration submitted successfully! " +
      "Thank you for your interest in St. Clair Venom."
    );

  } catch {

    setMessage(
      "Unable to confirm submission. " +
      "Please contact Venom before submitting again."
    );

  } finally {

    submitting = false;
    cancelButton.disabled = false;

    registrationButtons.forEach((button) => {
      button.disabled = !REGISTRATION_ENABLED;
    });

    resetSecurity();

  }

});

updateSubmitButton();
