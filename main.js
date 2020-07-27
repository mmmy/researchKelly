Chart.defaults.global.animation.duration = 0
const ctx = document.getElementById('chart1')

const chart1 = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: [],
      fill: false,
      pointRadius: 0,
    }]
  },
})


function createLineData(len, p, d, posPercent, lossPercent) {
  lossPercent = lossPercent || 0.01
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

const gui = new dat.GUI()
const controls = {
  len: 1000,
  p: 0.5,
  d: 2,
  posPercent: 0.5,
  update: function () {
    const lineData = createLineData(this.len, this.p, this.d, this.posPercent)
    chart1.data.datasets[0].data = lineData.list
    chart1.data.labels = lineData.labels
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
