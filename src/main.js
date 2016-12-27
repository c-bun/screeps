var managerHarvester = require('manager.harvester');
var managerCarrier = require('manager.carrier');
var managerBuilder = require('manager.builder');
var managerUpgrader = require('manager.upgrader');
var managerExplorer = require('manager.explorer');
var managerDefender = require('manager.defender');

module.exports.loop = function() {

    var NUM_BUILDERS = 3;
    var NUM_UPGRADERS = 1;
    var NUM_HARVESTERS = 4;
    var NUM_CARRIERS = 2;
    var NUM_EXPLORERS = 1;
    var NUM_DEFENDERS = 2;

    for (var room in Game.rooms) {
        // create this room in memory if not present.
        if (!Memory.rooms[room]) {
            Memory.rooms[room] = {};
        }
        var currentRoom = Game.rooms[room];
        var roles = ['builder', 'upgrader', 'harvester', 'carrier'];
        var roleCounts = {};
        for (var roles_i in roles) {
            var role = roles[roles_i];
            roleCounts[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
        }
        // begin to specify building sequence.
        managerBuilder.manage(NUM_BUILDERS, currentRoom);
        console.log('num builders: ', roleCounts['builder']);
        // if not enough builders, run all but don't spawn new other roles
        if (roleCounts['builder'] < NUM_BUILDERS) {
          // manage all else at 0
          managerUpgrader.manage(0);
          managerHarvester.manage(0, currentRoom);
          managerCarrier.manage(0);
          managerExplorer.manage(0);
          managerDefender.manage(0);
        } else if (roleCounts['upgrader'] < NUM_UPGRADERS) {
          // manage upgraders but all else at 0
          managerUpgrader.manage(NUM_UPGRADERS);
          managerHarvester.manage(0, currentRoom);
          managerCarrier.manage(0);
          managerExplorer.manage(0);
          managerDefender.manage(0);
        } else if (roleCounts['harvester'] < NUM_HARVESTERS) {
          // add harvesters.
          managerUpgrader.manage(NUM_UPGRADERS);
          managerHarvester.manage(NUM_HARVESTERS, currentRoom);
          managerCarrier.manage(0);
          managerExplorer.manage(0);
          managerDefender.manage(0);
        } else {
          managerUpgrader.manage(NUM_UPGRADERS);
          managerHarvester.manage(NUM_HARVESTERS, currentRoom);
          managerCarrier.manage(NUM_CARRIERS);
          managerExplorer.manage(NUM_EXPLORERS);
          managerDefender.manage(NUM_DEFENDERS);
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
