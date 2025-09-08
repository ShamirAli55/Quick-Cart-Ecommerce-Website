import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });


// Inngest func to save user data to user database

export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
    },
    {
        event:"clerk/user.created",
    },
    async ({event}) => 
    {
        const {id,first_name,last_name,email_address,image_url} = event.data
        const userData = {
            _id:id,
            email:email_address[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl:image_url
        }
        await connectDB()
        await User.create(userData)
    }
)