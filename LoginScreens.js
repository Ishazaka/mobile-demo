import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Image, Input } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../Config/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreens({}) {
  let navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LoginUser = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          setEmail("");
          setPassword("");
          navigation.navigate("Home");
          console.log("Login success");
        })
        .catch((err) => Alert.alert("Login error", err.message));
    }
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Home");
      } else {
      }
    });
  }, []);
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{
          uri: "https://s3.amazonaws.com/ionic-marketplace/facebook-messenger-clone/icon.png",
        }}
        style={{ width: 200, height: 200 }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          autoFocus
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Button
        title="Login"
        containerStyle={styles.button}
        onPress={LoginUser}
      />
      <Button
        title="Register"
        type="outline"
        onPress={() => navigation.navigate("Register")}
        containerStyle={styles.button}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
    alignContent: "center",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
