var managerTower = require('manager.tower');
var roomLevels = require('roomLevels');
var managerSpawner = require('manager.spawner');

module.exports.loop = function() {

	for (var room in Game.rooms) {

		// create this room in memory if not present.
		if (!Memory.rooms[room]) {
			Memory.rooms[room] = {};
		}

		var currentRoom = Game.rooms[room];

		// somehow asses and assign room level?
		// assesLevel();
		var currentRoomLevel = 2;

		// begin to specify building sequence.
		managerSpawner.manage(currentRoomLevel, currentRoom);

		// activate safe mode if dying. this is a bit of a hack because it does not ID the spawn in question.
		if (Game.spawns['Spawn1'].hits < 0.8 * Game.spawns['Spawn1'].hitsMax) {
			currentRoom.controller.activateSafeMode();
		}
	}


	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
		}
	}



	// var tower = Game.getObjectById('TOWER_ID');
	// if(tower) {
	//     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
	//         filter: (structure) => structure.hits < structure.hitsMax
	//     });
	//     if(closestDamagedStructure) {
	//         tower.repair(closestDamagedStructure);
	//     }

	//     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	//     if(closestHostile) {
	//         tower.attack(closestHostile);
	//     }
	// }

}
