var subroutines = require('subroutines')

class Role {
	constructor(creep, stage) {
		this.creep = creep;
		this.stage = this.creep.memory.stage;
		this.roomStage = this.creep.room.memory.stage;
	}

	moveToMinCPU(destination) {
		this.creep.moveTo(destination, {
			noPathFinding: true
		});
		// Perform pathfinding only if we have enough CPU
		if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
			this.creep.moveTo(destination);
		}
	}

	depositEnergy() {
		// Defaults to spawns and extensions, then containers.
		var targets = this.creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType ==
						STRUCTURE_EXTENSION || structure.structureType ==
						STRUCTURE_SPAWN) &&
					structure.energy < structure.energyCapacity;
			}
		});
		if (targets.length > 0) {
			if (this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveToMinCPU(targets[0]);
			}
		} else {
			var containersWithEnergy = this.creep.room.find(FIND_STRUCTURES, {
				filter: (i) => {
					return i.structureType == STRUCTURE_CONTAINER &&
						i.store[RESOURCE_ENERGY] < 2000;
				}
			});
			if (containersWithEnergy.length > 0) {
				var closestContainer = this.creep.pos.findClosestByRange(containersWithEnergy);
				if (this.creep.transfer(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					this.moveToMinCPU(closestContainer);
				}
			}
		}
	}

	renew() {
		if (this.creep.ticksToLive < 200) {
			this.creep.memory.needsRenew = true;
		}
		if (this.creep.memory.needsRenew) {
			var closestSpawn = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS);
			if (closestSpawn.renewCreep(this.creep) == ERR_NOT_IN_RANGE) {
				this.moveToMinCPU(closestSpawn);
			} else if (this.creep.ticksToLive < 1000) {
				// creep will renew at spawn until ticks to live > 500
				this.creep.memory.needsRenew = true;
			} else {
				this.creep.memory.needsRenew = false;
			}
		}
		return this.creep.memory.needsRenew;

	}
	run() {
		this.renew();
	}
}

module.exports = Role;
