var roleCarrier = require('role.carrier');
var managerCarrier = {
    /** @param {CarrierCount} carrierCount **/
    manage: function(carrierCount) {
        // check number of carriers
        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
        if (carriers.length < carrierCount) {
            // spawn carriers
            var newName = Game.spawns['Spawn1'].createCreep([CARRY, MOVE, MOVE, MOVE], undefined, {
                role: 'carrier'
            });
            console.log('Spawning new carrier: ' + newName);
        }
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'carrier') {
                roleCarrier.run(creep);
            }
        }
    }
};

module.exports = managerCarrier;
