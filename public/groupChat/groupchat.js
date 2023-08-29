const chatBoxForm = document.getElementById("chatBoxForm");
const token = localStorage.getItem("token");

chatBoxForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const chatTextEle = document.getElementById("chatText");

  const response = await axios.post(
    "http://localhost:3000/api/chatbox/chat",
    { chatText: chatTextEle.value },
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
});
