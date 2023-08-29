const chatBoxForm = document.getElementById("chatBoxForm");
const token = localStorage.getItem("token");

chatBoxForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const chatTextEle = document.getElementById("chatText");

  try {
    const chatText = chatTextEle.value.trim();

    if (!chatText) {
      chatTextEle.value = "";
      return alert("speces only, are not allowed");
    }

    const response = await axios.post(
      "http://localhost:3000/api/chatbox/chat",
      { chatText },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      console.log(response.data);
      chatTextEle.value = "";
    }
  } catch (error) {
    console.log(error);
  }
});
