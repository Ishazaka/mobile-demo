import React, { useState, useEffect } from "react";
import { Avatar, ListItem } from "@rneui/base";
import { database } from "../Config/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function CustomListItem({ id, chatName, enterChat }) {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const parentDocRef = doc(database, "chats", id);
    const subcollectionRef = collection(parentDocRef, "messages");
    const q = query(subcollectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let getMessages = [];
        snapshot.forEach((doc) => {
          console.log("New document added:", doc.data());
          getMessages.push(doc.data());
        });

        setChatMessages(getMessages);
      },
      (error) => {
        console.error("Error getting subcollection documents:", error);
      }
    );
    return () => unsubscribe();
  }, []);
  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)}>
      <Avatar
        rounded
        source={{
          uri:
            chatMessages?.[0]?.photoURL ||
            "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: 800 }}>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
}
