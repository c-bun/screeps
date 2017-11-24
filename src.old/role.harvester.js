var subroutines = require('subroutines');
var roleHarvester = {

	/** @param {Creep} creep **/
	performDuties: function(creep) {
		if (creep.carry.energy < creep.carryCapacity) {
			var toHarvest;

			if (creep.memory.sourceId) {
				toHarvest = Game.getObjectById(creep.memory.sourceId);
			} else {
				var sources = creep.room.find(FIND_SOURCES);
				toHarvest = creep.pos.findClosestByRange(sources);
			}
			subroutines.harvestEnergy(creep, toHarvest);
		} else if (creep.memory.carrierIds.length == 0) {
			// at carry capacity, deposit if no carrier assigned.
			subroutines.depositEnergy(creep);
		}
	},
	run: function(creep) {
		if (!subroutines.checkRenew(creep)) {
			this.performDuties(creep);
		}
	}
};

module.exports = roleHarvester;
