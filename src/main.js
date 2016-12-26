var roleUpgrader = require('role.upgrader');
var managerHarvester = require('manager.harvester');
var managerCarrier = require('manager.carrier');
var managerBuilder = require('manager.builder');
var managerUpgrader = require('manager.upgrader');

module.exports.loop = function() {

    var NUM_BUILDERS = 3;
    var NUM_UPGRADERS = 4;
    var NUM_HARVESTERS = 8;
    var NUM_CARRIERS = 2;

    for (var room in Game.rooms) {
        // create this room in memory if not present.
        if (!Memory.rooms[room]) {
            Memory.rooms[room] = {};
        }
        var currentRoom = Game.rooms[room];
        var roles = ['builder', 'upgrader','harvester','carrier'];
        var roleCounts = {};
        for (var roles_i in roles) {
            var role = roles[roles_i];
            roleCounts[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
        }
        // begin to specify building sequence.
        managerBuilder.manage(NUM_BUILDERS);
        if (roleCounts['builder'] == NUM_BUILDERS) {
            managerUpgrader.manage(NUM_UPGRADERS);
        }
        var containersWithEnergy = currentRoom.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return i.structureType == STRUCTURE_CONTAINER;
                }
             });
        if (containersWithEnergy.length > 0) {
          managerCarrier.manage(NUM_CARRIERS);
          managerHarvester.manage(NUM_HARVESTERS, currentRoom);
        }

    }


    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
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
