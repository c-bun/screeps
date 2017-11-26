var JobManager = require('JobManager')
var CreepMaker = require('CreepMaker')
var Economy = require('Economy')
var Defense = require('Defense')
var _ = require('lodash')

module.exports.loop = function() {
	for (var currentRoom in Game.rooms) {

		// Asses room threats and act (and update room status) if necessary
		var defense = new Defense(Game.rooms[currentRoom]);
		defense.run();

		var creeps = Game.rooms[currentRoom].find(FIND_MY_CREEPS);
		// Assign jobs. TODO make jobs dependent on roomStatus (whether under attack or not)
		var jobManager = new JobManager(Game.rooms[currentRoom], creeps)
		jobManager.run();

		// Check economy and update room stage if needed
		var economy = new Economy(Game.rooms[currentRoom]);
		economy.run();
		// See if there are any to build
		var creepMaker = new CreepMaker(Game.rooms[currentRoom], creeps);
		creepMaker.run();

	}
	console.log('CPU used on: ' + Game.time.toString() + ' is: ' + Game.cpu.getUsed())
}
