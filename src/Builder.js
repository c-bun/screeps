var Role = require('Role')
var subroutines = require('subroutines')

class Builder extends Role {
	constructor(creep) {
		super(creep)
		this.creep = creep
		this.building = creep.memory.building
	}

	setBuilding(building) {
		this.creep.memory.building = building
		this.building = building
	}

	build(site) {
		if (this.creep.build(site) == ERR_NOT_IN_RANGE) {
			super.moveToMinCPU(site);
		}
	}

	repair(structure) {
		if (this.creep.repair(structure) == ERR_NOT_IN_RANGE) {
			super.moveToMinCPU(structure);
		}
	}

	repairClosest(threshold) {
		// repair things that are not walls or ramparts
		// TODO this is not working. once new buildings hit threshold, they will be constantly repairing. Should also store this in Memory
		// instead of finding on every tick.
		var madeRepairs = false;
		var thingsToRepair = this.creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.hits < (structure.hitsMax * threshold)) &&
					(structure.structureType != STRUCTURE_WALL ||
						structure.structureType != STRUCTURE_RAMPART);
			}
		});
		if (thingsToRepair.length > 0) {
			madeRepairs = true;
			var closest = this.creep.pos.findClosestByRange(thingsToRepair);
			this.repair(closest);
		}
		return madeRepairs;
	}

	run() {
		if (!super.run()) {
			// determine whether building or obtaining energy.
			if (this.building && this.creep.carry.energy == 0) {
				this.setBuilding(false);
			}
			if (!this.building && this.creep.carry.energy == this.creep.carryCapacity) {
				this.setBuilding(true);
			}

			if (this.building) {
				var constructionSites = this.creep.room.find(FIND_MY_CONSTRUCTION_SITES);
				var prioritySites = _.filter(constructionSites,
					function(sites) {
						return sites.structureType != STRUCTURE_ROAD
					}
				);
				if (prioritySites.length > 0) {
					this.build(prioritySites[0]);
				} else if (constructionSites.length > 0) {
					this.build(constructionSites[0]);
				} else if (!this.repairClosest(0.75)) {
					// there are no construction sites or things to repair, thus deposit energy.
					// TODO fix this. they will put it there and then take it out again.
					//subroutines.depositToSpawn(this.creep);
				}
			} else {
				super.withdrawEnergy();
			}
		}
		super.updateMemory()
	}
}

module.exports = Builder;