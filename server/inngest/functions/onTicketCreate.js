import { Inngest, NonRetriableError } from "inngest";

import ticketAssignedEmail from "../../mail/templates/ticketAssignedEmail.js";
import Ticket from "../../models/ticket.model.js";
import User from "../../models/user.model.js";
import analyzeTicket from "../../utils/aiAgent.utils";
import mailSender from "../../utils/mailSender.utils.js";

export const onTicketCreated = Inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      //fetch ticket from DB
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticket) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });

      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { status: "Todo" });
      });

      const aiResponse = await analyzeTicket(ticket);

      const relatedskills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: !["low", "medium", "high"].includes(
              aiResponse.priority.toLowerCase()
            )
              ? "medium"
              : aiResponse.priority.toLowerCase(),
            helpfulNotes: aiResponse.helpfulNotes,
            status: "IN_PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
          });
          skills = aiResponse.relatedSkills;
        }
        return skills;
      });

      const moderator = await step.run("assign-moderator", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: relatedskills.join("|"),
              $options: "i",
            },
          },
        });
        if (!user) {
          user = await User.findOne({
            role: "admin",
          });
        }
        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });
        return user;
      });

      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = await Ticket.findById(ticket._id);
          await mailSender(
            moderator.email,
            `A new Ticket is assigned to you ${finalTicket.title}`,
            ticketAssignedEmail(moderator.email, finalTicket.title)
          );
        }
      });

      return { success: true };
    } catch (error) {
      // handle error ❌
      console.error("❌ Error running the step", error.message);
      return { success: false };
    }
  }
);
