import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomListItem from "../Component/CustomListItem";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Avatar } from "@rneui/base";
import { auth, database } from "../Config/firebase";
import { signOut } from "firebase/auth";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";

export default function Home() {
  let db = getFirestore();
  let navigation = useNavigation();

  let [Chats, setChats] = useState([]);
  const signOutUser = () => {
    signOut(auth).then(() => navigation.replace("Home"));
  };

  console.log("=====>>>", auth.currentUser);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Signal",
      headerStyle: {
        backgroundColor: "white",
      },
      headerTitleStyle: {
        color: "black",
      },
      headerLeft: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity>
            <Avatar
              rounded
              source={{
                uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg",
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            width: 60,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity>
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("AddChat")}>
            <SimpleLineIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  });

  useEffect(() => {
    try {
      const q = query(collection(db, "chats"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log(querySnapshot.docs.length);
        let allChat = [];
        querySnapshot.docs.map((doc) => {
          allChat.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setChats(allChat);
      });

      return unsubscribe;
    } catch (error) {
      console.log("error", error, "================");
    }
  }, []);
  //   console.l(Chats);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id: id,
      chatName: chatName,
    });
  };
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {Chats.length > 0 &&
          Chats.map(({ id, data: { chatName } }) => (
            <CustomListItem
              key={id}
              id={id}
              enterChat={enterChat}
              chatName={chatName}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

let styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
