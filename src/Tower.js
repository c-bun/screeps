class Tower {
	constructor(tower) {
		this.tower = tower;
		//this.roomStatus = roomStatus;
	}
	repair() {
		// only repairs walls and ramparts
		var closestDamagedStructure = this.tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => ((structure.hits < structure.hitsMax * 0.1) &&
				(structure.structureType == STRUCTURE_WALL ||
					structure.structureType == STRUCTURE_RAMPART))
		});
		if (closestDamagedStructure) {
			this.tower.repair(closestDamagedStructure);
		}
	}
	attack() {
		var closestHostile = this.tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (closestHostile) {
			this.tower.attack(closestHostile);
		}
	}
	run() {
		this.attack()
		this.repair()
	}
}

module.exports = Tower;
