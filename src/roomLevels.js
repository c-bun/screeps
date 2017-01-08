var roomLevels = {
	1: {
		number: {
			harvester: 2,
			builder: 0,
			carrier: 2,
			defender: 0,
			explorer: 0,
			repairer: 0,
			upgrader: 2
		},
		config: {
			harvester: [WORK, CARRY, CARRY, MOVE],
			builder: [WORK, CARRY, MOVE, MOVE],
			carrier: [CARRY, CARRY, MOVE, MOVE],
			defender: [ATTACK, ATTACK, MOVE, MOVE],
			explorer: [CLAIM, MOVE],
			repairer: [WORK, CARRY, MOVE, MOVE],
			upgrader: [WORK, CARRY, CARRY, MOVE]
		}
	},
	2: {
		number: {
			harvester: 4,
			builder: 3,
			carrier: 2,
			defender: 0,
			explorer: 0,
			repairer: 2,
			upgrader: 2
		},
		config: {
			harvester: [WORK, CARRY, MOVE, MOVE],
			builder: [WORK, CARRY, MOVE, MOVE],
			carrier: [CARRY, CARRY, MOVE, MOVE],
			defender: [ATTACK, ATTACK, MOVE, MOVE],
			explorer: [CLAIM, MOVE],
			repairer: [WORK, CARRY, MOVE, MOVE],
			upgrader: [WORK, CARRY, MOVE, MOVE]
		}
	},
	3: {
		number: {
			harvester: 6,
			builder: 4,
			carrier: 2,
			defender: 0,
			explorer: 0,
			repairer: 2,
			upgrader: 4
		},
		config: {
			harvester: [WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
			builder: [WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
			carrier: [CARRY, CARRY, MOVE, MOVE],
			defender: [ATTACK, ATTACK, MOVE, MOVE],
			explorer: [CLAIM, MOVE],
			repairer: [WORK, CARRY, CARRY, MOVE, MOVE],
			upgrader: [WORK, CARRY, CARRY, MOVE, MOVE]
		}
	},
	4: {
		number: {
			harvester: 6,
			builder: 8,
			carrier: 3,
			defender: 2,
			explorer: 0,
			repairer: 2,
			upgrader: 6
		},
		config: {
			harvester: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
			builder: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
			carrier: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
			defender: [ATTACK, ATTACK, MOVE, MOVE],
			explorer: [CLAIM, MOVE],
			repairer: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
			upgrader: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
		}
	}
}

module.exports = roomLevels;
