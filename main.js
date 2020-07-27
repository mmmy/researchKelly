Chart.defaults.global.animation.duration = 0
const ctx = document.getElementById('chart1')
const infoSpan = document.getElementById('info')

const chart1 = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: [],
      fill: false,
      pointRadius: 0,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.3)'
    }]
  },
})

const ctx2 = document.getElementById('chart2')
const chart2 = new Chart(ctx2, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: [],
      fill: false,
      pointRadius: 0,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.8)'
    }]
  },
})

function createLineData(len, p, d, posPercent, lossPercent) {
  lossPercent = lossPercent || 1
  increasePercent = lossPercent * d
  let sum = 1
  const result = [sum]
  const labels = []
  for (let i = 0; i < len; i++) {
    const pos = sum * posPercent
    const isIncrease = Math.random() <= p
    const change = (isIncrease ? (increasePercent) : (-lossPercent)) * pos
    sum = sum + change
    result.push(sum)
    labels.push((i + 1) + '')
    if (sum <= 0) {
      break
    }
  }
  return {
    list: result,
    labels
  }
}

function createLineDataSeries(seriesLen, len, p, d, posPercent, lossPercent) {
  const series = []
  const dataAvg = []
  for (let i = 0; i < seriesLen; i++) {
    series.push(createLineData(len, p, d, posPercent, lossPercent))
  }
  for (let i = 0; i < len; i++) {
    let sum = 0
    series.forEach(s => { sum = sum + s.list[i] })
    dataAvg[i] = sum / series.length
  }
  return {
    series,
    dataAvg,
  }
}

const gui = new dat.GUI()
const controls = {
  len: 100,
  p: 0.5,
  d: 2,
  posPercent: 0.5,
  update: function () {
    /*
    const lineData = createLineData(this.len, this.p, this.d, this.posPercent)
    chart1.data.datasets[0].data = lineData.list
    chart1.data.labels = lineData.labels
    */
    const seriesData = createLineDataSeries(100, this.len, this.p, this.d, this.posPercent)
    chart1.data.labels = seriesData.series[0].labels
    infoSpan.innerText = seriesData.dataAvg[seriesData.dataAvg.length - 1]
    seriesData.series.forEach((s, i) => {
      const ds = chart1.data.datasets[i] || {
        data: [],
        fill: false,
        pointRadius: 0,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.3)'
      }
      ds.data = s.list
      chart1.data.datasets[i] = ds
    })

    chart1.data.datasets[seriesData.series.length] = {
      data: seriesData.dataAvg,
      fill: false,
      pointRadius: 0,
      borderWidth: 5,
      borderColor: 'rgba(255,0,0,0.8)'
    }

    chart1.update()
  }
}

const f1 = gui.addFolder('f1')
f1.add(controls, 'p', 0, 1, 0.01).onChange(function () {
  controls.update()
})
f1.add(controls, 'd', 0, 5, 0.1).onChange(function () {
  controls.update()
})
f1.add(controls, 'posPercent', 0, 1, 0.01).onChange(function () {
  controls.update()
})


const controls2 = {
  seriesLen: 100,
  len: 1000,
  p: 0.5,
  d: 2,
  // posPercent: 0.5,
  update: function () {
    const lastAvgs = []
    const seriesCollections = []
    const labels = []
    for (let i = 0; i < 100; i++) {
      const series = createLineDataSeries(this.seriesLen, this.len, this.p, this.d, i / 100)
      const lastAvg = series.dataAvg[series.dataAvg.length - 1]
      lastAvgs[i] = lastAvg
      seriesCollections.push(series)
      labels.push(i + '')
    }
    chart2.data.labels = labels
    chart2.data.datasets[0].data = lastAvgs
    chart2.update()
  }
}

const f2 = gui.addFolder('f2')
f2.add(controls2, 'p', 0, 1, 0.01).onChange(function () {
  controls2.update()
})
f2.add(controls2, 'd', 0, 5, 0.1).onChange(function () {
  controls2.update()
})
// f2.add(controls2, 'posPercent', 0, 1, 0.01).onChange(function () {
//   controls2.update()
// })