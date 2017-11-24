var subroutines = require('subroutines');
var roleDefender = {

    /** @param {Creep} creep **/
    performDuties: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var targetStructures = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
        if (target) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                subroutines.moveToMinCPU(creep, target);
            }
        } else if (targetStructures) {
          if (creep.attack(targetStructures) == ERR_NOT_IN_RANGE) {
              subroutines.moveToMinCPU(creep, targetStructures);
          }
        }
    },
    run: function(creep) {
      if (!subroutines.checkRenew(creep)) {
        this.performDuties(creep);
      }
    }

};

module.exports = roleDefender;
