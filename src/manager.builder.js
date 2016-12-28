var roleBuilder = require('role.builder');
var managerBuilder = {

    manage: function(builderCount) {
        // check number of builders
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        if (builders.length < builderCount) {
            // spawn builders
            var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, {
                role: 'builder'
            });
        }
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        }
    }
};

module.exports = managerBuilder;
