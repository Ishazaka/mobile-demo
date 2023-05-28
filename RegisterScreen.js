import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Image, Input, Text } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../Config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function RegisterScreen({}) {
  let navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageURL, setImageURL] = useState("");

  let register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: "https://source.unsplash.com/random/?portrait",
        })
          .then(() => {
            navigation.navigate("Home");
          })
          .catch((error) => {});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
    });
  }, [navigation]);
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        Create Signal Acoount
      </Text>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autoFocus
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <Input
          placeholder="Profile Pic URL(optional)"
          value={imageURL}
          onChangeText={(text) => setImageURL(text)}
          onSubmitEditing={register}
        />
      </View>
      <Button
        title="Register"
        raised
        onPress={register}
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
