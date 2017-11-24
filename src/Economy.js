class Economy {
	constructor(room) {
		this.room = room;
		this.roomStages = [150 + 300, 350 + 300, 750 + 300];
		this.stage = this.room.memory.stage;
	}

	updateStage() {
		if (!this.stage) {
			this.room.memory.stage = 0;
		};
		if (this.room.memory.checkTick > 50) {
			this.room.memory.checkTick = 0;
			if (this.room.energyAvailable >= this.roomStages[this.stage]) {
				this.room.memory.stage += 1;
			};
		};
		this.room.memory.checkTick++;
	}

	run() {
		this.updateStage();
	}
}

module.exports = Economy;
