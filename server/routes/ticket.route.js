import express from "express";

import {
  createTicket,
  getAllTickets,
  getTicket,
} from "../controllers/ticket.controller.js";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";

const ticketRouter = express.Router();

ticketRouter.post("/create", isAuthenticatedUser, createTicket);

ticketRouter.get("/:id", isAuthenticatedUser, getTicket);

ticketRouter.get("/allticket", isAuthenticatedUser, getAllTickets);

export default ticketRouter;
