var subroutines = require('subroutines');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('withdrawing');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
                filter: (sites) => {
                    return sites.structureType != STRUCTURE_ROAD;
                }
            });
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                var roads = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
                if (roads.length) {
                    if (creep.build(roads[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(roads[0]);
                    }
                } else {
                    // repair things
                var thingsToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < (structure.hitsMax * 0.25);
                    }
                });
                if (thingsToRepair.length) {
                    if (creep.repair(thingsToRepair[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(thingsToRepair[0]);
                    }
                } else {
                  // harvest from nearest source?
                }
                }
            }
        } else {
            subroutines.withdrawEnergy(creep);
        }
    }
};

module.exports = roleBuilder;
