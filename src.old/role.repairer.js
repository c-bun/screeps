var subroutines = require('subroutines');
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
          subroutines.repairClosest(creep, 0.75);
        } else {
          subroutines.withdrawEnergy(creep);
        }
    },
    run: function(creep) {
      if (!subroutines.checkRenew(creep)) {
        this.performDuties(creep);
      }
    }
};

module.exports = roleRepairer;
