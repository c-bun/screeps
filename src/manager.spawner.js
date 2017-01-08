var roomLevels = require('roomLevels');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleCarrier = require('role.carrier');

var managerSpawner = {
	roles: {
		builder: function(creep) {
			roleBuilder.run(creep);
		},
		harvester: function(creep) {
			roleHarvester.run(creep);
		},
		upgrader: function(creep) {
			roleUpgrader.run(creep);
		},
		carrier: function(creep) {
			roleCarrier.run(creep);
		}
	},
	assignSources: function(currentRoom) {
		var sources = currentRoom.find(FIND_SOURCES);
		var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

		// compile dictionary of sources and coverage.
		var sourceAssignments = {};
		for (var i in sources) {
			var source = sources[i];
			sourceAssignments[source.id] = 0;
			////console.log(source.id, ' ',sourceAssignments[source.id]);
		}
		for (var i in harvesters) {
			var harvester = harvesters[i];
			sourceAssignments[harvester.memory.sourceId]++;
			////console.log(harvester.memory.sourceId, ' ',sourceAssignments[harvester.memory.sourceId]);
		}

		// allocate harvesters to sources if not done so.
		for (var name in harvesters) {
			var harvester = harvesters[name];
			if (!harvester.memory.sourceId) {
				for (var source in sourceAssignments) {
					if (sourceAssignments[source] < harvesters.length / sources.length) {
						harvester.memory.sourceId = source;
						sourceAssignments[source]++;
						break;
					}
				}
			}
		}
	},
	assignCarriers: function(currentRoom) {
		var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
		var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
		// compile dictionary of harvesters and coverage.
		var harvesterAssignments = {};
		for (var i in harvesters) {
			var harvester = harvesters[i];
			harvesterAssignments[harvester.id] = 0;
			////console.log(source.id, ' ',sourceAssignments[source.id]);
		}
		for (var i in carriers) {
			var carrier = carriers[i];
			harvesterAssignments[carrier.memory.harvesterId]++;
			////console.log(harvester.memory.sourceId, ' ',sourceAssignments[harvester.memory.sourceId]);
		}

		// allocate carriers to harvesters if not done so.
		for (var name in carriers) {
			var carrier = carriers[name];
			if (!carrier.memory.harvesterId) {
				for (var harvester in harvesterAssignments) {
					if (harvesterAssignments[harvester] < carriers.length / harvesters.length) {
						carrier.memory.harvesterId = harvester;
						harvesterAssignments[harvester]++;
						break;
					}
				}
			}
		}
	},
	manage: function(roomLevel, currentRoom) {
		var levelNumbers = roomLevels[roomLevel].number;
		var levelConfigs = roomLevels[roomLevel].config;
		// check number of all creeps in room
		var roles = ['builder', // These are ranked by build importance I think.
			'upgrader',
			'harvester',
			'carrier',
			'defender'
		];
		// count up creeps in room? and spawn if necessary
		var roleCounts = {};
		for (var roles_i in roles) {
			var role = roles[roles_i];
			roleCounts[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
		}
		console.log('Job Distribution:');
		for (var job in roleCounts) {
			console.log(job, ": ", roleCounts[job])
		}
		var callingForSpawn = false;
		var spawns = currentRoom.find(FIND_MY_SPAWNS);
		for (var irole in roleCounts) {
			var roleNum = roleCounts[irole];
			if (roleNum < levelNumbers[irole] && !callingForSpawn) {
				for (var s in spawns) {
					var spawn = spawns[s];
					if (!spawn.spawning) {
						var newName = spawn.createCreep(levelConfigs[irole], undefined, {
							role: irole,
							level: roomLevel
						});
						callingForSpawn = true;
						break;
					}
				}
			}
		}

		// assign harvesters to sources (eventually assign carriers to harvesters too)
		this.assignSources(currentRoom);
		this.assignCarriers(currentRoom);

		for (var name in Game.creeps) {
			var creep = Game.creeps[name];
			if (creep.memory.level >= roomLevel - 1 && creep.ticksToLive < 100) {
				creep.memory.needsRenew = true;
			}
			this.roles[creep.memory.role](creep);
		}
	}
};

module.exports = managerSpawner;
