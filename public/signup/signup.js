const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fullNameEle = document.getElementById("fullName");
  const emailEle = document.getElementById("email");
  const phoneEle = document.getElementById("phone");
  const passwordEle = document.getElementById("password");

  const userObj = {
    fullName: fullNameEle.value,
    email: emailEle.value,
    phone: phoneEle.value,
    password: passwordEle.value,
  };

  try {
    const {
      data: { token, createdUser },
    } = await axios.post("http://13.48.147.235:3000/api/users/signup", userObj);

    localStorage.setItem("token", token);

    alert(`Hello ${createdUser.fullName}!`);

    fullNameEle.value = "";
    emailEle.value = "";
    phoneEle.value = "";
    passwordEle.value = "";

    window.location.href = "../login/login.html";
  } catch (error) {
    const {
      response: {
        data: { message },
      },
    } = error;
    alert(message);
    console.log(error);
  }
});
