var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (sites) => {
                    sites.structureType != STRUCTURE_ROAD
                }
            });
            console.log(targets);
            if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
            }
            else {
                var roads = creep.room.find(FIND_CONSTRUCTION_SITES)
                if(roads.length) {
                    if(creep.build(roads[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(roads[0]);
                    }
            }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
               filter: (i) => { 
                   return i.structureType == STRUCTURE_CONTAINER &&
               i.store[RESOURCE_ENERGY] > 0;
               }
            });
            if (creep.withdraw(containersWithEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containersWithEnergy[0]);
            }
            else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};

module.exports = roleBuilder;