const chatBoxForm = document.getElementById("chatBoxForm");
const token = localStorage.getItem("token");

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const {
      data: { success, allChats, currentUserId },
    } = await axios.get("http://localhost:3000/api/chatbox", {
      headers: {
        Authorization: token,
      },
    });
    if (!success) return alert("Something went wrong!");

    if (allChats.length <= 0) {
      const chatBoxMessages = document.getElementById("chatBoxMessages");
      const chatText = document.createElement("p");
      chatText.className = "joined";
      chatText.innerHTML = `<strong>You</strong> joined the chat`;
      chatBoxMessages.appendChild(chatText);
    } else {
      allChats.forEach((chat) => {
        showChatOnScreen(chat, currentUserId);
      });
      const chatText = document.createElement("p");
      chatText.className = "joined";
      chatText.innerHTML = `<strong>You</strong> joined the chat`;
      chatBoxMessages.appendChild(chatText);
    }
  } catch (error) {
    window.location.replace("../login/login.html");
    console.log(error);
  }
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

setInterval(async () => {
  try {
    const {
      data: { success, allChats, currentUserId },
    } = await axios.get("http://localhost:3000/api/chatbox", {
      headers: {
        Authorization: token,
      },
    });
    if (!success) return alert("Something went wrong!");

    if (allChats.length <= 0) {
      const chatText = document.createElement("p");
      chatText.className = "joined";
      chatText.innerHTML = `<strong>You</strong> joined the chat`;
      chatBoxMessage.appendChild(chatText);
    } else {
      const chatBoxDiv = document.getElementById("chatBoxDiv");
      const chatBoxMessages = document.getElementById("chatBoxMessages");
      chatBoxMessages.remove();

      const chatBoxMessage = document.createElement("div");
      chatBoxMessage.setAttribute("id", "chatBoxMessages");
      chatBoxDiv.appendChild(chatBoxMessage);
      allChats.forEach((chat) => {
        showChatOnScreen(chat, currentUserId);
      });
    }
  } catch (error) {
    window.location.replace("../login/login.html");
    console.log(error);
  }
}, 1000);
