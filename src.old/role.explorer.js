var subroutines = require('subroutines');
var roleExplorer = {

    /** @param {Creep} creep **/
    performDuties: function(creep) {
      //console.log('creep.room: ',creep.room);
      //console.log('creep.room.controller.my: ', creep.room.controller.my);
      //console.log('creep.room.controller.owner: ', creep.room.controller.owner);
        if (Game.flags.Flag1 && (creep.room != Game.flags.Flag1.room)) {
            creep.moveTo(Game.flags.Flag1);
        } else if (creep.room.controller.owner == undefined) {
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                subroutines.moveToMinCPU(creep, creep.room.controller);
            }

        } else if (creep.room.controller.my == undefined) {
            if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
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
