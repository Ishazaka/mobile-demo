import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "@rneui/base";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { database, auth } from "../Config/firebase";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  updateDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chats",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri:
                messages[0]?.photoURl ||
                "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg",
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 88,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss();
    const parentDocRef = doc(database, "chats", route.params.id);
    const subcollectionRef = collection(parentDocRef, "messages");
    addDoc(subcollectionRef, {
      timestamp: Timestamp.fromDate(new Date()),
      message: input,
      displayName: "Beerbal",
      email: auth.currentUser.email,
      photoURl: "https://source.unsplash.com/random/?portrait",
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    setInput("");
  };

  useEffect(() => {
    const parentDocRef = doc(database, "chats", route.params.id);
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

        setMessages([...getMessages]);
      },
      (error) => {
        console.error("Error getting subcollection documents:", error);
      }
    );
    return () => unsubscribe();
  }, [route]);

  console.log("===>>>>>", messages);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map((val, i) => {
                return val.email === "beerbal@gmail.com" ? (
                  <View key={i} style={styles.reciever}>
                    <Avatar
                      rounded
                      position="absolute"
                      bottom={-15}
                      right={-5}
                      size={30}
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      source={{ uri: val.photoURl }}
                    />
                    <Text style={styles.recieverTxt}>{val.message}</Text>
                  </View>
                ) : (
                  <View key={i} style={styles.sender}>
                    <Avatar
                      rounded
                      position="absolute"
                      bottom={-15}
                      left={-5}
                      size={30}
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        left: -5,
                      }}
                      source={{ uri: val.photoURl }}
                    />
                    <Text style={styles.senderTxt}>{val.message}</Text>
                    <Text style={styles.senderName}>{val.displayName}</Text>
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                onSubmitEditing={sendMessage}
                onChangeText={(text) => setInput(text)}
                placeholder="Signel Message"
                style={styles.textinput}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="#2B68E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  senderTxt: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  recieverTxt: {
    color: "#000",
    fontWeight: "500",
    marginLeft: 10,
    // marginBottom: 15,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 25,
  },
  textinput: {
    bottom: 8,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "gray",
    borderRadius: 30,
  },
});
