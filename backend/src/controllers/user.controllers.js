import { upsertStreamUser } from "../lib/stream.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const getRecommendedUsers = async (req, res) => {
  try {
    const currentuserId = req.user.id;
    const currentUser = req.user;
    const RecommendedUsers = await User.diffIndexes({
      $and: [
        { _id: { $ne: currentuserId } },
        { $id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    res.status(200).json(RecommendedUsers);
  } catch (error) {
    console.log(" errors in recommended users", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullname profilePic NativeLanguage learningLanguage"
      );
    res.status(200).json(user.friends);
  } catch (error) {
    console.log(" errors in my friends", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const sendfriendsrequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;
    if (myId === recipientId) {
      return res.status(400).json({
        message:
          "Rule Voilation!!!!!!     your are not allowed to send the friend request to your self ",
      });
    }
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(400).json({
        message: "person you are looking is not found",
      });
    }

    if (recipient.friends.includes(myId)) {
      return res.status(400).json({
        message: "person you are looking is already is you friend",
      });
    }
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "Request are already existing Pls Wait for response",
      });
    }
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(200).json(friendRequest);
  } catch (error) {
    console.log(" errors in request to be friends", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const acceptfriendsrequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequestRequest) {
      return res.status(404).json({
        message: "Friend request not find",
      });
    }
    if (friendRequest.recipient.toString() !== req.user.is) {
      return res.status(403).json({
        message: "you are not allowed to accept this request",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });
  } catch (error) {
    console.log(" errors in accepting to be friends", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const incomingReq = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullname profilePic NativeLanguage learningLanguage"
    );
    const accepetReq = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullname profilePic");
    res.status(200).json({incomingReq,accepetReq})

  } catch (error) {
    console.log(" errors in getting  to be friends", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getOutgoingFriendRequest =async (req,res)=>{
 try {
    const outGoingReq = await FriendRequest.find({
        sender: req.user.id,
        status: "pending",
      }).populate(
        "recipient",
        "fullname profilePic NativeLanguage learningLanguage"
      );
      res.status(200).json({outGoingReq})
 } catch (error) {
    console.log(" errors in getting  to be friends", error.message);
    res.status(500).json({ message: "internal server error" });
 }
}
