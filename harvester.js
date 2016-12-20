var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            var primaryTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER
                                ) && (structure.energy < structure.energyCapacity);
                    }
            });
            // this does not work for some reason.
            var secondaryTargets = creep.room.find(FIND_STRUCTURES , {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                    _.sum(structure.store) < structure.storeCapacity;
                }    
            });
            
            if(primaryTargets.length > 0) {
                if(creep.transfer(primaryTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(primaryTargets[0]);
                }
            }
            else if(secondaryTargets.length > 0) {
                if(creep.transfer(secondaryTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(secondaryTargets[0]);
                }
            }
            else {
                creep.say('Nothing to transfer energy to.')
                var spawn = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN)
                    }
                });
                creep.moveTo(spawn[0]);
            }
        }
    }
};

module.exports = roleHarvester;