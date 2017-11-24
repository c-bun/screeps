var subroutines = require('subroutines')
var Role = require('Role')

class Upgrader extends Role {
	constructor(creep) {
		super(creep);
		this.creep = creep;
	}
	getEnergy() {
		subroutines.withdrawEnergy(this.creep)
	}
	upgrade() {
		if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
			//super.moveToMinCPU(this.creep.room.controller);
			this.creep.moveTo(this.creep.room.controller, {
				ignoreCreeps: true,
				maxOps: 4000
			});
		}
	}
	run() {
		if (!super.renew()) {
			if (this.creep.memory.upgrading && this.creep.carry.energy == 0) {
				this.creep.memory.upgrading = false;
				this.creep.say('withdrawing');
			}
			if (!this.creep.memory.upgrading && this.creep.carry.energy == this.creep.carryCapacity) {
				this.creep.memory.upgrading = true;
				this.creep.say('upgrading');
			}
			if (this.creep.memory.upgrading) {
				this.upgrade()
			} else {
				this.getEnergy();
			}
		}
	}
}

module.exports = Upgrader;
