import lodash from "lodash";

class RoutineManager {
	courses = [];

	createNewSection = function (name, section, start, end, days) {
		this.courses.push({
			name: name,
			section: section,
			from: start,
			to: end,
			days: days.split(","),
		});
	};

	printCourses = function () {};

	timeIsSmallerOrEqual = function (t1, t2) {
		if (parseInt(t1.split(":")[0]) == parseInt(t2.split(":")[0])) {
			return parseInt(t1.split(":")[1]) <= parseInt(t2.split(":")[1]);
		}
		return parseInt(t1.split(":")[0]) <= parseInt(t2.split(":")[0]);
	};

	// T and W only contains lab
	sortedByDay = {
		sat: [],
		s: [],
		t: [],
		w: [],
	};
	sortByDay = function () {
		this.courses.forEach((course) => {
			this.sortedByDay[course.days[0]].push(course);
			course.days[1] != undefined &&
				this.sortedByDay[course.days[1]].push(course);
		});
	};

	// COUNT CONFLICTS
	// conflictCounts = {}

	// countConflicts = function () {
	//     for (const day in this.sortedByDay) {
	//         for (let i = 0; i < this.sortedByDay[day].length; i++) {
	//             for (let j = 0; j < this.sortedByDay[day].length; j++) {
	//                 if (this.conflictCounts[this.sortedByDay[day][i].name + "-$-" + this.sortedByDay[day][i].section] == undefined)
	//                     this.conflictCounts[this.sortedByDay[day][i].name + "-$-" + this.sortedByDay[day][i].section] = 0

	//                 let isConflicted = (this.timeIsSmallerOrEqual(this.sortedByDay[day][i].from, this.sortedByDay[day][j].to) && this.timeIsSmallerOrEqual(this.sortedByDay[day][j].from, this.sortedByDay[day][i].to)) ||
	//                     (this.timeIsSmallerOrEqual(this.sortedByDay[day][j].from, this.sortedByDay[day][i].to) && this.timeIsSmallerOrEqual(this.sortedByDay[day][i].from, this.sortedByDay[day][j].to))

	//                 let isSame = this.sortedByDay[day][i].name != this.sortedByDay[day][j].name ? false :
	//                     this.sortedByDay[day][i].section == this.sortedByDay[day][j].section ? true : false;

	//                 if (!isSame && isConflicted) {
	//                     this.conflictCounts[this.sortedByDay[day][i].name + "-$-" + this.sortedByDay[day][i].section]++;
	//                 }
	//             }
	//         }
	//     }
	// }

	// GET ALL CONFLICTS
	conflicts = {};
	getConflicts = function () {
		for (const day in this.sortedByDay) {
			for (let i = 0; i < this.sortedByDay[day].length; i++) {
				for (let j = 0; j < this.sortedByDay[day].length; j++) {
					let isConflicted =
						(this.timeIsSmallerOrEqual(
							this.sortedByDay[day][i].from,
							this.sortedByDay[day][j].to
						) &&
							this.timeIsSmallerOrEqual(
								this.sortedByDay[day][j].from,
								this.sortedByDay[day][i].to
							)) ||
						(this.timeIsSmallerOrEqual(
							this.sortedByDay[day][j].from,
							this.sortedByDay[day][i].to
						) &&
							this.timeIsSmallerOrEqual(
								this.sortedByDay[day][i].from,
								this.sortedByDay[day][j].to
							));

					// let isSame = this.sortedByDay[day][i].name != this.sortedByDay[day][j].name ? false :
					//     this.sortedByDay[day][i].section == this.sortedByDay[day][j].section ? true : false;

					let isSame =
						this.sortedByDay[day][i].name ==
						this.sortedByDay[day][j].name;

					if (!isSame && isConflicted) {
						let c1 = this.sortedByDay[day][i];
						let c2 = this.sortedByDay[day][j];

						let c1Name =
							this.sortedByDay[day][i].name +
							"-$-" +
							this.sortedByDay[day][i].section;

						if (this.conflicts[c1Name] == undefined)
							this.conflicts[c1Name] = [c2];
						else this.conflicts[c1Name].push(c2);
					}
				}
			}
		}
	};

	// SORT BY COURSES
	sortedByCourses = {};
	sortByCourses = function () {
		this.courses.forEach((course) => {
			if (this.sortedByCourses[course.name] == undefined) {
				this.sortedByCourses[course.name] = [];
				this.sortedByCourses[course.name].push(course);
			} else {
				this.sortedByCourses[course.name].push(course);
			}
		});
	};

	// FIND ALL POSSIBLE COMBINATIONS
	combinations = [{}];
	getCombinations = function () {
		for (let course in this.sortedByCourses) {
			let newCombs = [];
			this.combinations.forEach((comb) => {
				this.sortedByCourses[course].forEach((sec) => {
					let newComb = lodash.cloneDeep(comb);
					newComb[course] = sec;
					newCombs.push(newComb);
				});
			});
			this.combinations = newCombs;
		}
	};

	removeConflictedCombinations = function () {
		for (let i = 0; i < this.combinations.length; i++) {
			innerLoop: for (let course in this.combinations[i]) {
				let courseName =
					this.combinations[i][course].name +
					"-$-" +
					this.combinations[i][course].section;
				if (this.conflicts[courseName] != undefined) {
					for (
						let j = 0;
						j < this.conflicts[courseName].length;
						j++
					) {
						let conCourse = this.conflicts[courseName][j];
						if (
							this.combinations[i][conCourse.name].section ==
							conCourse.section
						) {
							this.combinations.splice(i, 1);
							i--;
							break innerLoop;
						}
					}
				}
			}
		}
	};

	analyze = function () {
		this.sortByDay();
		this.sortByCourses();
		this.getConflicts();
		this.getCombinations();
		this.removeConflictedCombinations();
	};

	filter = function (sections, setRoutineData) {
		for (let i = 0; i < this.combinations.length; i++) {
			innerLoop: for (let j = 0; j < sections.length; j++) {
				if (
					this.combinations[i][sections[j].name].section !=
					sections[j].section
				) {
					this.combinations.splice(i, 1);
					i--;
					break innerLoop;
				}
			}
		}
		setRoutineData(this.combinations);
	};
}

// let rs = new RoutineManager();
// rs.analyze();

export default RoutineManager;
