class CreepMaker {
	constructor(room, creeps) {
		this.room = room;

		if (this.room.memory.spawnIDs == undefined || Game.time % 500 == 0) {
			var spawns = this.room.find(FIND_MY_SPAWNS);
			var forMem = [];
			for (var name in spawns) {
				forMem.push(spawns[name].id);
			}
			this.room.memory.spawnIDs = forMem;
		}
		this.spawnIDs = this.room.memory.spawnIDs;

		this.startingConfig = [WORK, CARRY, MOVE];
		this.roomStage = this.room.memory.stage;
		this.creeps = creeps;

		this.creepNumbers = {
			harvester: 3,
			carrier: 3,
			upgrader: 2, // Eventually should merge upgraders and builders so that the job switches based on need.
			builder: 2
		}

		this.buildOrder = ['harvester', 'carrier', 'upgrader', 'builder'];

		this.creepBuilds = {
			// harvesters should be made to barely be able to move but be much faster at harvesting
			harvester: [
				[WORK, CARRY, MOVE],
				[WORK, WORK, CARRY, CARRY, MOVE, MOVE],
				[WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
			],
			carrier: [
				[CARRY, MOVE, MOVE],
				[CARRY, CARRY, MOVE, MOVE, MOVE],
				[CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
			],
			upgrader: [
				[WORK, CARRY, MOVE],
				[WORK, WORK, CARRY, CARRY, MOVE, MOVE],
				[WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
			],
			builder: [
				[WORK, CARRY, MOVE],
				[WORK, WORK, CARRY, CARRY, MOVE, MOVE],
				[WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
			]
		}
	}

	removeOldCreeps() {
		if (Game.time % 25 == 0) {
			var foundOne = false;
			for (var name in this.creeps) {
				if (this.creeps[name].memory.stage < this.roomStage && !foundOne) {
					var role = this.creeps[name].memory.role;
					if (Game.getObjectById(this.spawnIDs[0]).spawnCreep(this.creepBuilds[role][this.roomStage], role + Game.time.toString(), {

							dryRun: true
						}) == OK) {
						foundOne = true;
						this.creeps[name].memory.role = undefined;
						this.creeps[name].memory.recycle = true;
						console.log('Setting ' + this.creeps[name].toString() + ' to be upgraded.');
					}
				}
			}
		}
	}

	// See if there are any to build
	spawn() {
		var foundOne = false;
		for (var k in this.buildOrder) {
			var onRole = this.buildOrder[k];
			if (this.room.memory.roles[onRole] < this.creepNumbers[onRole] && !foundOne) {
				if (Game.getObjectById(this.spawnIDs[0]).spawnCreep(this.creepBuilds[onRole][this.roomStage], onRole + Game.time.toString(), {
						memory: {
							role: onRole,
							stage: this.roomStage
						}
					}) == OK) {
					foundOne = true;
					console.log('Spawning a ' + onRole + '...');
				}
			}
		}
	}

	cleanup() {
		for (var name in Memory.creeps) {
			if (!Game.creeps[name]) {
				delete Memory.creeps[name];
			}
		}
	}
	run() {
		this.removeOldCreeps();
		this.cleanup();
		this.spawn();
	}
}

module.exports = CreepMaker;
