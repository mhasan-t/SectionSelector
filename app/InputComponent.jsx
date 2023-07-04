import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Pressable,
	StyleSheet,
	Appearance,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InputComponent({
	input,
	index,
	inputs,
	setInputs,
	isErr,
	scrollDown,
}) {
	const [pickedTimeFrom, setPickedTimeFrom] = useState(input[2]);
	const [pickedTimeTo, setPickedTimeTo] = useState(input[3]);
	const [pickedDays, setPickedDays] = useState(input[4]);

	function addNewSection(curSection) {
		setInputs([
			...inputs,
			[
				curSection[0],
				curSection[1],
				curSection[2],
				curSection[3],
				curSection[4],
			],
		]);
		scrollDown();
	}

	async function removeSection(removeIndex) {
		setInputs(inputs.filter((input, index) => index != removeIndex));
		try {
			const jsonValue = JSON.stringify(inputs);
			await AsyncStorage.setItem("@sectionselector:data", jsonValue);
		} catch (e) {}
	}

	async function onValueChange(field, value, index) {
		setInputs(
			inputs.map((input) => {
				if (inputs.indexOf(input) == index) {
					input[field] = value;
					return input;
				} else return input;
			})
		);

		try {
			const jsonValue = JSON.stringify(inputs);
			await AsyncStorage.setItem("@sectionselector:data", jsonValue);
		} catch (e) {}
	}

	return (
		<View
			style={[
				styles.input,
				isErr && { borderWidth: 2, borderColor: "red" },
			]}
			key={index}
		>
			<View style={styles.inputPromt}>
				<Text style={styles.label}> Course Name :</Text>
				<TextInput
					onChangeText={(text) => {
						onValueChange(0, text, index);
					}}
					style={[styles.textInput, styles.name]}
					defaultValue={input[0]}
				></TextInput>
			</View>
			<View style={styles.inputPromt}>
				<Text style={styles.label}> Section:</Text>
				<TextInput
					maxLength={1}
					onChangeText={(text) => {
						onValueChange(1, text, index);
					}}
					style={[styles.textInput, styles.section]}
					defaultValue={input[1]}
				></TextInput>
			</View>

			{/* DAYS PICKER */}
			<View style={styles.timing}>
				<View style={styles.timePromt}>
					<Text style={styles.label}> Starts at :</Text>
					<Picker
						selectedValue={pickedTimeFrom}
						onValueChange={(itemValue, itemIndex) => {
							onValueChange(2, itemValue, index);
							setPickedTimeFrom(itemValue);
						}}
					>
						<Picker.Item label="8:30 AM" value="8:30" />
						<Picker.Item label="10:05 AM" value="10:05" />
						<Picker.Item label="11:00 AM" value="11:00" />
						<Picker.Item label="11:40 AM" value="11:40" />
						<Picker.Item label="1:30 PM" value="13:30" />
						<Picker.Item label="2:00 PM" value="14:00" />
						<Picker.Item label="3:00 PM" value="15:00" />
					</Picker>
				</View>

				<View style={styles.timePromt}>
					<Text style={styles.label}> Ends at :</Text>
					<Picker
						selectedValue={pickedTimeTo}
						onValueChange={(itemValue, itemIndex) => {
							onValueChange(3, itemValue, index);
							setPickedTimeTo(itemValue);
						}}
					>
						<Picker.Item label="10:00 AM" value="10:00" />
						<Picker.Item label="11:00 AM" value="11:00" />
						<Picker.Item label="11:35 AM" value="11:35" />
						<Picker.Item label="1:10 PM" value="13:10" />
						<Picker.Item label="1:30 PM" value="13:30" />
						<Picker.Item label="3:00 PM" value="15:00" />
						<Picker.Item label="4:30 PM" value="16:30" />
					</Picker>
				</View>
			</View>

			{/* FOOT */}

			<Text style={styles.label}> Select Days :</Text>
			<View style={styles.btnContainer}>
				<View style={styles.daysContainer}>
					<Picker
						selectedValue={pickedDays}
						onValueChange={(itemValue, itemIndex) => {
							onValueChange(4, itemValue, index);
							setPickedDays(itemValue);
						}}
					>
						<Picker.Item
							label="Saturday and Tuesday"
							value="sat,t"
						/>
						<Picker.Item label="Sunday and Wednesday" value="s,w" />
						<Picker.Item label="Saturday" value="sat" />
						<Picker.Item label="Sunday" value="s" />
						<Picker.Item label="Tuesday" value="t" />
						<Picker.Item label="Wednesday" value="w" />
					</Picker>
				</View>
				<Pressable
					style={styles.button}
					onPress={() => {
						addNewSection(input);
					}}
					android_ripple={{ color: "#a67f00" }}
				>
					<Text style={styles.btnText}>Add new</Text>
				</Pressable>

				<Pressable
					style={styles.button}
					onPress={() => {
						removeSection(index);
					}}
					android_ripple={{ color: "#a67f00" }}
				>
					<Text style={styles.btnText}>Remove</Text>
				</Pressable>
			</View>
		</View>
	);
}

const primaryColor = "#f68b1e";
const primaryColorLight = "#ff8c12";
const secondaryColor = "#d9d9d9";
const styles = StyleSheet.create({
	input: {
		backgroundColor: "#fff",
		elevation: 3,
		borderColor: "#ffdbb5",
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		width: "90%",

		padding: 10,
		marginBottom: 10,
	},

	inputPromt: {
		marginBottom: 10,
		width: "100%",
	},
	label: {
		color: primaryColorLight,
		fontWeight: "900",
	},
	textInput: {
		borderWidth: 1,
		height: 40,
		borderColor: secondaryColor,
		padding: 10,
		marginTop: 5,
		borderRadius: 10,
	},
	timing: {
		width: "100%",
		flexDirection: "row",

		justifyContent: "space-between",
	},
	timePromt: {
		width: "47%",
	},

	btnContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: 10,
		paddingRight: 10,
		height: 25,
		marginLeft: 5,
		borderRadius: 15,
		backgroundColor: primaryColor,
		marginTop: 25,
	},
	btnText: {
		fontSize: 16,
		lineHeight: 21,
		letterSpacing: 1,
		color: "white",
	},
	daysContainer: {
		flex: 1,
	},
});
