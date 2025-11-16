export function getCategoryLevel(totalPoints: number): number {
	if (totalPoints < 50) return 0;
	else if (totalPoints < 150) return 1;
	else if (totalPoints < 300) return 2;
	else if (totalPoints < 500) return 3;
	else return 4;
}

export function getTotalLevel(totalPoints: number): number {
	if (totalPoints < 100) return 0;
	else if (totalPoints < 250) return 1;
	else if (totalPoints < 500) return 2;
	else if (totalPoints < 1000) return 3;
	else return 4;
}

export const lvlToPointsCat = [0, 50, 150, 300, 500];
export const lvlToPointsTot = [0, 100, 250, 500, 1000];
