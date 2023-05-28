import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon, Input } from "@rneui/base";
import { FontAwesome } from "@expo/vector-icons";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../Config/firebase";

export default function AddChat() {
  let [input, setInput] = useState("");
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  const createChat = async () => {
    addDoc(collection(database, "chats"), {
      chatName: input,
    })
      .then(() => {
        navigation.goBack();
      })
      .catch(() => alert(error));
  };
  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a Chat"
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={<FontAwesome name="wechat" size={24} color="black" />}
        onSubmitEditing={createChat}
      />
      <Button disabled={!input} onPress={createChat} title="Create new Chat" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});
