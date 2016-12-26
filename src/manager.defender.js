var roleDefender = require('role.defender');
var managerDefender = {
    /** @param {DefenderCount} defenderCount **/
    manage: function(defenderCount) {
        // check number of defenders
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
        if (defenders.length < defenderCount) {
            // spawn defenders
            var newName = Game.spawns['Spawn1'].createCreep([ATTACK, ATTACK, MOVE, MOVE], undefined, {
                role: 'defender'
            });
            console.log('Spawning new defender: ' + newName);
        }
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'defender') {
                roleDefender.run(creep);
            }
        }
    }
};

module.exports = managerDefender;
