import React, { useState, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  ScrollView,
  TextInput,
  Text,
} from "react-native";

export default function DropDownComponent(textInputStyle) {
  const options = ["aaa", "bbb", "ccc", "ddd", "eee"];
  const [value, setValue] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);


  return (
    <View>
      <TextInput
        style={[textInputStyle.textInputStyle]}
        value={value}
        onChangeText={(text) => {
          setValue(text);
        }}
        onFocus={() => {
          setShowDropDown(true);
        }}
        onBlur={() => {
          setShowDropDown(true);
        }}
      />

      {showDropDown && (
        <ScrollView
          style={[
            {
              elevation: 1,
              height: 180,
              width: 80,
              borderColor: "#e8e8e8",
              borderWidth: 0.5,
              position: "relative",
              marginLeft: 5,
              backgroundColor: "#ffffff",
              overflow: "visible",
            },
          ]}>
          {options.map((option) => {
            return (
              <Text
                style={[
                  {
                    padding: 10,
                    borderBottomWidth: 0.5,
                    borderColor: "#e8e8e8",
                  },
                ]}
                onPress={() => {
                  setValue(option);
                  setShowDropDown(false);
                }}>
                {option}
              </Text>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
