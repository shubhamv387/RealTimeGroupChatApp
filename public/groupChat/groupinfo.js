const currentGroupId = localStorage.getItem("currentGroupId");
const currentGroupName = localStorage.getItem("currentGroupName");
const currentUserId = localStorage.getItem("currentUserId");
const token = localStorage.getItem("token");

// console.log(currentGroupId, currentGroupName);

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const {
      data: {
        success,
        group: { ...group },
      },
    } = await axios.get(`http://localhost:3000/api/group/${currentGroupId}`, {
      headers: {
        Authorization: token,
      },
    });

    // console.log(group);

    if (!success) return alert("Group Not Found!");

    document.getElementById("groupName").textContent = group.groupName;

    const groupMemberList = document.getElementById("groupMemberList");

    if (group.groupAdminId == currentUserId) {
      const headerDiv = document.getElementById("headerDiv");

      const deleteGroupBtn = document.createElement("button");
      deleteGroupBtn.className = "btn btn-danger ms-auto w-auto";
      deleteGroupBtn.innerHTML = "Delete Group";

      headerDiv.appendChild(deleteGroupBtn);

      // Delete Group
      deleteGroupBtn.addEventListener("click", async () => {
        try {
          const { data } = await axios.delete(
            `http://localhost:3000/api/group/${currentGroupId}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );

          if (!data.success) return alert("Somthing went wrong!");
          alert("Group Deleted Successfully!");
          window.location.replace("./groupchat.html");
        } catch (error) {
          console.log(error);
        }
      });

      // Show Group Members

      group.users.forEach((member) => {
        const groupMember = document.createElement("li");
        groupMember.className =
          "list-group-item list-group-item-warning d-flex justify-content-between align-items-center";

        groupMember.innerHTML = `<span><span class='fw-bold'><i class='fa-solid fa-user-tie me-1'></i></span> ${member.fullName}</span>`;

        if (member.id === Number.parseInt(group.groupAdminId)) {
          const admin = document.createElement("span");
          admin.className = "text-secondary";
          admin.textContent = "admin";
          groupMember.appendChild(admin);
        } else {
          const deleteBtn = document.createElement("button");
          deleteBtn.className = "btn btn-danger btn-sm";
          deleteBtn.innerHTML = `DELETE`;

          groupMember.appendChild(deleteBtn);

          deleteBtn.addEventListener("click", async () => {
            try {
              const { data } = await axios.delete(
                `http://localhost:3000/api/group/${currentGroupId}/${member.id}`,
                {
                  headers: {
                    Authorization: token,
                  },
                }
              );
              if (!data.success) return alert("somthing went wrong!");
              groupMemberList.removeChild(groupMember);
            } catch (error) {
              console.log(error);
            }
          });
        }
        groupMemberList.appendChild(groupMember);
      });

      const {
        data: { success, users },
      } = await axios.get(
        `http://localhost:3000/api/group/all-users/${currentGroupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!success) return alert("something went wrong!!!!!!!!!!!!!!!!");

      if (users.length > 0) {
        users.forEach((user) => {
          const addMember = document.createElement("li");
          addMember.className =
            "list-group-item list-group-item-warning d-flex justify-content-between align-items-center";
          addMember.innerHTML = `<span><span class='fw-bold'><i class='fa-solid fa-user-tie me-1'></i></span> ${user.fullName}</span>`;

          const selectMemberBtn = document.createElement("button");
          selectMemberBtn.className = "btn btn-success btn-sm";

          selectMemberBtn.textContent = "ADD";

          addMember.appendChild(selectMemberBtn);

          selectMemberBtn.addEventListener("click", async () => {
            try {
              const { data } = await axios.post(
                "http://localhost:3000/api/group/add-users",
                { groupId: currentGroupId, userIds: [user.id] },
                {
                  headers: {
                    Authorization: token,
                  },
                }
              );

              if (!data.success) return alert("something went wrong!");

              selectMemberBtn.textContent = "ADDED";
              selectMemberBtn.disabled = true;
              alert(
                "Users added to the group successfully! Reload to see the changes!"
              );
            } catch (error) {
              console.log(error);
            }
          });

          groupMemberList.appendChild(addMember);
        });
      }
    } else {
      group.users.forEach((member) => {
        const groupMember = document.createElement("li");
        groupMember.className =
          "list-group-item list-group-item-warning d-flex justify-content-between align-items-center";

        groupMember.innerHTML = `<span><span class='fw-bold'><i class='fa-solid fa-user-tie me-1'></i></span> ${member.fullName}</span>`;

        if (member.id === Number.parseInt(group.groupAdminId)) {
          const admin = document.createElement("span");
          admin.className = "text-secondary";
          admin.textContent = "admin";
          groupMember.appendChild(admin);
        }
        groupMemberList.appendChild(groupMember);
      });
    }
  } catch (error) {
    console.log(error);
  }
});
