var Harvester = require('Harvester')
var Upgrader = require('Upgrader')
var Builder = require('Builder')
var Carrier = require('Carrier')
var Role = require('Role')

class JobManager {
	constructor(room, creeps) {
		this.room = room;
		this.creeps = creeps;
		if (this.room.memory.sourceIDs == undefined) {
			var sources = this.room.find(FIND_SOURCES);
			var forMem = [];
			for (var name in sources) {
				forMem.push(sources[name].id);
			}
			this.room.memory.sourceIDs = forMem;
		}
		this.sourceIDs = this.room.memory.sourceIDs;
	}

	run() {
		// initialize some things
		this.room.memory.roles = {};

		// Distribute jobs and run
		var s = 0;
		var harvesters = _.filter(this.creeps, (creep) => creep.memory.role == 'harvester');
		this.room.memory.roles.harvester = harvesters.length;
		for (var name in harvesters) {
			var creep = new Harvester(harvesters[name], this.sourceIDs[s % this.sourceIDs.length]);
			s++;
			creep.run()
		}
		var h = 0;
		var carriers = _.filter(this.creeps, (creep) => creep.memory.role == 'carrier');
		this.room.memory.roles.carrier = carriers.length;
		for (var name in carriers) {
			var creep = new Carrier(carriers[name], harvesters[h % harvesters.length]);
			h++;
			creep.run()
		}

		// TODO Would be smart to get rid of upgraders if the energy to next upgrade is way out of their ability.
		// But might need some trickle of energy to maintain control of room??
		var upgraders = _.filter(this.creeps, (creep) => creep.memory.role == 'upgrader');
		this.room.memory.roles.upgrader = upgraders.length;
		for (var name in upgraders) {
			var creep = new Upgrader(upgraders[name]);
			creep.run()
		}
		var builders = _.filter(this.creeps, (creep) => creep.memory.role == 'builder');
		this.room.memory.roles.builder = builders.length;
		for (var name in builders) {
			var creep = new Builder(builders[name]);
			creep.run()
		}

		var noRoles = _.filter(this.creeps, (creep) => creep.memory.role == undefined);
		for (var name in noRoles) {
			var creep = new Role(noRoles[name]);
			creep.run()
		}
	}
}

module.exports = JobManager;
