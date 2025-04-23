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

export default function HexExporter() {
  const [hex, setHex] = useState("");

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

  const handleGenerate = () => {
    const frames = generateDummyFrames();
    const hexData = toIntelHex(frames);
    setHex(hexData);
  };

  const handleDownload = () => {
    const blob = new Blob([hex], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "led_cube_output.hex");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">iCube 3D8S HEX Exporter</h1>
      <button onClick={handleGenerate} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Generate HEX
      </button>
      <button
        onClick={handleDownload}
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={!hex}
      >
        Download .hex
      </button>
      <pre className="mt-4 bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
        {hex || "Click 'Generate HEX' to preview output..."}
      </pre>
    </div>
  );
}

