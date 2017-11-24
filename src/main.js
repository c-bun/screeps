var Harvester = require('Harvester')
var Upgrader = require('Upgrader')
var Builder = require('Builder')
var Carrier = require('Carrier')
var CreepMaker = require('CreepMaker')
var Economy = require('Economy')
var _ = require('lodash')

module.exports.loop = function() {
	for (var currentRoom in Game.rooms) {

		// set some vars
		var sources = Game.rooms[currentRoom].find(FIND_SOURCES);
		var s = 0;
		var creeps = Game.rooms[currentRoom].find(FIND_MY_CREEPS);

		// initialize some things
		Game.rooms[currentRoom].memory.roles = {};

		// Distribute jobs and run
		var harvesters = _.filter(creeps, (creep) => creep.memory.role == 'harvester');
		Game.rooms[currentRoom].memory.roles.harvester = harvesters.length;
		for (var name in harvesters) {
			var creep = new Harvester(harvesters[name], sources[s % sources.length]);
			s++;
			creep.run()
		}
		var h = 0;
		var carriers = _.filter(creeps, (creep) => creep.memory.role == 'carrier');
		Game.rooms[currentRoom].memory.roles.carrier = carriers.length;
		for (var name in carriers) {
			var creep = new Carrier(carriers[name], harvesters[h % harvesters.length]);
			h++;
			creep.run()
		}
		var upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
		Game.rooms[currentRoom].memory.roles.upgrader = upgraders.length;
		for (var name in upgraders) {
			var creep = new Upgrader(upgraders[name]);
			creep.run()
		}
		var builders = _.filter(creeps, (creep) => creep.memory.role == 'builder');
		Game.rooms[currentRoom].memory.roles.builder = builders.length;
		for (var name in builders) {
			var creep = new Builder(builders[name]);
			creep.run()
		}

		// Check economy and update room stage if needed
		var economy = new Economy(Game.rooms[currentRoom]);
		economy.run();
		// See if there are any to build
		var creepMaker = new CreepMaker(Game.rooms[currentRoom], creeps);
		creepMaker.run();

	}
}
