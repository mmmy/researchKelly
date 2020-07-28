Chart.defaults.global.animation.duration = 0
// const ctx = document.getElementById('chart1')
const infoSpan = document.getElementById('info')

const chart1 = new Chart(document.getElementById('chart1'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: [],

      fill: false,
      pointRadius: 3,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.3)'
    }]
  },
  options: {
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'P'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'bestPos'
        }
      }]
    }
  }
})
const chart2 = new Chart(document.getElementById('chart2'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: [],

      fill: false,
      pointRadius: 3,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.3)'
    }]
  },
  options: {
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'd'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'bestPos'
        }
      }]
    }
  }
})
const chart3 = new Chart(document.getElementById('chart3'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: [],

      fill: false,
      pointRadius: 3,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.3)'
    }]
  },
  options: {
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'lossPercent'
        }
      }],
      yAxes: [{
        display: true,
        ticks: {
          min: -1,
          max: 20,
        },
        scaleLabel: {
          display: true,
          labelString: 'bestPos'
        }
      }]
    }
  }
})

const getBestPos = (p, d, lossPercent) => p / lossPercent - (1 - p) / (lossPercent * d)

function createCurveData(p, d, lossPercent) {
  const dLen = 100
  const pData = { data: [], labels: [] }
  for (let i = 0; i < 100; i++) {
    const pX = i / 100
    pData.labels[i] = pX + ''
    pData.data[i] = getBestPos(pX, d, lossPercent)
  }
  const dData = { data: [], labels: [] }
  const maxD = 10
  for (let i = 0; i < 100; i++) {
    const dX = (maxD / 100) * i
    dData.labels[i] = dX + ''
    dData.data[i] = getBestPos(p, dX, lossPercent)
  }
  const maxLP = 1
  const lpData = { data: [], labels: [] }
  for (let i = 0; i < 100; i++) {
    const lpX = (maxLP / 100) * i
    lpData.labels[i] = lpX + ''
    lpData.data[i] = getBestPos(p, d, lpX)
  }
  return {
    pData,
    dData,
    lpData
  }
}

const gui = new dat.GUI()
const controls = {
  len: 100,
  p: 0.5,
  d: 2,
  lossPercent: 0.1,
  update: function () {
    const bestPos = getBestPos(this.p, this.d, this.lossPercent)
    infoSpan.innerText = 'best = ' + bestPos
    const allData = createCurveData(this.p, this.d, this.lossPercent)
    chart1.data.labels = allData.pData.labels
    chart1.data.datasets[0].data = allData.pData.data
    chart1.update()

    chart2.data.labels = allData.dData.labels
    chart2.data.datasets[0].data = allData.dData.data
    chart2.update()

    chart3.data.labels = allData.lpData.labels
    chart3.data.datasets[0].data = allData.lpData.data
    chart3.update()
  }
}
const f1 = gui.addFolder('f1')
f1.add(controls, 'p', 0, 1, 0.01).onChange(function () {
  controls.update()
})
f1.add(controls, 'd', 0, 10, 0.1).onChange(function () {
  controls.update()
})
f1.add(controls, 'lossPercent', 0, 1, 0.01).onChange(function () {
  controls.update()
})