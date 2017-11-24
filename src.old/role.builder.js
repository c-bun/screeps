var subroutines = require('subroutines');

var roleBuilder = {

	/** @param {Creep} creep **/
	performDuties: function(creep) {

		// determine whether building or obtaining energy.
		if (creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
		}
		if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
		}

		if (creep.memory.building) {
			var constructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
			var prioritySites = _.filter(constructionSites,
				function(sites) {
					return sites.structureType != STRUCTURE_ROAD
				}
			);
			if (prioritySites.length > 0) {
				subroutines.build(creep, prioritySites[0]);
			} else if (constructionSites.length > 0) {
				subroutines.build(creep, constructionSites[0]);
			} else if (!subroutines.repairClosest(creep, 0.5)) {
				// there are no construction sites or things to repair, thus deposit energy.
				//subroutines.depositToSpawn(creep); currently makes them go back and forth.
				// maybe have an 'idle' status?˝
			}
		} else {
			subroutines.withdrawEnergy(creep);
		}
	},
	run: function(creep) {
		if (!subroutines.checkRenew(creep)) {
			this.performDuties(creep);
		}
	}
};

module.exports = roleBuilder;
