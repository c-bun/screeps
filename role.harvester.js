/** @param {Room} room **/
// TODO eventually this should inherit from the creep class.
function roleHarvester(sourceId) {
    this.sourceId = sourceId
        // TODO need to eliminate 'Spawn1' from following call.
    this.creep = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, {
        role: 'harvester',
        sourceId: sourceIdToAssn
    });

    run: function() {
        if (this.creep.carry.energy < this.creep.carryCapacity) {
            var toHarvest = Game.getObjectById(this.creep.memory.sourceId);
            if (this.creep.harvest(toHarvest) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(toHarvest);
            }
        } else {
            var targets = this.creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType ==
                            STRUCTURE_EXTENSION || structure.structureType ==
                            STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(targets[0]);
                }
            }
        }
    }
};

module.exports = roleHarvester;
