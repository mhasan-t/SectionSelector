import React, { useState } from "react";
import {
	ScrollView,
	View,
	Text,
	StyleSheet,
	Dimensions,
	Image,
	ImageBackground,
} from "react-native";
import RoutineComponent from "./RoutineComponent";
import RoutineManager from "./RoutineManager";

export default function ResultScene({ route, navigation }) {
	let { data } = route.params;
	let mgr = new RoutineManager();

	data.forEach((elem) => {
		mgr.createNewSection(elem[0], elem[1], elem[2], elem[3], elem[4]);
	});

	mgr.analyze();

	const [routineData, setRoutineData] = useState(mgr.combinations);

	return routineData.length > 0 ? (
		<View style={styles.resultSceneContainer}>
			<Text style={styles.headerText}>ROUTINES</Text>
			<ScrollView contentContainerStyle={styles.resultContainer}>
				<View style={styles.routineContainer}>
					{routineData.map((comb, index) => {
						return (
							<View style={styles.routine} key={index}>
								<RoutineComponent routine={comb} />
							</View>
						);
					})}
				</View>
			</ScrollView>
		</View>
	) : (
		<View style={styles.noResultSceneContainer}>
			<ImageBackground
				source={require("../assets/emoji_background.png")}
				resizeMode="cover"
				style={styles.image}
			>
				<View style={styles.sadContentContainer}>
					<Image
						style={styles.sadImage}
						source={require("../assets/first-time.gif")}
					></Image>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={styles.sadText}>
							There is no way you can take all the given courses.
							😿
						</Text>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
}
const primaryColor = "#f68b1e";
const primaryColorLight = "#ff8c12";
const secondaryColor = "#d9d9d9";
const styles = StyleSheet.create({
	headerText: {
		fontSize: 50,
		fontWeight: "bold",
		color: primaryColor,
		marginTop: 20,
		marginBottom: 20,
	},
	resultSceneContainer: {
		height: "100%",
		width: "100%",

		backgroundColor: "#ffffff",
		flex: 1,
		alignItems: "center",
	},
	resultContainer: {
		marginTop: 10,
		width: Dimensions.get("window").width - 20,
	},
	routineContainer: {
		height: "100%",
	},

	routine: {
		elevation: 3,
		marginBottom: 10,
		flex: 1,
		borderWidth: 0.5,
		borderColor: primaryColorLight,
		borderRadius: 10,
		backgroundColor: "#ffaf5e",
		marginBottom: 15,
	},

	noResultSceneContainer: {
		backgroundColor: "#ffffff",
		height: "100%",
		width: "100%",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	sadContentContainer: {
		justifyContent: "center",
		alignItems: "center",
		margin: 20,
	},
	image: {
		flex: 1,
		justifyContent: "center",

		marginBottom: 40,
	},
	sadImage: {
		width: Dimensions.get("window").width - 100,
		height: Dimensions.get("window").width - 100,
		resizeMode: "contain",
	},
	midText: {
		fontSize: 50,
	},
	sadText: {
		fontSize: 25,
		fontWeight: "bold",
		textAlign: "center",
		color: "red",

		textShadowColor: "rgba(0, 0, 0, 1)",

		textShadowRadius: 20,
	},
});
