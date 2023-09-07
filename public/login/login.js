const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const emailEle = document.getElementById("email");
  const passwordEle = document.getElementById("password");

  const userObj = {
    email: emailEle.value,
    password: passwordEle.value,
  };

  try {
    const {
      data: { success, message, token },
    } = await axios.post("http://13.48.147.235/api/users/login", userObj);

    if (!success) {
      alert(message);
      return;
    }

    localStorage.setItem("token", token);

    emailEle.value = "";
    passwordEle.value = "";

    window.location.href = "../groupchat/groupchat.html";
  } catch (error) {
    console.log(error);
    const {
      response: {
        data: { message },
      },
    } = error;
    alert(message);
  }
});

const mainDiv = document.getElementById("mainDiv");
const forgotPassword = document.getElementById("forgotPassword");

forgotPassword.addEventListener("click", () => {
  document.title = "Password reset request";
  document.getElementById("loginDiv").style.display = "none";

  const forgotPassDiv = document.createElement("div");
  forgotPassDiv.innerHTML = `<div class="mt-5">
  <h1 class="fs-4">Request New Password!</h1>
  <p class="text-secondary">
    Get a password reset link on your registered email.
  </p>
</div>
<!-- FORGOT PASS FORM START -->
<div class="d-flex flex-row">
  <form id="forgotPassForm" class="w-100 mt-3">
    <div class="mb-3">
      <label for="email" class="form-label fs-5"
        >Email address:</label
      >
      <div class="position-relative">
        <input
          required
          type="email"
          class="form-control ps-5 form-control-lg"
          id="emailForResetPass"
        />
        <i
          class="fa fa-envelope position-absolute top-50 fs-4"
          style="transform: translateY(-50%); left: 15px"
        ></i>
      </div>
    </div>

    <button
      onclick="getResetPasswordEmail"
      type="submit"
      class="btn text-white px-5 fs-5"
      style="
        border-radius: 50px;
        background: linear-gradient(
          90deg,
          rgba(244, 11, 11, 0.8),
          rgba(0, 0, 0, 0.8) 87.19%
        );
      "
    >
      Request
    </button>
  </form>
  <div class="w-25 d-none d-lg-block"></div>
</div>
<!-- FORGOT PASS FORM END -->
<div class="heading mt-3">
  <p class="fs-5 fw-bold">
    Return to
    <a
      style="
        -webkit-text-fill-color: transparent;
        background: linear-gradient(
          90deg,
          rgba(244, 11, 11, 0.8),
          rgba(0, 0, 0, 0.8) 87.19%
        );
        background-clip: text;
        -webkit-background-clip: text;
      "
      href="../login/login.html"
      >Login.</a
    >
  </p>
</div>`;
  mainDiv.appendChild(forgotPassDiv);
  const forgotPassForm = document.getElementById("forgotPassForm");
  forgotPassForm.addEventListener("submit", getResetPasswordEmail);
});

async function getResetPasswordEmail(e) {
  e.preventDefault();

  const emailForResetPass = document.getElementById("emailForResetPass");

  try {
    const {
      data: { success },
    } = await axios.post("http://13.48.147.235/password/forgotpassword", {
      email: emailForResetPass.value,
    });

    if (!success) return alert("something went wrong");

    emailForResetPass.value = "";
    alert("An email has been sent to your mailbox.");
  } catch (error) {
    emailForResetPass.value = "";
    alert(error.response.data.message);
  }
}
