var roleHarvester = require('role.harvester');
var managerHarvester = {
    /** @param {HarvesterCount} harvesterCount **/
    manage: function(harvesterCount) {
        // check number of harvesters
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if (harvesters.length < harvesterCount) {
            // spawn harvesters
            var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {
                role: 'harvester'
            });
            console.log('Spawning new harvester: ' + newName);
        }
        // update source assignments:
        // initialize if necessary...
        if (!Memory.sourceAssignments) {
            Memory.source_assignments = {};
            var sources = harvesters[0].room.find(FIND_SOURCES); // a bit of a hack
            for (source in sources) {
                Memory.sourceAssignments[source.id] = 0;
            }
        }
        // check for dead creeps and update Memory.sourceAssignments
        for (var name in Memory.creeps) {
            if (!Game.creeps[name] && Memory.creeps[name].role == 'harvester') {
                Memory.sourceAssignments[Memory.creeps[name].sourceId] -= 1;
                console.log('Updating source Assignments:', name);
            }
        }
        for (creep in harvesters) {
            if (!creep.memory.sourceId) {
                for (sourceId in Memory.sourceAssignments) {
                    if (Memory.sourceAssignments[sourceId] < harvesterCount / Memory.sourceAssignments.length) {
                        creep.memory.sourceId = sourceId;
                        Memory.sourceAssignments[sourceId] += 1;
                        break;
                    }
                }
            }
        }
        // 'run' harvesters
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
        }
    }
};

module.exports = managerHarvester;