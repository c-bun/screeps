var roleUpgrader = require('role.upgrader');
var managerUpgrader = {

    manage: function(upgraderCount) {
        // check number of upgraders
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if (upgraders.length < upgraderCount) {
            // spawn upgraders
            var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE, MOVE], undefined, {
                role: 'upgrader'
            });
            console.log('Spawning new upgrader: ' + newName);
        }
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
        }
    }
};

module.exports = managerUpgrader;
