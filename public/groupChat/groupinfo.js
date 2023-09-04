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

    if (group.groupAdminId === currentUserId) {
      const headerDiv = document.getElementById("headerDiv");

      const deleteGroupBtn = document.createElement("button");
      deleteGroupBtn.className = "btn btn-danger ms-auto w-auto";
      deleteGroupBtn.innerHTML = "Delete Group";

      headerDiv.appendChild(deleteGroupBtn);

      // Delete Group
      deleteGroupBtn.addEventListener("click", async () => {
        const result = confirm("Are You Sure?");
        if (result) {
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
            return;
          }
        }
      });
    }

    let isThisMemberGroupAdmin = false;
    group.users.forEach((member) => {
      if (
        parseInt(currentUserId) === member.id &&
        member.groupUser.isGroupAdmin
      ) {
        isThisMemberGroupAdmin = true;
      }
    });

    // Show Group Members
    group.users.forEach((member) => {
      if (isThisMemberGroupAdmin) {
        const groupMember = document.createElement("li");
        groupMember.className =
          "list-group-item list-group-item-warning d-flex justify-content-between align-items-center";

        groupMember.innerHTML = `<span><span class='fw-bold'><i class='fa-solid fa-user-tie me-1'></i></span> ${member.fullName}</span>`;

        if (
          member.groupUser.isGroupAdmin &&
          member.id === parseInt(group.groupAdminId)
        ) {
          const admin = document.createElement("span");
          admin.className = "text-secondary";
          admin.textContent = "Main Admin";
          groupMember.appendChild(admin);
        } else {
          const makeAdminBtn = document.createElement("button");
          if (!member.groupUser.isGroupAdmin) {
            makeAdminBtn.className =
              "btn btn-primary btn-sm ms-auto me-2 text-uppercase";
            makeAdminBtn.innerHTML = `Make Admin`;

            groupMember.appendChild(makeAdminBtn);
          } else {
            const removeAdminBtn = document.createElement("button");
            removeAdminBtn.className =
              "btn btn-outline-danger btn-sm ms-auto me-2 text-uppercase";
            removeAdminBtn.innerHTML = `Remove Admin`;

            groupMember.appendChild(removeAdminBtn);

            removeAdminBtn.addEventListener("click", async () => {
              removeAdminBtn.textContent = "REMOVED";
              removeAdminBtn.disabled = true;

              try {
                const { data } = await axios.put(
                  `http://localhost:3000/api/group/${group.id}/${member.id}`,
                  { isGroupAdmin: false },
                  {
                    headers: {
                      Authorization: token,
                    },
                  }
                );
                if (!data.success) return alert("something went wrong!");
                alert(
                  "New admin asigned to this group! reload to see the changes"
                );
              } catch (error) {
                console.log(error);
                return;
              }
            });
          }

          const deleteBtn = document.createElement("button");
          deleteBtn.className = "btn btn-danger btn-sm";
          deleteBtn.innerHTML = `<i class='fa fa-x'></i>`;

          groupMember.appendChild(deleteBtn);

          makeAdminBtn.addEventListener("click", async () => {
            makeAdminBtn.textContent = "DONE";
            makeAdminBtn.disabled = true;

            try {
              const { data } = await axios.put(
                `http://localhost:3000/api/group/${group.id}/${member.id}`,
                { isGroupAdmin: true },
                {
                  headers: {
                    Authorization: token,
                  },
                }
              );
              if (!data.success) return alert("something went wrong!");
              alert(
                "New admin asigned to this group! reload to see the changes"
              );
            } catch (error) {
              console.log(error);
              return;
            }
          });

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
              return;
            }
          });
        }
        groupMemberList.appendChild(groupMember);
      } else {
        const groupMember = document.createElement("li");
        groupMember.className =
          "list-group-item list-group-item-warning d-flex justify-content-between align-items-center";

        groupMember.innerHTML = `<span><span class='fw-bold'><i class='fa-solid fa-user-tie me-1'></i></span> ${member.fullName}</span>`;

        if (member.id === Number.parseInt(group.groupAdminId)) {
          const admin = document.createElement("span");
          admin.className = "text-secondary";
          admin.textContent = "Main admin";
          groupMember.appendChild(admin);
        } else if (member.groupUser.isGroupAdmin) {
          const admin = document.createElement("span");
          admin.className = "text-secondary";
          admin.textContent = "admin";
          groupMember.appendChild(admin);
        }
        groupMemberList.appendChild(groupMember);
      }
    });

    if (isThisMemberGroupAdmin) {
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

          selectMemberBtn.textContent = "ADD MEMBER";

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
    }
  } catch (error) {
    console.log(error);
  }
});
