var subroutines = require('subroutines');

class Role {
	constructor(creep) {
		this.creep = creep;
		this.stage = this.creep.memory.stage; // FIXME this is not getting assigned
		this.roomStage = this.creep.room.memory.stage;
		this.underAttack = this.creep.room.memory.underAttack;
		this.needsEnergy = this.creep.room.memory.needsEnergy;
		this.hasEnergy = this.creep.room.memory.hasEnergy;
		this.destination = Game.getObjectById(this.creep.memory.destination); // TODO destinations should not be determined every tick
		this.activity = this.creep.memory.activity;
		this.role = this.creep.memory.role;
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

	withdrawEnergy() {
		// if already have activity and location assigned, keep doing
		if (this.activity == 'withdrawing') {
			if (this.creep.withdraw(this.destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveToMinCPU(this.destination)
			}
		} else if (this.hasEnergy.length > 0) { // if not already withdrawing, look for a place to withdraw and assign destination
			this.destination = this.hasEnergy[0]
			this.activity = 'withdrawing'
			if (this.creep.withdraw(this.destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveToMinCPU(this.destination)
			}
		} else { // have not started withdrawing, and there are no stored containers of energy
			this.harvestEnergy();
		}
	}

	harvestEnergy() {
		// if already doing, keep doing.
		if (this.activity != 'harvesting') {
			var sources = this.creep.room.find(FIND_SOURCES);
			var random_choice = sources[_.random(0, sources.length - 1)]
			this.destination = random_choice
			this.activity = 'harvesting'
		}
		var doneHarvesting = false;
		if (this.creep.harvest(this.destination) == ERR_NOT_IN_RANGE) {
			this.moveToMinCPU(this.destination);
		} else if (this.creep.carry.energy == this.creep.carryCapacity) {
			// done harvesting
			doneHarvesting = true;
			this.destination = 'none';
		}
		return doneHarvesting;
	}

	depositEnergy() {
		var depositedAll = false;
		if (this.activity != 'depositing') {
			this.activity = 'depositing';
			if (this.needsEnergy.length > 0) {
				this.destination = Game.getObjectById(this.needsEnergy[0]);
			} else {
				this.activity = 'waiting'
				return depositedAll
			}
		}
		// Defaults to spawns and extensions, then containers. TODO what about towers?
		// Return true if all energy has been deposited. else return false.

		if (this.creep.transfer(this.destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.moveToMinCPU(this.destination);
		} else if (this.creep.carry.energy == 0) {
			depositedAll = true;
			this.destination = 'none';
		}
		return depositedAll;
	}

	recycleSelf() {
		if (this.creep.memory.recycle) {
			var closestSpawn = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS);
			if (closestSpawn.recycleCreep(this.creep) == ERR_NOT_IN_RANGE) {
				this.moveToMinCPU(closestSpawn);
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

	updateMemory() {
		if (this.destination != undefined) {
			this.creep.memory.destination = this.destination.id
		}
		this.creep.memory.activity = this.activity
	}

	run() { // todo This is a bit of a hack and should be a method that is always run by inheriting classes as well.
		var jobOverride = false;
		if (this.renew() || this.recycleSelf()) {
			jobOverride = true;
		}
		return jobOverride;
	}
}

module.exports = Role;