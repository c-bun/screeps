var roomLevels = require('roomLevels');
var roleCarrier = require('role.carrier');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleExplorer = require('role.explorer');
var roleHarvester = require('role.harvester');
var roleRepairer = require('role.repairer');
var managerHarvester = require('manager.harvester');

var managerSuper = {
    runFunctions: {
        harvester: function(creep, currentRoom) {
            managerHarvester.manage(creep, currentRoom)
        },
        builder: function(creep) {
            roleBuilder.run(creep)
        },
        carrier: function(creep) {
            roleCarrier.run(creep)
        },
        defender: function(creep) {
            roleDefender.run(creep)
        },
        explorer: function(creep) {
            roleExplorer.run(creep)
        },
        repairer: function(creep) {
            roleRepairer.run(creep)
        },
        upgrader: function(creep) {
            roleUpgrader.run(creep)
        }
    },
    /** @param {roomLevel} roomLevel **/
    manage: function(currentRoom, roomLevel) {
        for (workerRole in this.runFunctions) {
            var roleNumber = roomLevels[roomLevel].number[workerRole];
            var roleConfig = roomLevels[roomLevel].config[workerRole];
            // check number of workers
            var workers = _.filter(Game.creeps, (creep) => creep.memory.role == workerRole);
            if (workers.length < roleNumber) {
                // spawn workers
                var newName = Game.spawns['Spawn1'].createCreep(roleConfig, undefined, {
                    role: workerRole
                });
            }
            for (var name in currentRoom.creeps) {
                var creep = currentRoom.creeps[name];
                if (creep.memory.role == workerRole) {
                    this.runFunctions[workerRole](creep, currentRoom);
                }
            }
        }

    }
};

module.exports = managerCarrier;
