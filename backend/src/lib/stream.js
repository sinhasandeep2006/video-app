import {StreamChat } from "stream-chat"
import "dotenv/config"


const apikey =process.env.STREAM_API_KEY
const  ApiSecret =process.env.STREAM_API_SECRET

if(!apikey || !ApiSecret){
    console.error("stream api missing")
}

const streamClient =StreamChat.getInstance(apikey,ApiSecret)

export const upsertStreamUser = async (userData) => {
    try {
      await streamClient.upsertUsers([userData]);
      return userData;
    } catch (error) {
      console.error("Error upserting Stream user:", error);
    }
  };
  
  export const generateStreamToken = async (userId) => {
    try {
      const userIdStr= userId.toString()
      return streamClient.createToken(userIdStr)

    } catch (error) {
       console.error("Error upserting Stream user:", error);
    }
  };
  