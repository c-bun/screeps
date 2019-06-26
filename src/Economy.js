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
				console.log('Increasing stage of room ' + this.room.toString() + ' to ' + this.room.memory.stage);
			};
		};
		if (Game.time % 10 == 0) {
			console.log('Room ' + this.room.toString() + ' energy avail: ' + this.room.energyAvailable);
			console.log(this.roomStages[this.room.memory.stage]-this.room.energyAvailable + ' remaining to next stage.');
		}
	}

	findNeedsEnergy() {

		var energyStorageAreas = this.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER ||
					structure.structureType == STRUCTURE_EXTENSION ||
					structure.structureType == STRUCTURE_SPAWN ||
					structure.structureType == STRUCTURE_CONTAINER)
			}
		})

		var energyTo = [];
		if (this.roomStatus == 'under attack') {
			energyTo = _.filter(energyStorageAreas, (structure) => {
				return structure.structureType == STRUCTURE_TOWER;
			});
		} else {
			var containers = _.filter(energyStorageAreas, (structure) => {
				return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < 2000;
			});

			var spawnsAndExtensions = _.filter(energyStorageAreas, (structure) => {
				return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
					structure.energy < structure.energyCapacity;
			});

			var towers = _.filter(energyStorageAreas, (structure) => {
				return (structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity * 0.5);
			});
			// Load up towers (if under 30%), then spawns and extensions, then containers.
			energyTo = towers.concat(spawnsAndExtensions).concat(containers);
		}

		return energyTo
	}

	findExtraEnergy() {

		var energyStorageAreas = this.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER ||
					structure.structureType == STRUCTURE_EXTENSION ||
					structure.structureType == STRUCTURE_SPAWN ||
					structure.structureType == STRUCTURE_CONTAINER)
			}
		})


		var containersWithEnergy = _.filter(energyStorageAreas, (structure) => {
			return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0;
		});
		var extensionsWithEnergy = [];
		if (this.room.energyCapacityAvailable > 300 && this.room.energyCapacityAvailable * 0.75 < this.room.energyAvailable) {
			extensionsWithEnergy = _.filter(energyStorageAreas, (structure) => {
				return structure.structureType == STRUCTURE_EXTENSION && structure.energy == structure.energyCapacity;
			});
		}

		var energyFrom = containersWithEnergy.concat(extensionsWithEnergy)

		return energyFrom
	}

	run() {
		this.updateStage();
		if (Game.time % 3 == 0) {
			this.room.memory.needsEnergy = this.findNeedsEnergy(); // Probably should not run this in earlier room stages. Not necessary.
			this.room.memory.hasEnergy = this.findExtraEnergy();
		}
	}
}

module.exports = Economy;
