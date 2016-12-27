var subroutines = require('subroutines');
var roleExplorer = {

    /** @param {Creep} creep **/
    performDuties: function(creep) {
        if (Game.flags.Flag1 && (creep.room.name != Game.flags.Flag1.room.name)) {
            creep.moveTo(Game.flags.Flag1);
        } else if (creep.room.controller && !creep.room.controller.my) {
            if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                subroutines.moveToMinCPU(creep, creep.room.controller);
            }
        } else {
            // claim controller.
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                subroutines.moveToMinCPU(creep, creep.room.controller);
            }
        }


    },
    run: function(creep) {
      if (!subroutines.checkRenew(creep)) {
        this.performDuties(creep);
      }
    }

};

module.exports = roleExplorer;
