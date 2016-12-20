var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var toHarvest;
            if (creep.memory.sourceId) {
                toHarvest = Game.getObjectById(creep.memory.sourceId);
            } else {
                if (!(creep.room.memory.source_coverage)) {
                  creep.room.memory.source_coverage = {}
                }
                var sources = creep.room.find(FIND_SOURCES);
                for (i = 0; i < sources.length; i++) {
                    if (!(creep.room.memory.source_coverage[sources[i].id]) || creep.room.memory.source_coverage[sources[i].id] < 2) {
                        toHarvest = sources[i];
                        creep.room.memory.source_coverage[sources[i].id]++;
                        creep.memory.source = sources[i].id;
                    }
                }
            }
            if (creep.harvest(toHarvest) == ERR_NOT_IN_RANGE) {
              console.log(creep.name , " moving to " , toHarvest.id)
                creep.moveTo(toHarvest);
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType ==
                            STRUCTURE_EXTENSION || structure.structureType ==
                            STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
};

module.exports = roleHarvester;
