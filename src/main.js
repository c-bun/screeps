var managerHarvester = require('manager.harvester');
var managerCarrier = require('manager.carrier');
var managerBuilder = require('manager.builder');
var managerUpgrader = require('manager.upgrader');
var managerExplorer = require('manager.explorer');
var managerDefender = require('manager.defender');
var managerRepairer = require('manager.repairer');
var managerTower = require('manager.tower');

module.exports.loop = function() {

    for (var room in Game.rooms) {
        // create this room in memory if not present.
        if (!Memory.rooms[room]) {
            Memory.rooms[room] = {};
            Memory.rooms[room].level = 0;
        }
        var currentRoom = Game.rooms[room];
        var currentRoomLevel = Memory.rooms[room].level
        // var roles = ['builder', 'upgrader', 'harvester', 'carrier'];
        // var roleCounts = {};
        // for (var roles_i in roles) {
        //     var role = roles[roles_i];
        //     roleCounts[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
        // }
        
        //managerBuilder.manage(currentRoomLevel);
        managerSuper.manage(currentRoom, currentRoomLevel);
        // TODO add check for room spawn damage and use activate safemode.

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
