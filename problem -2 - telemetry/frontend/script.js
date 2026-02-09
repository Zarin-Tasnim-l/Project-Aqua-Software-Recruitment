const API = "http://localhost:3000/api/telemetry/latest";
const api_url = "http://localhost:3000/api/telemetry/latest"

const values_div = document.getElementById("values")
const status_span = document.getElementById("status")

const chart_context = document.getElementById("depthChart").getContext("2d")

const chart_data =
{
  labels: [],
  datasets:
  [
    {
      label: "Depth (m)",
      data: [],
      borderWidth: 2
    }
  ]
}

const depth_chart = new Chart(chart_context,
{
  type: "line",
  data: chart_data,
  options:
  {
    responsive: false
  }
})

async function fetch_telemetry()
{
  try
  {
    const response = await fetch(api_url)
    const data = await response.json()

    if (!data || typeof data.pressure !== "number")
    {
      status_span.textContent = "No data yet"
      status_span.className = ""
      return
    }

    values_div.innerHTML = `
      Depth: ${data.depth} m<br>
      Pressure: ${data.pressure} bar<br>
      Temperature: ${data.temperature} °C<br>
      Direction: ${data.direction}°
    `

    status_span.className = ""

    if (data.pressure < 1.8)
    {
      status_span.textContent = "NORMAL"
      status_span.classList.add("normal")
    }
    else if (data.pressure <= 2.0)
    {
      status_span.textContent = "WARNING"
      status_span.classList.add("warning")
    }
    else
    {
      status_span.textContent = "CRITICAL"
      status_span.classList.add("critical")
    }

    chart_data.labels.push(data.timestamp)
    chart_data.datasets[0].data.push(data.depth)

    if (chart_data.labels.length > 20)
    {
      chart_data.labels.shift()
      chart_data.datasets[0].data.shift()
    }

    depth_chart.update()
  }
  catch (error)
  {
    console.error("Fetch error:", error)
  }
}

setInterval(fetch_telemetry, 5000)
