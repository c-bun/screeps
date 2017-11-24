var subroutines = require('subroutines');
var roleCarrier = {

	/** @param {Creep} creep **/
	performDuties: function(creep) {
		// determine whether picking up.
		if (creep.memory.dropping_off && creep.carry.energy == 0) {
			creep.memory.dropping_off = false;
		}
		if (!creep.memory.dropping_off && creep.carry.energy == creep.carryCapacity) {
			creep.memory.dropping_off = true;
		}

		if (!creep.memory.dropping_off) {
			//subroutines.withdrawEnergy(creep);
			subroutines.transferFromHarvester(creep, creep.harvesterId)
		} else {
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType ==
							STRUCTURE_EXTENSION || structure.structureType ==
							STRUCTURE_SPAWN || structure.structureType ==
							STRUCTURE_TOWER) &&
						structure.energy < structure.energyCapacity;
				}
			});
			if (targets.length > 0) {
				if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					subroutines.moveToMinCPU(creep, targets[0]);
				}
			} else {
				// try to transfer directly to needy creep?
				subroutines.deliverEnergy(creep);
			}
		}
	},
	run: function(creep) {
		if (!subroutines.checkRenew(creep)) {
			this.performDuties(creep);
		}
	}

};

module.exports = roleCarrier;
