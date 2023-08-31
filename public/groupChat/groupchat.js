const chatBoxForm = document.getElementById("chatBoxForm");
const token = localStorage.getItem("token");
let locallySavedChats = [];

window.addEventListener("DOMContentLoaded", async () => {
  setInterval(async () => {
    try {
      const chatBoxDiv = document.getElementById("chatBoxDiv");
      const chatBoxMessages = document.getElementById("chatBoxMessages");
      chatBoxMessages.remove();

      const chatBoxMessage = document.createElement("div");
      chatBoxMessage.setAttribute("id", "chatBoxMessages");
      chatBoxDiv.appendChild(chatBoxMessage);

      locallySavedChats = JSON.parse(localStorage.getItem("locallySavedChats"));
      const currUserId = JSON.parse(localStorage.getItem("currentUserId"));

      if (!locallySavedChats) locallySavedChats = [];
      else
        locallySavedChats.forEach((chat) => {
          showChatOnScreen(chat, currUserId);
        });
      let lastChatId = 0;
      if (locallySavedChats[locallySavedChats.length - 1])
        lastChatId = locallySavedChats[locallySavedChats.length - 1].id;

      const {
        data: { success, allChats, currentUserId },
      } = await axios.get(`http://localhost:3000/api/chatbox/${lastChatId}`, {
        headers: {
          Authorization: token,
        },
      });
      if (!success) return alert("Something went wrong!");

      localStorage.setItem("currentUserId", currentUserId);
      if (allChats.length <= 0) {
        // const chatBoxMessages = document.getElementById("chatBoxMessages");
        // const chatText = document.createElement("p");
        // chatText.className = "joined";
        // chatText.innerHTML = `<strong>You</strong> joined the chat`;
        // chatBoxMessages.appendChild(chatText);
      } else {
        for (let i = allChats.length - 1; i >= 0; i--) {
          showChatOnScreen(allChats[i], currentUserId);
          if (locallySavedChats.length >= 20) {
            locallySavedChats.shift();
            locallySavedChats.push(allChats[i]);
          } else locallySavedChats.push(allChats[i]);
        }

        localStorage.setItem(
          "locallySavedChats",
          JSON.stringify(locallySavedChats)
        );

        const chatterName = document.createElement("p");
        chatterName.className = "joined";
        chatterName.innerHTML = `<strong>You</strong> joined the chat`;
        chatBoxMessages.appendChild(chatterName);
      }
    } catch (error) {
      alert("Something went wrong!");
      console.log(error);
      window.location.replace("../login/login.html");
    }
  }, 1000);
});

chatBoxForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const chatTextEle = document.getElementById("chatText");
  try {
    const chatText = chatTextEle.value.trim();

    if (!chatText) {
      chatTextEle.value = "";
      return alert("speces only, are not allowed");
    }

    const {
      data: { success, createdChat, currentUserId },
    } = await axios.post(
      "http://localhost:3000/api/chatbox/chat",
      { chatText },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (success) {
      showChatOnScreen(createdChat, currentUserId);
      if (locallySavedChats.length >= 20) {
        locallySavedChats.shift();
        locallySavedChats.push(createdChat);
      } else locallySavedChats.push(createdChat);
      localStorage.setItem(
        "locallySavedChats",
        JSON.stringify(locallySavedChats)
      );
      chatTextEle.value = "";
    }
  } catch (error) {
    console.log(error);
  }
});

function showChatOnScreen(chat, currentUserId) {
  const chatBoxMessages = document.getElementById("chatBoxMessages");
  const chatText = document.createElement("p");
  let chatterName;
  if (chat.userId === currentUserId) {
    chatterName = "You";
    chatText.className = "right";
  } else {
    chatterName = chat.user.fullName.split(" ")[0];
    chatText.className = "left";
  }
  chatText.innerHTML = `<strong>${chatterName} :</strong> ${chat.chat}`;
  chatBoxMessages.appendChild(chatText);
}
