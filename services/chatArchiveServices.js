const cron = require("cron");
const Chat = require("../model/Chat");
const ChatArchive = require("../model/ChatArchive");

exports.archiveCron = new cron.CronJob(
  "0 3 * * * *",
  async () => {
    try {
      console.log("running");
      const chatsToArchive = await Chat.findAll();

      await ChatArchive.bulkCreate(chatsToArchive.map((chat) => chat.toJSON()));

      // Delete archived chats from the Chat table
      await Chat.destroy();

      console.log("Chats archived successfully.");
    } catch (error) {
      console.error("Error archiving chats:", error);
    }
  },
  "Asia/Kolkata"
);
