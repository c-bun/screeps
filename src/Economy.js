var _ = require('lodash')

class Economy {
	constructor(room) {
		this.room = room;
		this.roomStages = [150 + 300, 350 + 300, 750 + 300];
		this.stage = this.room.memory.stage;
		this.roomStatus = this.room.memory.roomStatus;
	}

	updateStage() {
		if (this.stage == undefined) {
			this.room.memory.stage = 0;
		};
		if (Game.time % 50 == 0) {
			if (this.room.energyAvailable >= this.roomStages[this.stage]) {
				this.room.memory.stage += 1;
			};
		};
	}

	allocateResources() {
		var energyStorageAreas = this.creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER ||
					structure.structureType == STRUCTURE_EXTENSION ||
					structure.structureType == STRUCTURE_SPAWN ||
					structure.structureType == STRUCTURE_CONTAINER || )
			}
		})
		var energyTo = undefined;
		if (this.roomStatus == 'under attack') {
			energyTo = _.filter(energyStorageAreas, (structure) => {
				structure.structureType == STRUCTURE_TOWER
			})
		} else if (Game.time % 10 == 0) {
			var containers = _.filter(energyStorageAreas, (structure) => {
				structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < 2000
			})
			var spawnsAndExtensions = _.filter(energyStorageAreas, (structure) => {
				(structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
				structure.energy < structure.energyCapacity
			})
			var towers = _.filter(energyStorageAreas, (structure) => {
				structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity
			})
			// TODO load up towers (if under 30%), then spawns and extensions, then containers.
		}
		return energyTo
	}

	run() {
		this.updateStage();
	}
}

module.exports = Economy;
