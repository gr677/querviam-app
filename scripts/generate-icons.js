import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makePng(width, height, isMaskable = false) {
  const bytesPerPixel = 4;
  const rawData = Buffer.alloc(height * (1 + width * bytesPerPixel));
  let offset = 0;

  // Colors
  const bgGreen = [0x00, 0x84, 0x50, 0xff];
  const darkGreen = [0x00, 0x6b, 0x40, 0xff];
  const white = [0xff, 0xff, 0xff, 0xff];

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte 0
    const ny = (y / height) * 100;
    for (let x = 0; x < width; x++) {
      const nx = (x / width) * 100;
      
      // Determine if pixel is inside logo or background
      // For maskable, full bleed green with logo inside safe zone (20 to 80)
      // For standard, rounded rect (rx 22)
      let r = bgGreen[0], g = bgGreen[1], b = bgGreen[2], a = bgGreen[3];

      if (!isMaskable) {
        // Rounded corners
        const cornerR = 20;
        let inCorner = false;
        if (nx < cornerR && ny < cornerR) {
          if (Math.hypot(nx - cornerR, ny - cornerR) > cornerR) inCorner = true;
        } else if (nx > 100 - cornerR && ny < cornerR) {
          if (Math.hypot(nx - (100 - cornerR), ny - cornerR) > cornerR) inCorner = true;
        } else if (nx < cornerR && ny > 100 - cornerR) {
          if (Math.hypot(nx - cornerR, ny - (100 - cornerR)) > cornerR) inCorner = true;
        } else if (nx > 100 - cornerR && ny > 100 - cornerR) {
          if (Math.hypot(nx - (100 - cornerR), ny - (100 - cornerR)) > cornerR) inCorner = true;
        }
        if (inCorner) {
          a = 0;
        }
      }

      // Draw stylized speech / ear waves
      // Wave 1: arc around center (50, 48)
      const d1 = Math.hypot(nx - 38, ny - 48);
      const d2 = Math.hypot(nx - 38, ny - 48);
      const d3 = Math.hypot(nx - 38, ny - 48);

      if (a > 0) {
        // Ear/head outline
        if ((Math.abs(d1 - 18) < 3.2 && nx >= 38 && ny >= 28 && ny <= 68) ||
            (Math.abs(d2 - 28) < 3.2 && nx >= 44 && ny >= 22 && ny <= 74) ||
            (nx > 26 && nx < 32 && ny > 32 && ny < 66)) {
          r = white[0]; g = white[1]; b = white[2];
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

const publicDir = path.resolve('public');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), makePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), makePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), makePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), makePng(180, 180, false));
console.log('PWA PNG Icons successfully generated in public/ !');
