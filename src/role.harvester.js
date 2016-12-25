var subroutines = require('subroutines');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var toHarvest;

            if (creep.memory.sourceId) {
                toHarvest = Game.getObjectById(creep.memory.sourceId);
            } else {
                toHarvest = creep.room.find(FIND_SOURCES)[0];
            }

            // TODO This method of allocation works! need to implement with manager
            // if (creep.memory.sourceId) {
            //     toHarvest = Game.getObjectById(creep.memory.sourceId);
            // } else {
            //     if (!(creep.room.memory.source_coverage)) {
            //       creep.room.memory.source_coverage = {}
            //     }
            //     var sources = creep.room.find(FIND_SOURCES);
            //     for (i = 0; i < sources.length; i++) {
            //         if (!(creep.room.memory.source_coverage[sources[i].id]) || creep.room.memory.source_coverage[sources[i].id] < 2) {
            //             toHarvest = sources[i];
            //             creep.room.memory.source_coverage[sources[i].id]++;
            //             creep.memory.source = sources[i].id;
            //         }
            //     }
            // }
            if (creep.harvest(toHarvest) == ERR_NOT_IN_RANGE) {
                creep.moveTo(toHarvest);
            }
        } else {
            subroutines.depositEnergy(creep);
        }
    }
};

module.exports = roleHarvester;
