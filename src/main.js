var managerHarvester = require('manager.harvester');
var managerCarrier = require('manager.carrier');
var managerBuilder = require('manager.builder');
var managerUpgrader = require('manager.upgrader');
var managerExplorer = require('manager.explorer');
var managerDefender = require('manager.defender');
var managerRepairer = require('manager.repairer');

module.exports.loop = function() {

    var NUM_BUILDERS = 4;
    var NUM_UPGRADERS = 2;
    var NUM_HARVESTERS = 4;
    var NUM_CARRIERS = 2;
    var NUM_EXPLORERS = 0;
    var NUM_DEFENDERS = 2;
    var NUM_REPAIRERS = 2;

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

        // if not enough builders, run all but don't spawn new other roles
        if (roleCounts['builder'] < NUM_BUILDERS) {
          // manage all else at 0
          managerUpgrader.manage(0);
          managerHarvester.manage(0, currentRoom);
          managerCarrier.manage(0);
          managerRepairer.manage(0);
          managerExplorer.manage(0);
          managerDefender.manage(0);
          managerTower.manage(currentRoom);
        } else if (roleCounts['upgrader'] < NUM_UPGRADERS) {
          // manage upgraders but all else at 0
          managerUpgrader.manage(NUM_UPGRADERS);
          managerHarvester.manage(0, currentRoom);
          managerCarrier.manage(0);
          managerRepairer.manage(0);
          managerExplorer.manage(0);
          managerDefender.manage(0);
          managerTower.manage(currentRoom);
        } else if (roleCounts['harvester'] < NUM_HARVESTERS) {
          // add harvesters.
          managerUpgrader.manage(NUM_UPGRADERS);
          managerHarvester.manage(NUM_HARVESTERS, currentRoom);
          managerCarrier.manage(0);
          managerRepairer.manage(0);
          managerExplorer.manage(0);
          managerDefender.manage(0);
          managerTower.manage(currentRoom);
        } else {
          managerUpgrader.manage(NUM_UPGRADERS);
          managerHarvester.manage(NUM_HARVESTERS, currentRoom);
          managerCarrier.manage(NUM_CARRIERS);
          managerRepairer.manage(NUM_REPAIRERS);
          managerExplorer.manage(NUM_EXPLORERS);
          managerDefender.manage(NUM_DEFENDERS);
          managerTower.manage(currentRoom);
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
