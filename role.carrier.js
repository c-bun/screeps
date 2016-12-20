var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.carry.energy < creep.carryCapacity) {
            var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
               filter: (i) => {
                   return i.structureType == STRUCTURE_CONTAINER &&
               i.store[RESOURCE_ENERGY] > 0;
               }
            });
            if (creep.withdraw(containersWithEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containersWithEnergy[0]);
            }
          }
          else if(creep.deposit(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
};

module.exports = roleCarrier;
