const covidDataChart = ["1(0216)", "2(0301)", "3(0316)", "4(0401)", "5(0503)", "6(future)", "7(future)", "8(last)"];

let time = 0;
let offset = 2428;
let prevData = 0;
let timepass = false;

class Data {
  constructor() {
    this.affectedLearner = 999014;
    this.pastAffectedLearner = 0;
    this.totalLearner = this.affectedLearner * 1000;
    this.isDrawed = false;
    this.chartInterval = 0;
    this.covidDataDiff = 0;
    this.covidData = {
      "1(0216)": 0,
      "2(0301)": 17.1,
      "3(0316)": 44,
      "4(0401)": 91.3,
      "5(0503)": 73.4,
      "6(future)": 72,
      "7(future)": 71,
      "8(last)": 69,
    };

    const interval = setInterval(() => {
      time += 200;
      if (time > 17000) clearInterval(interval);
      if (time > 0 && time < offset) {
        this.covidDataDiff += (this.covidData[covidDataChart[1]] - this.covidData[covidDataChart[0]]) / 11.7;
      }
      if (time > offset && time < offset * 2) {
        this.covidDataDiff += (this.covidData[covidDataChart[2]] - this.covidData[covidDataChart[1]]) / 11.7;
      }
      if (time > offset * 2 && time < offset * 3) {
        this.covidDataDiff += (this.covidData[covidDataChart[3]] - this.covidData[covidDataChart[2]]) / 11.7;
      }
      if (time > offset * 3 && time < offset * 4) {
        this.covidDataDiff += (this.covidData[covidDataChart[4]] - this.covidData[covidDataChart[3]]) / 11.7;
      }
      if (time > offset * 4 && time < offset * 5) {
        timepass = true;
        this.covidDataDiff += (this.covidData[covidDataChart[5]] - this.covidData[covidDataChart[4]]) / 11.7;
      }
      if (time > offset * 5 && time < offset * 6) {
        this.covidDataDiff += (this.covidData[covidDataChart[6]] - this.covidData[covidDataChart[5]]) / 11.7;
      }
      if (time > offset * 6 && time < offset * 7) {
        this.covidDataDiff += (this.covidData[covidDataChart[7]] - this.covidData[covidDataChart[6]]) / 11.7;
      }
    }, 200);
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
  updateFutureData() {
    if (timepass) {
      if (time > offset * 4 && time < offset * 5) {
        this.covidData[covidDataChart[5]] -= 0.8;
        this.covidData[covidDataChart[6]] -= 0.8;
        this.covidData[covidDataChart[7]] -= 0.8;
      }
      if (time > offset * 5 && time < offset * 6) {
        this.covidData[covidDataChart[6]] -= 0.8;
        this.covidData[covidDataChart[7]] -= 0.8;
      }
      if (time > offset * 6 && time < offset * 7) {
        this.covidData[covidDataChart[7]] -= 0.8;
      }
    }
  }
}

const data = new Data();

export default data;
