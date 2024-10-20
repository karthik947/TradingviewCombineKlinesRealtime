const tfw = {
  "1m": 1 * 60,
  "2m": 2 * 60,
  "3m": 3 * 60,
  "5m": 5 * 60,
  "10m": 10 * 60,
  "15m": 15 * 60,
  "30m": 30 * 60,
  "1h": 1 * 60 * 60,
  "2h": 2 * 60 * 60,
  "4h": 4 * 60 * 60,
};

const getNormalizedTimeframe = (ts, timeframe) =>
  ~~(ts / tfw[timeframe]) * tfw[timeframe];

const convertTimeframe = (candles, targetTimeframe) => {
  let result = [];
  let currentKline = {};
  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      currentKline.time = getNormalizedTimeframe(
        candles[i].time,
        targetTimeframe
      );
      currentKline.open = candles[i].open;
      currentKline.high = candles[i].high;
      currentKline.low = candles[i].low;
      currentKline.close = candles[i].close;
      currentKline.volume = candles[i].volume;
      continue;
    }

    if (candles[i].time < currentKline?.time + tfw[targetTimeframe]) {
      currentKline.high = Math.max(currentKline.high, candles[i].high);
      currentKline.low = Math.min(currentKline.low, candles[i].low);
      currentKline.close = candles[i].close;
      currentKline.volume += candles[i].volume;
      continue;
    }

    if (candles[i].time >= currentKline?.time + tfw[targetTimeframe]) {
      result.push({ ...currentKline });
      currentKline.time = getNormalizedTimeframe(
        candles[i].time,
        targetTimeframe
      );
      currentKline.open = candles[i].open;
      currentKline.high = candles[i].high;
      currentKline.low = candles[i].low;
      currentKline.close = candles[i].close;
      currentKline.volume = candles[i].volume;
      continue;
    }
  }

  return result;
};

const aggregateCandles = (candles, targetTimeframe) => {
  const time = getNormalizedTimeframe(candles[0].time, targetTimeframe);
  const open = candles[0].open;
  const high = Math.max(...candles.map((c) => c.high));
  const low = Math.min(...candles.map((c) => c.low));
  const close = candles[candles.length - 1].close;
  const volume = candles.reduce((acc, c) => acc + c.volume, 0);
  return { time, open, high, low, close, volume };
};

class Kline {
  constructor(divid) {
    this.chart = null;
    this.chartProperties = {
      width: 1500,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    };
    this.domElement = document.getElementById(divid);
    this.oneminklines = [];
    this.targetklines = [];
    this.targetTimeframe = "";
    this.renderLastBarFlag = false;
  }
  upsert1minKline(kline) {
    const index = this.oneminklines.findLastIndex((k) => k.time === kline.time);
    if (index >= 0) this.oneminklines[index] = Object.assign({}, kline);
    if (index === -1) this.oneminklines = this.oneminklines.concat(kline);
    if (this.renderLastBarFlag) this.renderLastBar(kline.time);
  }
  setTargetTimeframe(timeframe) {
    this.targetTimeframe = timeframe;
    this.renderAll();
  }
  renderAll() {
    this.renderLastBarFlag = false;
    if (this.chart) this.chart.remove();
    this.chart = LightweightCharts.createChart(
      this.domElement,
      this.chartProperties
    );
    this.candleseries = this.chart.addCandlestickSeries();
    this.candleseries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.2,
      },
    });
    this.volumeSeries = this.chart.addHistogramSeries({ priceScaleId: "" });
    this.volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    this.targetklines = convertTimeframe(
      this.oneminklines,
      this.targetTimeframe
    );
    this.candleseries.setData(this.targetklines);
    const volumeData = this.targetklines.map((kline) => ({
      time: kline.time,
      value: kline.volume,
      color: kline.close > kline.open ? "#26a69a" : "#ef5350", // Green for up, red for down
    }));
    this.volumeSeries.setData(volumeData);
    this.renderLastBarFlag = true;
  }
  renderLastBar(time) {
    const opents = getNormalizedTimeframe(time, this.targetTimeframe);
    const index = this.oneminklines.findLastIndex((k) => k.time === opents);
    const dataSlice = this.oneminklines.slice(index);
    const lastBar = aggregateCandles(dataSlice, this.targetTimeframe);
    this.candleseries.update(lastBar);
    const lastVolumeBar = {
      time: lastBar.time,
      value: lastBar.volume,
      color: lastBar.close > lastBar.open ? "#26a69a" : "#ef5350",
    };
    this.volumeSeries.update(lastVolumeBar);
  }
}
