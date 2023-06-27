import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function SelectorModal({ data, selectedData, setSelectedData }) {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => {
          setFilterModalVisible(!filterModalVisible);
        }}>
        <View style={styles.centeredView}>
          <ScrollView contentContainerStyle={styles.modalView}>
            {data.map((section, index) => {
              return (
                <BouncyCheckbox
                  key={index}
                  size={25}
                  fillColor={primaryColor}
                  unfillColor="#FFFFFF"
                  text={section.name + " - " + section.section}
                  iconStyle={{ borderColor: primaryColor }}
                  onPress={(isChecked) => {
                    if (isChecked) {
                      setSelectedData([
                        ...(selectedData != undefined ? selectedData : []),
                        section,
                      ]);
                    } else {
                      setSelectedData(
                        selectedData.filter((d) => {
                          return (
                            d != undefined &&
                            (d.name != section.name ||
                              d.section != section.section)
                          );
                        })
                      );
                    }
                  }}
                  style={{ marginBottom: 10 }}
                />
              );
            })}

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setFilterModalVisible(!filterModalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setFilterModalVisible(true)}>
        <Text style={styles.textStyle}>Filter</Text>
      </Pressable>
    </View>
  );
}

const primaryColor = "#f68b1e";
const primaryColorLight = "#ff8c12";
const secondaryColor = "#d9d9d9";
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    paddingTop: 20,
    backgroundColor: "rgba(70, 70, 70, 0.8)",
    height: "100%",
    width: "100%",
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // borderWidth: 1,
    width: "90%",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: primaryColorLight,
  },
  // buttonOpen: {
  //   backgroundColor: "#F194FF",
  // },
  buttonClose: {
    // backgroundColor: "#2196F3",
    alignSelf: "center",
    marginTop: 15,
  },
  textStyle: {
    color: primaryColor,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
