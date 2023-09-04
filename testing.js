const currentUserId = 1;
const group = {
  id: 1,
  groupName: "Shubhamv387 Group 1",
  groupAdminId: "1",
  users: [
    {
      id: 1,
      fullName: "Shubham Kumar Vishwakarma",
      groupUser: {
        id: 1,
        isGroupAdmin: true,
        userId: 1,
        groupId: 1,
      },
    },
    {
      id: 2,
      fullName: "Shubham Vishwakarma",
      groupUser: {
        id: 5,
        isGroupAdmin: false,
        userId: 2,
        groupId: 1,
      },
    },
  ],
};

group.users.forEach((member) => {
  console.log(currentUserId, member.id, member.groupUser.isGroupAdmin);
  if (currentUserId == member.id && member.groupUser.isGroupAdmin)
    console.log("object");
});
