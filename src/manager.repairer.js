var roleRepairer = require('role.repairer');
var managerRepairer = {

    manage: function(repairerCount) {
        // check number of repairers
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        if (repairers.length < repairerCount) {
            // spawn repairers
            var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], undefined, {
                role: 'repairer'
            });
        }
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
        }
    }
};

module.exports = managerRepairer;
