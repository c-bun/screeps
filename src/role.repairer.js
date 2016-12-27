var roleRepairer = {

    /** @param {Creep} creep **/
    performDuties: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('repairing');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (sites) => sites.structureType != 'road'
            });
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
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    },
    run: function(creep) {
      if (!subroutines.checkRenew(creep)) {
        this.performDuties(creep);
      }
    }
};

module.exports = roleRepairer;
