var roomLevels = require('roomLevels');
var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleCarrier = require('role.carrier');
var roleDefender = require('role.defender');
var baseRoleConfigs = require('baseRoleConfigs');

function CreepConfig(level, bodyParts) {
	this.level = level;
	this.bodyParts = bodyParts;
};

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
		},
		defender: function(creep) {
			roleDefender.run(creep);
		}
	},
	assignSources: function(currentRoom) {
		var sources = currentRoom.find(FIND_SOURCES);
		var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
		var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');

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
						harvester.memory.carrierIds = [];
						sourceAssignments[source]++;
						break;
					}
				}
			}
		}

		// compile dictionary of harvesters and coverage.
		var harvesterAssignments = {};
		for (var i in harvesters) {
			var harvester = harvesters[i];
			harvesterAssignments[harvester.id] = 0;
		}
		for (var i in carriers) {
			var carrier = carriers[i];
			harvesterAssignments[carrier.memory.harvesterId]++;
		}

		// allocate carriers to harvesters if not done so.
		for (var name in carriers) {
			var carrier = carriers[name];
			// BUG Execution of the below script when a carrier is spawing briefly throws an exception.
			if (!carrier.memory.harvesterId || Game.getObjectById(carrier.memory.harvesterId) == null) {
				for (var harvester in harvesterAssignments) {
					if (harvesterAssignments[harvester] < carriers.length / harvesters.length) {
						carrier.memory.harvesterId = harvester;
						harvester.memory.carrierIds.append(carrier.id);
						harvesterAssignments[harvester]++;
						break;
					}
				}
			}
		}
	},
	determineBuildConfig: function(currentRoom, spawn, role) {
		// spawn a creep with the appropritely scaled number of body parts.
		var percentAvailableEnergy = currentRoom.energyAvailable / currentRoom.energyCapacityAvailable;
		var prevConfig = baseRoleConfigs.minimal;
		if (percentAvailableEnergy > 0.9) { // Always retain 10% energy for creep renewal
			var config = baseRoleConfigs[role];
			var level = 0;
			var foundConfig = false;
			while (!foundConfig) {
				if (spawn.canCreateCreep(config) == OK) {
					level++;
					prevConfig = config.slice(0); // makes a copy of the array.
					config = config.concat(baseRoleConfigs[role]);
				} else if (spawn.canCreateCreep(config) == ERR_NOT_ENOUGH_ENERGY) {
					foundConfig = true;
				} else {
					prevConfig = [];
					foundConfig = true;
				}
			}
		} else {
			prevConfig = [];
		}
		//prevConfig.append(level); somehow need to return level too.
		return new CreepConfig(level, prevConfig);
	},
	manage: function(roomLevel, currentRoom) {
		var levelNumbers = roomLevels[roomLevel].number;
		var levelConfigs = roomLevels[roomLevel].config;
		// check number of all creeps in room
		var roles = [ // These are ranked by build importance I think.
			'harvester',
			'upgrader',
			'carrier',
			'builder',
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
						var config = this.determineBuildConfig(currentRoom, spawn, irole);
						var clevel = config.level;
						var newName = spawn.createCreep(config.bodyParts, undefined, {
							role: irole,
							level: clevel
						});
						currentRoom.memory.roomLevel = clevel;
						callingForSpawn = true;
						break;
					}
				}
			}
		}

		// assign harvesters to sources (eventually assign carriers to harvesters too)
		this.assignSources(currentRoom);

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
