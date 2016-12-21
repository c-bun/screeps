var roleHarvester = require('role.harvester');

/** @param {Room} room **/
function managerHarvester(room, numHarvesters) {
    this.targetNumHarvesters = numHarvesters;
    this.room = room;
    this.harvesters = [];
    this.sources = room.find(FIND_SOURCES); // add all sources present in room
    this.harvesterAssignments = {}; // sources as keys (add at instatiation?), harvesters as value lists
    for (var source in this.sources) {
        this.harvesterAssignments.source.id = [];
    }

    manage: function() {
        if (this.harvesters.length < this.targetNumHarvesters) {
            var sourceIdToAssn;
            for (var sourceId in this.harvesterAssignments) {
                if (this.harvesterAssignments.sourceId.length < (this.targetNumHarvesters / this.sources.length)) {
                    sourceIdToAssn = sourceId;
                }
            }
            var newName = new roleHarvester(sourceIdToAssn);
            console.log('Spawning new harvester: ' + newName.creep);
            this.harvesters.push(newName);
            this.harvesterAssignments.sourceIdToAssn.push(newName);
        }

        // readjust staff distribution?
        // call 'run' on all harvesters
        for(var creep in this.harvesters) {
                roleHarvester.run(creep);
        }
    }
}

module.exports = managerHarvester;
