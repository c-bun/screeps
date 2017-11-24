class Tower {
	constructor(tower) {
		this.tower = tower;
		//this.roomStatus = roomStatus;
	}
	repair() {
		var closestDamagedStructure = this.tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => structure.hits < structure.hitsMax
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
