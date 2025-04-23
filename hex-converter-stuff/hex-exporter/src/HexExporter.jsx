import React, { useState } from "react";
import { saveAs } from "file-saver";

function computeChecksum(byteCount, address, recordType, dataBytes) {
  const addrHigh = (address >> 8) & 0xff;
  const addrLow = address & 0xff;
  const sum = byteCount + addrHigh + addrLow + recordType + dataBytes.reduce((a, b) => a + b, 0);
  return ((~sum + 1) & 0xff);
}

function toIntelHex(frames, startAddress = 0x8000) {
  const lines = [];
  let addr = startAddress;

  for (const frame of frames) {
    const flattened = frame.reduce((acc, plane) => acc.concat(plane.flat()), []);
    const frameBytes = new Uint8Array(64);

    flattened.forEach((bit, i) => {
      if (bit) frameBytes[Math.floor(i / 8)] |= 1 << (7 - (i % 8));
    });

    for (let i = 0; i < 64; i += 16) {
      const chunk = frameBytes.slice(i, i + 16);
      const checksum = computeChecksum(0x10, addr, 0x00, [...chunk]);
      const hexLine =
        ":10" +
        addr.toString(16).padStart(4, "0").toUpperCase() +
        "00" +
        [...chunk].map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join("") +
        checksum.toString(16).padStart(2, "0").toUpperCase();
      lines.push(hexLine);
      addr += 16;
    }
  }
  lines.push(":00000001FF");
  return lines.join("\n");
}

function createAllOffFrame() {
  return Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => Array(8).fill(0))
  );
}

function createAllOnFrame() {
  return Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => Array(8).fill(1))
  );
}

function createHeartFrame() {
  const heart2D = [
    "00011000",
    "00111100",
    "01111110",
    "11111111",
    "11111111",
    "01111110",
    "00111100",
    "00011000"
  ];
  return Array.from({ length: 8 }, (_, z) =>
    heart2D.map(row => row.split('').map(bit => parseInt(bit)))
  );
}

function createSphereFrame(radius = 3.0, center = [3.5, 3.5, 3.5]) {
  const [cx, cy, cz] = center;
  return Array.from({ length: 8 }, (_, x) =>
    Array.from({ length: 8 }, (_, y) =>
      Array.from({ length: 8 }, (_, z) =>
        (x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2 <= radius ** 2 ? 1 : 0
      )
    )
  );
}

function createCubeFrame(size = 4) {
  const offset = Math.floor((8 - size) / 2);
  return Array.from({ length: 8 }, (_, x) =>
    Array.from({ length: 8 }, (_, y) =>
      Array.from({ length: 8 }, (_, z) =>
        x >= offset && x < offset + size &&
        y >= offset && y < offset + size &&
        z >= offset && z < offset + size ? 1 : 0
      )
    )
  );
}

function createPyramidFrame() {
  const frame = createAllOffFrame();
  for (let z = 0; z < 4; z++) {
    for (let y = z; y < 8 - z; y++) {
      for (let x = z; x < 8 - z; x++) {
        frame[x][y][z] = 1;
      }
    }
  }
  return frame;
}

function createWaveFrame(step = 0) {
  return Array.from({ length: 8 }, (_, x) =>
    Array.from({ length: 8 }, (_, y) =>
      Array.from({ length: 8 }, (_, z) => (z === (x + y + step) % 8 ? 1 : 0))
    )
  );
}

function generatePulseFrames(frame, cycles = 4) {
  const result = [];
  for (let i = 1; i <= cycles; i++) {
    const scale = i / cycles;
    const shrunk = frame.map(layer =>
      layer.map(row =>
        row.map(bit => (Math.random() < scale ? bit : 0))
      )
    );
    result.push(shrunk);
  }
  for (let i = cycles - 1; i >= 1; i--) {
    const scale = i / cycles;
    const shrunk = frame.map(layer =>
      layer.map(row =>
        row.map(bit => (Math.random() < scale ? bit : 0))
      )
    );
    result.push(shrunk);
  }
  return result;
}

export default function HexExporter() {
  const [hex, setHex] = useState("");

  const handleGenerate = (type) => {
    let frames = [];
    switch (type) {
      case "on":
        frames = [createAllOnFrame()];
        break;
      case "off":
        frames = [createAllOffFrame()];
        break;
      case "heart":
        frames = [createHeartFrame()];
        break;
      case "sphere":
        frames = [createSphereFrame()];
        break;
      case "cube":
        frames = [createCubeFrame()];
        break;
      case "pyramid":
        frames = [createPyramidFrame()];
        break;
      case "wave":
        frames = Array.from({ length: 8 }, (_, i) => createWaveFrame(i));
        break;
      case "pulse":
        frames = generatePulseFrames(createSphereFrame());
        break;
      default:
        frames = generateDummyFrames();
    }
    const hexData = toIntelHex(frames);
    setHex(hexData);
  };

  function generateDummyFrames(count = 4) {
    const frames = [];
    for (let f = 0; f < count; f++) {
      const frame = Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () =>
          Array.from({ length: 8 }, () => (Math.random() > 0.85 ? 1 : 0))
        )
      );
      frames.push(frame);
    }
    return frames;
  }

  const handleDownload = () => {
    const blob = new Blob([hex], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "led_cube_output.hex");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">iCube 3D8S HEX Exporter</h1>
      <div className="space-x-2 mb-4">
        <button onClick={() => handleGenerate("on")} className="bg-blue-500 text-white px-4 py-2 rounded">All On</button>
        <button onClick={() => handleGenerate("off")} className="bg-blue-500 text-white px-4 py-2 rounded">All Off</button>
        <button onClick={() => handleGenerate("heart")} className="bg-blue-500 text-white px-4 py-2 rounded">Heart</button>
        <button onClick={() => handleGenerate("sphere")} className="bg-blue-500 text-white px-4 py-2 rounded">Sphere</button>
        <button onClick={() => handleGenerate("cube")} className="bg-blue-500 text-white px-4 py-2 rounded">Cube</button>
        <button onClick={() => handleGenerate("pyramid")} className="bg-blue-500 text-white px-4 py-2 rounded">Pyramid</button>
        <button onClick={() => handleGenerate("wave")} className="bg-blue-500 text-white px-4 py-2 rounded">Wave</button>
        <button onClick={() => handleGenerate("pulse")} className="bg-purple-600 text-white px-4 py-2 rounded">Pulse</button>
        <button onClick={() => handleGenerate("random")} className="bg-blue-500 text-white px-4 py-2 rounded">Random</button>
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={!hex}
        >
          Download .hex
        </button>
      </div>
      <pre className="mt-4 bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
        {hex || "Click a shape or animation to generate .hex output..."}
      </pre>
    </div>
  );
}
