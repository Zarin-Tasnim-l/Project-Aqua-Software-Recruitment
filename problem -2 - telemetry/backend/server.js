const http = require("http")
const url = require("url")
const fs = require("fs")
const path = require("path")

const port = 3000

const data_path = path.join(__dirname, "sensor_data_500.json")
const sensor_data = JSON.parse(fs.readFileSync(data_path, "utf-8"))

let telemetry_buffer = []
let current_index = 0

function send_json(res, status_code, data)
{
  res.writeHead(status_code,
  {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  })
  res.end(JSON.stringify(data))
}

function is_valid_telemetry(t)
{
  return (
    typeof t.depth === "number" &&
    typeof t.pressure === "number" &&
    typeof t.temperature === "number" &&
    typeof t.direction === "number" &&
    typeof t.timestamp === "string"
  )
}

const first_entry = sensor_data[0]

if (is_valid_telemetry(first_entry))
{
  telemetry_buffer.push(first_entry)
}

current_index = 1

setInterval(() =>
{
  const entry = sensor_data[current_index]

  if (is_valid_telemetry(entry))
  {
    telemetry_buffer.push(entry)

    if (telemetry_buffer.length > 100)
    {
      telemetry_buffer.shift()
    }
  }

  current_index = (current_index + 1) % sensor_data.length
}, 5000)

const server = http.createServer((req, res) =>
{
  const parsed_url = url.parse(req.url, true)
  const method = req.method

  if (method === "OPTIONS")
  {
    res.writeHead(204,
    {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type"
    })
    return res.end()
  }

  if (method === "POST" && parsed_url.pathname === "/api/telemetry")
  {
    let body = ""

    req.on("data", chunk =>
    {
      body += chunk.toString()
    })

    req.on("end", () =>
    {
      try
      {
        const data = JSON.parse(body)

        if (!is_valid_telemetry(data))
        {
          return send_json(res, 400, { error: "Invalid telemetry payload" })
        }

        telemetry_buffer.push(data)

        if (telemetry_buffer.length > 100)
        {
          telemetry_buffer.shift()
        }

        send_json(res, 201, { message: "Telemetry stored" })
      }
      catch (error)
      {
        send_json(res, 400, { error: "Malformed JSON" })
      }
    })

    return
  }

  if (method === "GET" && parsed_url.pathname === "/api/telemetry/latest")
  {
    const latest = telemetry_buffer[telemetry_buffer.length - 1]
    return send_json(res, 200, latest || {})
  }

  if (method === "GET" && parsed_url.pathname === "/api/telemetry/history")
  {
    const limit = parseInt(parsed_url.query.limit || "10", 10)
    const history = telemetry_buffer.slice(-limit)
    return send_json(res, 200, history)
  }

  if (method === "GET" && parsed_url.pathname === "/latest")
  {
    const latest = telemetry_buffer[telemetry_buffer.length - 1]
    return send_json(res, 200, latest || {})
  }

  if (method === "GET" && parsed_url.pathname === "/")
  {
    const frontend_path = path.join(__dirname, "../frontend/index.html")

    fs.readFile(frontend_path, (error, content) =>
    {
      if (error)
      {
        send_json(res, 404, { error: "Frontend not found" })
      }
      else
      {
        res.writeHead(200, { "Content-Type": "text/html" })
        res.end(content)
      }
    })

    return
  }

  send_json(res, 404, { error: "Route not found" })
})

server.listen(port, () =>
{
  console.log(`Telemetry server running on http://localhost:${port}`)
  console.log(`Dashboard available at http://localhost:${port}`)
})
