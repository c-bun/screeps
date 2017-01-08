var subroutines = {
	moveToMinCPU: function(creep, destination) {
		creep.moveTo(destination, {
			noPathFinding: true
		});
		// Perform pathfinding only if we have enough CPU
		if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
			creep.moveTo(destination);
		}
	},
	withdrawEnergy: function(creep) {
		var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
			filter: (i) => {
				return i.structureType == STRUCTURE_CONTAINER &&
					i.store[RESOURCE_ENERGY] > 0;
			}
		});

		if (containersWithEnergy.length > 0) {
			var closestContainer = creep.pos.findClosestByRange(containersWithEnergy);
			if (creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveToMinCPU(creep, closestContainer);
			}
		} else {
			var toHarvest = creep.room.find(FIND_SOURCES);
			var closestSource = creep.pos.findClosestByRange(toHarvest);
			this.harvestEnergy(creep, closestSource);
		}
	},
	depositEnergy: function(creep) {
		// Defaults to containers, then to spawns and extensions.
		var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
			filter: (i) => {
				return i.structureType == STRUCTURE_CONTAINER &&
					i.store[RESOURCE_ENERGY] < 2000;
			}
		});
		if (containersWithEnergy.length > 0) {
			var closestContainer = creep.pos.findClosestByRange(containersWithEnergy);
			if (creep.transfer(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveToMinCPU(creep, closestContainer);
			}
		} else {
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType ==
							STRUCTURE_EXTENSION || structure.structureType ==
							STRUCTURE_SPAWN) &&
						structure.energy < structure.energyCapacity;
				}
			});
			if (targets.length > 0) {
				if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					this.moveToMinCPU(creep, targets[0]);
				}
			}
		}
	},
	depositToSpawn: function(creep) {
		var targets = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType ==
						STRUCTURE_EXTENSION || structure.structureType ==
						STRUCTURE_SPAWN) &&
					structure.energy < structure.energyCapacity;
			}
		});
		if (targets.length > 0) {
			if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveToMinCPU(creep, targets[0]);
			}
		}
	},
	harvestEnergy: function(creep, source) {
		if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
			this.moveToMinCPU(creep, source);
		}
	},
	repair: function(creep, structure) {
		if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
			subroutines.moveToMinCPU(creep, structure);
		}
	},
	repairPriority: function(creep, threshold) {
		// repair things
		var madeRepairs = false;
		var thingsToRepair = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.hits < (structure.hitsMax * threshold) &&
					structure.structureType != STRUCTURE_WALL;
			}
		});
		if (thingsToRepair.length > 0) {
			madeRepairs = true;
			var closest = creep.pos.findClosestByRange(thingsToRepair);
			this.repair(creep, closest);
		}
		return madeRepairs;
	},
	repairClosest: function(creep, threshold) {
		// repair things
		var madeRepairs = false;
		var thingsToRepair = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.hits < (structure.hitsMax * threshold);
			}
		});
		if (thingsToRepair.length > 0) {
			madeRepairs = true;
			var closest = creep.pos.findClosestByRange(thingsToRepair);
			this.repair(creep, closest);
		}
		return madeRepairs;
	},
	checkRenew: function(creep) {
		if (creep.memory.needsRenew) {
			var closestSpawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
			if (closestSpawn.renewCreep(creep) == ERR_NOT_IN_RANGE) {
				this.moveToMinCPU(creep, closestSpawn);
			} else if (creep.ticksToLive < 500) {
				// creep will renew at spawn until ticks to live > 500
				creep.memory.needsRenew = true;
			} else {
				creep.memory.needsRenew = false;
			}
		}
		return creep.memory.needsRenew;
	},
	build: function(creep, site) {
		if (creep.build(site) == ERR_NOT_IN_RANGE) {
			this.moveToMinCPU(creep, site);
		}
	}
};
module.exports = subroutines;
