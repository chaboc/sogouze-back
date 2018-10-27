import { Genres } from '../../../common/class';

export function compressArray(original) {
	let compressed: Array<any> = [];
	let copy: Array<any> = original.slice(0);
	for (let i = 0; i < original.length; i++) {
		let myCount = 0;
		for (let w = 0; w < copy.length; w++) {
			if (original[i] == copy[w]) {
				myCount++;
				delete copy[w];
			}
		}

		if (myCount > 0) {
			let newArray: Genres = new Object();
			newArray.name = original[i];
			newArray.occurence = myCount;
			compressed.push(newArray);
		}
	}
	return compressed;
};

export function sortObject(params): any {
	let sortOrder: number = -1;
	if (params[0] === "-") {
		sortOrder = +1;
		params = params.substr(1);
	}
	return function (a, b) {
		let result: number = (a[params] < b[params]) ? -1 : (a[params] > b[params]) ? 1 : 0;
		return result * sortOrder;
	}
}