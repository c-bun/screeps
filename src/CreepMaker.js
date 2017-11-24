class CreepMaker {
	constructor(room, creeps) {
		this.room = room;
		this.spawns = room.find(FIND_MY_SPAWNS);
		this.startingConfig = [WORK, CARRY, MOVE];
		this.roomStage = this.room.memory.stage;
		this.creeps = creeps;

		this.creepNumbers = {
			harvester: 2,
			carrier: 2,
			upgrader: 2,
			builder: 2
		}

		this.creepBuilds = {
			harvester: [
				[WORK, CARRY, MOVE],
				[WORK, WORK, CARRY, CARRY, MOVE, MOVE],
				[WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]
			],
			carrier: [
				[CARRY, MOVE, MOVE],
				[CARRY, CARRY, MOVE, MOVE, MOVE],
				[CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
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
		// TODO implement the use of spawn.recycleCreep() here. Instead of suicide,
		// flip switch of recycle in memory to true, then have Role check for
		// recycle switch while calling renew.
		if (this.room.memory.checkTick == 25) {
			var foundOne = false;
			for (var name in this.creeps) {
				if (this.creeps[name].memory.stage < this.roomStage && !foundOne) {
					var role = this.creeps[name].memory.role;
					if (this.spawns[0].spawnCreep(this.creepBuilds[role][this.roomStage], role + Game.time.toString(), {

							dryRun: true
						}) == OK) {
						foundOne = true;
						this.creeps[name].suicide();
					}
				}
			}
		}
	}

	// See if there are any to build
	spawn() {
		for (var k in this.room.memory.roles) {
			if (this.room.memory.roles[k] < this.creepNumbers[k]) {
				var newName = this.spawns[0].spawnCreep(this.creepBuilds[k][this.roomStage], k + Game.time.toString(), {
					memory: {
						role: k,
						stage: this.roomStage
					}
				});
			}
		}
	}

	// spawn() {
	// 	if (this.room.memory.harvesters < 4) {
	// 		var newName = this.spawns[0].createCreep(this.creepBuilds.harvester[this.roomStage], undefined, {
	// 			role: 'harvester',
	// 			stage: this.roomStage
	// 		});
	// 	} else if (this.room.memory.carriers < 4) {
	// 		var newName = this.spawns[0].createCreep(this.creepBuilds.carrier[this.roomStage], undefined, {
	// 			role: 'carrier',
	// 			stage: this.roomStage
	// 		});
	// 	} else if (this.room.memory.upgraders < 2) {
	// 		var newName = this.spawns[0].createCreep(this.creepBuilds.upgrader[this.roomStage], undefined, {
	// 			role: 'upgrader',
	// 			stage: this.roomStage
	// 		});
	// 	} else if (this.room.memory.builders < 2) {
	// 		var newName = this.spawns[0].createCreep(this.creepBuilds.builder[this.roomStage], undefined, {
	// 			role: 'builder',
	// 			stage: this.roomStage
	// 		});
	// 	}
	// }
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
