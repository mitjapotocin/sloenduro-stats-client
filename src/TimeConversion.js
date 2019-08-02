//transformes time to seconds work /w HH:mm:ss:fff

class TimeConversion {
  static timeToSeconds(time) {
    let timeInSecons = 0;
    timeInSecons += parseInt(time[0] * 36000);
    timeInSecons += parseInt(time[1] * 3600);
    timeInSecons += parseInt(time[3] * 600);
    timeInSecons += parseInt(time[4] * 60);
    timeInSecons += parseInt(time[6] * 10);
    timeInSecons += parseInt(time[7]);
    timeInSecons += parseFloat(time[9] / 10);
    timeInSecons += parseFloat(time[10] / 100);
    timeInSecons += parseFloat(time[11] / 1000);
    return timeInSecons;
  }
}
export default TimeConversion;
