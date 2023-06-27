import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Appearance,
	Image,
	Dimensions,
	Pressable,
	Alert,
} from "react-native";
import ErrorModal from "./ErrorModal";
import InputComponent from "./InputComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SelectScene({ navigation }) {
	const [inputs, setInputs] = useState([["", "", "8:30", "10:00", "sat,t"]]);
	const [errIndices, setErrIndices] = useState([]);
	const [showError, setshowError] = useState(false);
	const [errorMsg, seterrorMsg] = useState("error");
	const [dataLoaded, setDataLoaded] = useState(false);
	const [dataSourceCords, setDataSourceCords] = useState([]);
	const scrollRef = useRef(null);

	useEffect(() => {
		if (inputs.length == 0) setInputs([["", "", "", "", ""]]);
		if (Appearance.getColorScheme() == "dark")
			Alert.alert("WARNING", "Dark mode is not supported.");

		if (!dataLoaded) {
			try {
				AsyncStorage.getItem("@sectionselector:data").then((value) => {
					if (value !== null) {
						setInputs(JSON.parse(value));
						setDataLoaded(true);
					} else {
						AsyncStorage.setItem(
							"@sectionselector:data",
							JSON.stringify(inputs)
						);
					}
				});
			} catch (e) {
				// error reading value
			}
		}
	});

	let timeIsSmallerOrEqual = function (t1, t2) {
		if (parseInt(t1.split(":")[0]) == parseInt(t2.split(":")[0])) {
			return parseInt(t1.split(":")[1]) <= parseInt(t2.split(":")[1]);
		}
		return parseInt(t1.split(":")[0]) <= parseInt(t2.split(":")[0]);
	};

	function errorAlert(msg) {
		seterrorMsg(msg);
		setshowError(true);
	}

	function inputsIsValid() {
		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i][1].length != 1)
				return {
					valid: false,
					index: [i],
					message: "Section must only be a single letter.",
				};

			if (timeIsSmallerOrEqual(inputs[i][3], inputs[i][2])) {
				return {
					valid: false,
					index: [i],
					message:
						"End time can't be smaller or equal to start time.",
				};
			}
			for (let j = 0; j < inputs[i].length; j++) {
				if (!inputs[i][j] || inputs[i][j] == "") {
					return {
						valid: false,
						index: [i],
						message: "All fields must be filled.",
					};
				}
			}

			let matches = [];
			for (let j = 0; j < inputs.length; j++) {
				if (
					inputs[i][0] == inputs[j][0] &&
					inputs[i][1] == inputs[j][1]
				) {
					matches.push(j);
				}
			}
			if (matches.length > 1) {
				return {
					valid: false,
					index: matches,
					message: "Duplicate Sections.",
				};
			}
		}

		setErrIndices([]);
		return { valid: true };
	}

	function scrollDown() {
		scrollRef.current.scrollToEnd({ animated: true });
	}

	return (
		<View style={styles.container}>
			<Image
				source={require("../assets/logo.png")}
				style={styles.logo}
			></Image>

			<ErrorModal
				modalVisible={showError}
				setModalVisible={setshowError}
				errorMsg={errorMsg}
			/>

			{/* INPUT AREA */}
			<ScrollView
				contentContainerStyle={styles.inputContainer}
				ref={scrollRef}
				nestedScrollEnabled={true}
			>
				{inputs.map((input, index) => {
					if (!errIndices.includes(index))
						return (
							<View
								key={index}
								style={styles.inputComponentContainer}
								onLayout={(event) => {
									const layout = event.nativeEvent.layout;
									dataSourceCords.push(layout.y);
									setDataSourceCords(dataSourceCords);
								}}
							>
								<InputComponent
									key={index}
									input={input}
									index={index}
									inputs={inputs}
									setInputs={setInputs}
									isErr={false}
									scrollDown={scrollDown}
								/>
							</View>
						);
					else
						return (
							<View
								key={index}
								style={styles.inputComponentContainer}
								onLayout={(event) => {
									const layout = event.nativeEvent.layout;
									dataSourceCords.push(layout.y);
									setDataSourceCords(dataSourceCords);
								}}
							>
								<InputComponent
									key={index}
									input={input}
									index={index}
									inputs={inputs}
									setInputs={setInputs}
									isErr={true}
									scrollDown={scrollDown}
								/>
							</View>
						);
				})}
			</ScrollView>

			<View style={styles.resultBtnContainer}>
				<Pressable
					onPress={() => {
						let valid = inputsIsValid();
						if (valid.valid) {
							navigation.navigate("Result", { data: inputs });
						} else {
							setErrIndices(valid.index);
							errorAlert(valid.message);
							scrollRef.current.scrollTo({
								x: 0,
								y: dataSourceCords[valid.index[0]],
							});
						}
					}}
					style={styles.analyzeBtn}
					android_ripple={{ color: "#a67f00" }}
				>
					<Text style={styles.btnText}>Analyze</Text>
				</Pressable>
			</View>
		</View>
	);
}

const primaryColor = "#f68b1e";
const styles = StyleSheet.create({
	container: {
		position: "relative",
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		// marginTop: 25,
		backgroundColor: "#ffffff",
		height: "100%",
		width: "100%",
	},
	logo: {
		height: 80,
		width: 170,
	},

	inputContainer: {
		position: "relative",
		// flex: 1,
		flexDirection: "column",
		// justifyContent : "center",
		alignItems: "center",
		// borderWidth: 1,
		marginTop: 25,
		paddingBottom: 25,
		width: Dimensions.get("screen").width,
		backgroundColor: "#ffffff",
	},

	inputComponentContainer: {
		// padding : 5,
		width: "100%",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},

	resultBtnContainer: {
		borderWidth: 1,
		borderColor: primaryColor,
		borderRadius: 10,
		width: "80%",
		marginBottom: 5,
		padding: 5,
		height: 50,
	},
	analyzeBtn: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: primaryColor,
		height: "100%",
		width: "100%",
		borderRadius: 10,
	},
});
