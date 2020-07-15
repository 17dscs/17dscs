class Data {
  constructor() {
    this.affectedLearner = 999014;
    this.pastAffectedLearner = 0;
    this.totalLearner = this.affectedLearner * 1000;
  }
  getSubtractAffectedLearner() {
    return Math.floor(this.affectedLearner / 10000000) - Math.floor(this.pastAffectedLearner / 10000000);
  }
  getAffectedLearner() {
    return Math.floor(this.affectedLearner / 10000000);
  }
  getTotalLearner() {
    return Math.floor(this.totalLearner / 10000000);
  }
  run() {
    const interval = setInterval(() => {
      if (this.affectedLearner > this.totalLearner) {
        clearInterval(interval);
      }
      this.pastAffectedLearner = this.affectedLearner;
      this.affectedLearner *= 1.5;
    }, 1000);
  }
}

const data = new Data();

export default data;
