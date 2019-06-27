var Role = require('Role')

class Harvester extends Role {
	constructor(creep, sourceID) {
		//this.creep = creep;
		super(creep)
		this.source = Game.getObjectById(sourceID);
	}
	harvests() {
		if (this.creep.harvest(this.source) == ERR_NOT_IN_RANGE) {
			this.creep.moveTo(this.source);
		}
	}
	dumps() {
		if (this.creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.creep.moveTo(Game.spawns['Spawn1']);
		}
	}
	run() {
		if (!super.run()) {
			if (this.creep.carry.energy < this.creep.carryCapacity) {
				this.harvests()
			} else {
				this.dumps()
			}
		}
		super.updateMemory()
	}
}

module.exports = Harvester;