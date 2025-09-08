import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest func to save user data to user database

export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk-created",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_address, image_url } = event.data;

    let email;
    if (Array.isArray(email_address)) {
      email = email_address[0]?.email_address;
    } else if (
      typeof email_address === "object" &&
      email_address?.email_address
    ) {
      email = email_address.email_address;
    } else {
      email = null;
    }

    const userData = {
      _id: id,
      email,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      imageUrl: image_url || null,
    };

    await connectDB();
    await User.create(userData);
  }
);

// inngest func to update data in database

export const syncUserUpdate = inngest.createFunction(
  {
    id: "sync-user-from-clerk-updated",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_address, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_address[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await connectDB();
    await User.findOneAndUpdate(id, userData);
  }
);

// inngest func to delete data from database

export const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-from-clerk-deleted",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findOneAndDelete(id);
  }
);
