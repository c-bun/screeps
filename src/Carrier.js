var subroutines = require('subroutines');
var Role = require('Role');
var _ = require('lodash');

class Carrier extends Role {
	constructor(creep, harvester) {
		super(creep)
		this.creep = creep;
		this.harvester = harvester;
		this.isFull = (this.creep.carry.energy == this.creep.carryCapacity);
	}
	dropOff() {
		super.depositEnergy();
	}
	gather() {
		if (this.harvester) {
			var toTransfer = Math.min([this.creep.carryCapacity - this.creep.carry.energy, this.harvester.carryCapacity]);
			if (this.harvester.transfer(this.creep, RESOURCE_ENERGY, toTransfer) == (ERR_NOT_IN_RANGE || ERR_NOT_ENOUGH_RESOURCES)) {
				super.moveToMinCPU(this.harvester);
			}
		}
	}
	run() {
		if (!super.renew()) {
			if (this.isFull) {
				this.dropOff();
			} else {
				this.gather();
			}
		}
	}
}

module.exports = Carrier;
