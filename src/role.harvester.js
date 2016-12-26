var subroutines = require('subroutines');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var toHarvest;

            if (creep.memory.sourceId) {
                toHarvest = Game.getObjectById(creep.memory.sourceId);
            } else {
                var sources = creep.room.find(FIND_SOURCES)[0];
                toHarvest = creep.pos.findClosestByRange(sources);
            }
            subroutines.harvestEnergy(creep, toHarvest);
        } else {
          // at carry capacity, deposit.
            subroutines.depositEnergy(creep);
        }
    }
};

module.exports = roleHarvester;
