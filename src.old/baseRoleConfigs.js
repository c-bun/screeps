var baseRoleConfigs = {
	harvester: [WORK, WORK, CARRY, CARRY, MOVE],
	carrier: [CARRY, MOVE],
	builder: [WORK, CARRY, MOVE],
	upgrader: [WORK, WORK, CARRY, CARRY, MOVE],
	defender: [ATTACK, MOVE],
	minimal: [WORK, CARRY, MOVE]
}

module.exports = baseRoleConfigs;
