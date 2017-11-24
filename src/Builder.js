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

	run() {
		if (!super.renew()) {
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
				} else if (!subroutines.repairClosest(this.creep, 0.5)) {
					// there are no construction sites or things to repair, thus deposit energy.
					// TODO fix this. they will put it there and then take it out again.
					//subroutines.depositToSpawn(this.creep);
				}
			} else {
				subroutines.withdrawEnergy(this.creep);
			}
		}
	}
}

module.exports = Builder;
