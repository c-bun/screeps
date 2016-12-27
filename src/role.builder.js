var subroutines = require('subroutines');
var roleBuilder = {

    /** @param {Creep} creep **/
    performDuties: function(creep) {
        var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: (sites) => {
                return sites.structureType != STRUCTURE_ROAD;
            }
        });

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {

            if (targets.length > 0) {
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
                            return structure.hits < (structure.hitsMax * 0.5);
                        }
                    });
                    if (thingsToRepair.length) {
                        var closest = creep.pos.findClosestByRange(thingsToRepair);
                        if (creep.repair(closest) == ERR_NOT_IN_RANGE) {
                            subroutines.moveToMinCPU(creep, closest);
                        }
                    } else {
                        // deposit
                        subroutines.depositToSpawn(creep);
                    }
                }
            }
        } else if (targets.length > 0) {
            subroutines.withdrawEnergy(creep);
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            var closest = creep.pos.findClosestByRange(sources);
            subroutines.harvestEnergy(creep, closest);
        }
    },
    run: function(creep) {
      if (!subroutines.checkRenew(creep)) {
        this.performDuties(creep);
      }
    }
};

module.exports = roleBuilder;
