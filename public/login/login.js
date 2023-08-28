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
    } = await axios.post("http://localhost:3000/api/users/login", userObj);

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

const forgotPassword = document.getElementById("forgotPassword");
