const chatBoxForm = document.getElementById("chatBoxForm");
const token = localStorage.getItem("token");
let groupId = localStorage.getItem("groupId");
let locallySavedChats = [];

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const { newSuccess, message } = await findAllGroupsOfThisUser();

    if (!newSuccess) return alert(message);

    const {
      data: {
        success,
        allChats,
        currentUserId,
        currentUserFullName,
        GroupWithThisId,
      },
    } = await axios.get(`http://localhost:3000/api/chatbox/${groupId}`, {
      headers: {
        Authorization: token,
      },
    });
    if (!success) return alert("Something went wrong!");

    document.getElementById("welcomeText").innerHTML = `Hello, ${
      currentUserFullName.split(" ")[0]
    }!`;

    localStorage.setItem("currentUserId", currentUserId);

    // setting the group name and group info btn
    document.getElementById("currentGroupName").textContent =
      GroupWithThisId.groupName;
    document
      .getElementById("currentGroupInfo")
      .addEventListener("click", () => {
        localStorage.setItem("currentGroupId", GroupWithThisId.id);
        window.location.href = "./groupinfo.html";
      });

    // getting all chats from this group
    if (allChats.length <= 0) {
      const welcomeMessageOnce = document.createElement("p");
      welcomeMessageOnce.className = "joined";
      welcomeMessageOnce.innerHTML = `Welcome to this <strong>Group Chat App</strong>`;
      chatBoxMessages.appendChild(welcomeMessageOnce);
    } else {
      const welcomeMessageOnce = document.createElement("p");
      welcomeMessageOnce.className = "joined";
      welcomeMessageOnce.innerHTML = `Welcome to this <strong>Group Chat App</strong>`;
      chatBoxMessages.appendChild(welcomeMessageOnce);

      for (let i = allChats.length - 1; i >= 0; i--) {
        showChatOnScreen(allChats[i], currentUserId);
        locallySavedChats.push(allChats[i]);
      }

      localStorage.setItem(
        "locallySavedChats",
        JSON.stringify(locallySavedChats)
      );
    }
  } catch (error) {
    if (error.response) {
      console.log(error);
      return alert(error.response.data.message);
    }
    alert("Something went wrong!");
    console.log(error);
    window.location.replace("../login/login.html");
  }
});

async function findAllGroupsOfThisUser() {
  try {
    const {
      data: { success, groups, currentUserId },
    } = await axios("http://localhost:3000/api/group", {
      headers: {
        Authorization: token,
      },
    });
    if (!success) return alert("something went wrong in finding groups!");

    localStorage.setItem("currentUserId", currentUserId);

    const groupList = document.getElementById("groupList");

    if (groups.length <= 0)
      return {
        newSuccess: false,
        message: "you are not a member in any groups, Create one!",
      };

    groups.forEach((group) => {
      const groupListItem = document.createElement("li");
      groupListItem.innerHTML = `<a class="dropdown-item" href='#' 
        onclick='switchGroup(${group.id})'>
        ${group.groupName}
      </a>`;

      if (group.groupAdminId == currentUserId) {
        groupListItem.innerHTML = `<a class="dropdown-item d-flex justify-content-between" href='#' 
        onclick='switchGroup(${group.id})'>
        ${group.groupName}
        <span class="text-secondary ms-2">admin</span></a>`;
      }

      groupList.appendChild(groupListItem);
    });

    return { newSuccess: true };
  } catch (error) {
    console.log(error);
  }
}

function switchGroup(groupId) {
  localStorage.setItem("groupId", groupId);
  window.location.reload();
}

