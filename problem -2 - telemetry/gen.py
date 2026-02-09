import json
import random
from datetime import datetime, timedelta

base_time = datetime(2026, 1, 27, 10, 0, 0)
data = []

total_points = 500
max_depth = 30.0

# Split phases
down_points = int(total_points * 0.45)
bottom_points = int(total_points * 0.10)
up_points = total_points - down_points - bottom_points

timestamps = [
    base_time + timedelta(seconds=i)
    for i in range(total_points)
]

depths = []

# 1️⃣ Descent
for i in range(down_points):
    depth = (i / down_points) * max_depth
    depths.append(depth)

# 2️⃣ Bottom dwell
for _ in range(bottom_points):
    depths.append(max_depth + random.uniform(-1, 1))

# 3️⃣ Ascent
for i in range(up_points):
    depth = max_depth * (1 - i / up_points)
    depths.append(depth)

# Generate records
for t, depth in zip(timestamps, depths):
    pressure = 1 + depth / 10 + random.uniform(-0.05, 0.05)   # bar
    temperature = 25 - (depth * 0.4) + random.uniform(-0.3, 0.3)

    entry = {
        "timestamp": t.isoformat() + "Z",
        "depth": round(max(depth, 0), 1),
        "pressure": round(min(max(pressure, 1), 4), 2),
        "temperature": round(min(max(temperature, 5), 25), 1),
        "direction": round(random.uniform(0, 360), 1)
    }

    data.append(entry)

with open("sensor_data_500.json", "w") as f:
    json.dump(data, f, indent=2)

print("✔ 500 ROV dive-and-ascent records generated")
