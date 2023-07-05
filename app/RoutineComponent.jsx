import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RoutineComponent({ routine }) {
	return (
		<View style={{ height: "100%" }}>
			{Object.keys(routine).map((key, index) => {
				return (
					<View style={styles.courseSection} key={index}>
						<View style={styles.courseInfo}>
							<Text style={styles.infoTitle}>Name : </Text>
							<Text style={styles.infoText}>
								{routine[key].name}
							</Text>
						</View>

						<View style={styles.courseInfo}>
							<Text style={styles.infoTitle}>Section : </Text>
							<Text style={styles.infoText}>
								{routine[key].section}
							</Text>
						</View>
						<View style={styles.courseInfo}>
							<Text style={styles.infoTitle}>Time : </Text>
							<Text style={styles.infoText}>
								{routine[key].from} - {routine[key].to}
							</Text>
						</View>
						<View style={styles.courseInfo}>
							<Text style={styles.infoTitle}>Days : </Text>
							<Text style={styles.infoText}>
								{routine[key].days[0].toUpperCase()}
								{routine[key].days[1] &&
									", " + routine[key].days[1].toUpperCase()}
							</Text>
						</View>
					</View>
				);
			})}
		</View>
	);
}

const primaryColor = "#f68b1e";
const primaryColorLight = "#ff8c12";
const secondaryColor = "#d9d9d9";
const styles = StyleSheet.create({
	courseSection: {
		borderBottomWidth: 0.5,
		borderColor: secondaryColor,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,

		padding: 10,
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	courseInfo: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	infoTitle: {
		fontWeight: "bold",
	},
	infoText: {
		textAlign: "center",
	},
});
