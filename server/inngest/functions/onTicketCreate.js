import mongoose from "mongoose";
import { inngest } from "../client.js";
import Ticket from "../../models/ticket.model.js";
import User from "../../models/user.model.js";
import { NonRetriableError } from "inngest";
import mailSender from "../../utils/mailSender.utils.js";
import ticketAssignedEmail from "../../mail/templates/ticketAssignedEmail.js";
import { DATABASE_URI } from "../../configs/server.config.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 4 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      // 1️⃣ Ensure MongoDB connection
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(DATABASE_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Inngest function connected to MongoDB ✅");
      }

      const { ticketId } = event.data;

      console.log("Hi Hi Hi Hi Hi");

      // 2️⃣ Fetch the ticket
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          console.error("Ticket not found for ID:", ticketId);
          throw new NonRetriableError("Ticket not found");
        }
        console.log("Fetched ticket:", ticketObject.title);
        return ticketObject;
      });

      // 3️⃣ Assign moderator/admin
      const moderator = await step.run("assign-moderator", async () => {
  console.log("Running assign-moderator step");
  let user =
    (await User.findOne({ role: "moderator" })) ||
    (await User.findOne({ role: "admin" }));

  if (!user) {
    console.error("No admin or moderator found!");
    throw new NonRetriableError("No admin or moderator found");
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    ticket._id,
    { assignedTo: user._id, status: "IN_PROGRESS" },
    { new: true }
  );

  console.log("Ticket updated:", updatedTicket);
  return user;
});


      // 4️⃣ Send email notification
      await step.run("send-email", async () => {
        if (!moderator) return;
        const finalTicket = await Ticket.findById(ticket._id);
        await mailSender(
          moderator.email,
          `New Ticket Assigned: ${finalTicket.title}`,
          ticketAssignedEmail(moderator.email, finalTicket.title)
        );
        console.log("Email sent to:", moderator.email);
      });

      return { success: true };
    } catch (err) {
      console.error("❌ Inngest Function Error:", err);
      return { success: false };
    }
  }
);