// setInterval(reloadMessages, 1000); // do not delete this line
async function reloadMessages() {
  try {
    // const chatBoxDiv = document.getElementById("chatBoxDiv");
    // const chatBoxMessages = document.getElementById("chatBoxMessages");
    // chatBoxMessages.remove();

    // const chatBoxMessage = document.createElement("div");
    // chatBoxMessage.setAttribute("id", "chatBoxMessages");
    // chatBoxDiv.appendChild(chatBoxMessage);

    locallySavedChats = JSON.parse(localStorage.getItem("locallySavedChats"));
    // const currUserId = JSON.parse(localStorage.getItem("currentUserId"));

    let lastChatId = 0;
    if (locallySavedChats[locallySavedChats.length - 1])
      lastChatId = locallySavedChats[locallySavedChats.length - 1].id;

    const {
      data: { success, allChats, currentUserId, currentUserFullName },
    } = await axios.get(
      `http://localhost:3000/api/chatbox/${lastChatId}/${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    document.getElementById("welcomeText").innerHTML = `Hello, ${
      currentUserFullName.split(" ")[0]
    }!`;

    if (!success) return alert("Something went wrong!");

    localStorage.setItem("currentUserId", currentUserId);
    if (allChats.length > 0) {
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

      // const chatterName = document.createElement("p");
      // chatterName.className = "joined";
      // chatterName.innerHTML = `<strong>You</strong> joined the chat`;
      // chatBoxMessages.appendChild(chatterName);
    }
  } catch (error) {
    alert("Something went wrong!");
    console.log(error);
    window.location.replace("../login/login.html");
  }
}

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
      `http://localhost:3000/api/chatbox/chat/${groupId}`,
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
    } else alert("something went wrong!");
  } catch (error) {
    if (error.response) alert(error.response.data.message);
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
  chatText.scrollIntoView();
}

const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUserId");
  // localStorage.removeItem("listOfExpenseToShow");
  window.location.replace("../login/login.html");
});

/* GROUP CHAT FUNCTIONS */

const newGroupForm = document.getElementById("newGroupForm");

newGroupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const groupNameEle = document.getElementById("groupName");

  try {
    const groupName = groupNameEle.value.trim();

    if (!groupName) {
      groupNameEle.value = "";
      return alert("speces only, are not allowed");
    }
    const {
      data: { success, createdGroup },
    } = await axios.post(
      "http://localhost:3000/api/group/create-group",
      { groupName: groupNameEle.value },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (!success) return alert("something went wrong!");

    groupNameEle.value = "";
    localStorage.setItem("groupId", createdGroup.id);
    groupId = createdGroup.id;

    const groupList = document.getElementById("groupList");
    const groupListItem = document.createElement("li");

    groupListItem.innerHTML = `<a class="dropdown-item d-flex justify-content-between" href='#' 
        onclick='switchGroup(${createdGroup.id})'>
        ${createdGroup.groupName}
        <span class="text-secondary ms-2">admin</span>
      </a>`;

    groupList.appendChild(groupListItem);

    alert("New Group created Successfully!");

    const { data } = await axios.get("http://localhost:3000/api/users", {
      headers: {
        Authorization: token,
      },
    });

    if (!data.success) return alert("something went wrong!");

    const { allUsers } = data;

    const addMembersToGroupDiv = document.getElementById(
      "addMembersToGroupDiv"
    );

    const allMembersArray = [];
    const currentUserId = JSON.parse(localStorage.getItem("currentUserId"));

    const addMemberList = document.createElement("ul");
    addMemberList.className = "list-group list-unstyled";
    addMemberList.style.maxHeight = "75vh";
    addMemberList.style.overflowY = "auto";

    allUsers.forEach((user) => {
      const addMember = document.createElement("li");
      addMember.className =
        "list-group-item list-group-item-warning d-flex justify-content-between align-items-center";
      addMember.innerHTML = user.id === currentUserId ? "You" : user.fullName;

      const selectMemberBtn = document.createElement("button");
      selectMemberBtn.className = "btn btn-success";

      if (user.id === currentUserId) {
        selectMemberBtn.textContent = "Selected";
        selectMemberBtn.disabled = true;
      } else selectMemberBtn.textContent = "Select";

      addMember.appendChild(selectMemberBtn);

      selectMemberBtn.addEventListener("click", () => {
        selectMemberBtn.textContent = "Selected";
        selectMemberBtn.disabled = true;
        allMembersArray.push(user.id);
      });
      addMemberList.appendChild(addMember);
    });

    addMembersToGroupDiv.appendChild(addMemberList);

    const addSelectedMemberBtn = document.createElement("button");
    addSelectedMemberBtn.className = "btn btn-dark m-2";
    addSelectedMemberBtn.textContent = "Add Selected Members";

    addMembersToGroupDiv.appendChild(addSelectedMemberBtn);

    addSelectedMemberBtn.addEventListener("click", async () => {
      if (allMembersArray.length <= 0) return alert("select atleat one menber");

      try {
        const { data } = await axios.post(
          "http://localhost:3000/api/group/add-users",
          { groupId: createdGroup.id, userIds: allMembersArray },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        addMembersToGroupDiv.style.display = "none";
        alert(data.message);

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    });

    document.getElementById("newGroupFormDiv").style.display = "none";
    addMembersToGroupDiv.style.display = "block";
  } catch (error) {
    console.log(error);
  }
});
