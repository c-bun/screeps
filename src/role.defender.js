var subroutines = require('subroutines');
var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                subroutines.moveToMinCPU(creep, target);
            }
        }
    }

};

module.exports = roleDefender;