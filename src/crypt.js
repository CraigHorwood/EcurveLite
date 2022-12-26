const S_BOX = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];
const S_BOX_INV = [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
	0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
	0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
	0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
	0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
	0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
	0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
	0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
	0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
	0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
	0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
	0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
	0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
	0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
	0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
];
const HEX_MAP = "0123456789abcdef";

function galoisMultiply(byte0, byte1) {
	var result = 0;
	for (var i = 0; i < 8; i++) {
		if (byte1 & 1) {
			result ^= byte0;
		}
		var bitSet = byte0 & 0x80;
		byte0 = (byte0 << 1) & 0xff;
		if (bitSet) {
			byte0 ^= 0x1b;
		}
		byte1 >>= 1;
	}
	return result & 0xff;
}

// Class for manipulating individual columns of a DataBlock object,
// used in generating the key schedule
class Word {
	constructor (bytes) {
		this.bytes = bytes;
	}

	rotate() {
		const w0 = this.bytes[0];
		this.bytes[0] = this.bytes[1];
		this.bytes[1] = this.bytes[2];
		this.bytes[2] = this.bytes[3];
		this.bytes[3] = w0;
		return this;
	}

	xor(word) {
		for (var i = 0; i < 4; i++) {
			this.bytes[i] ^= word.bytes[i];
		}
		return this;
	}

	sub() {
		for (var i = 0; i < 4; i++) {
			this.bytes[i] = S_BOX[this.bytes[i]];
		}
		return this;
	}
}

const RCON = [
    new Word([1, 0, 0, 0]), new Word([2, 0, 0, 0]), new Word([4, 0, 0, 0]), new Word([8, 0, 0, 0]), new Word([16, 0, 0, 0]),
    new Word([32, 0, 0, 0]), new Word([64, 0, 0, 0]), new Word([128, 0, 0, 0]), new Word([27, 0, 0, 0]), new Word([54, 0, 0, 0])
];

// Block consisting of four 4-byte "words", the primary unit of encryption/decryption
// All forms of data, including the encryption key, are converted into this format
class DataBlock {
	constructor (bytes) {
		this.bytes = bytes
	}

	xor(block) {
		for (var i = 0; i < 16; i++) {
			this.bytes[i] ^= block.bytes[i];
		}
		return this;
	}

	sub() {
		for (var i = 0; i < 16; i++) {
			this.bytes[i] = S_BOX[this.bytes[i]];
		}
		return this;
	}

	shiftRows() {
		var oldBytes = [];
		for (var i = 0; i < 16; i++) {
			oldBytes.push(this.bytes[i]);
		}
		for (var i = 0; i < 16; i++) {
			this.bytes[i] = oldBytes[((i >> 2 << 2) + (i & 3) * 5) & 15]
		}
		return this;
	}

	mixColumns() {
		var oldBytes = [];
		for (var i = 0; i < 16; i++) {
			oldBytes.push(this.bytes[i]);
		}
		for (var i = 0; i < 16; i += 4) {
			this.bytes[i] = galoisMultiply(2, oldBytes[i]) ^ galoisMultiply(3, oldBytes[i + 1]) ^ oldBytes[i + 2] ^ oldBytes[i + 3];
			this.bytes[i + 1] = oldBytes[i] ^ galoisMultiply(2, oldBytes[i + 1]) ^ galoisMultiply(3, oldBytes[i + 2]) ^ oldBytes[i + 3];
			this.bytes[i + 2] = oldBytes[i] ^ oldBytes[i + 1] ^ galoisMultiply(2, oldBytes[i + 2]) ^ galoisMultiply(3, oldBytes[i + 3]);
			this.bytes[i + 3] = galoisMultiply(3, oldBytes[i]) ^ oldBytes[i + 1] ^ oldBytes[i + 2] ^ galoisMultiply(2, oldBytes[i + 3]);
		}
		return this;
	}

	subInverse() {
		for (var i = 0; i < 16; i++) {
			this.bytes[i] = S_BOX_INV[this.bytes[i]];
		}
		return this;
	}

	shiftRowsInverse() {
		var oldBytes = [];
		for (var i = 0; i < 16; i++) {
			oldBytes.push(this.bytes[i]);
		}
		for (var i = 0; i < 16; i++) {
			this.bytes[i] = oldBytes[((i >> 2 << 2) + (i & 3) * 13) & 15];
		}
		return this;
	}

	mixColumnsInverse() {
		var oldBytes = [];
		for (var i = 0; i < 16; i++) {
			oldBytes.push(this.bytes[i]);
		}
		for (var i = 0; i < 16; i += 4) {
			this.bytes[i] = galoisMultiply(14, oldBytes[i]) ^ galoisMultiply(11, oldBytes[i + 1]) ^ galoisMultiply(13, oldBytes[i + 2]) ^ galoisMultiply(9, oldBytes[i + 3]);
			this.bytes[i + 1] = galoisMultiply(9, oldBytes[i]) ^ galoisMultiply(14, oldBytes[i + 1]) ^ galoisMultiply(11, oldBytes[i + 2]) ^ galoisMultiply(13, oldBytes[i + 3]);
			this.bytes[i + 2] = galoisMultiply(13, oldBytes[i]) ^ galoisMultiply(9, oldBytes[i + 1]) ^ galoisMultiply(14, oldBytes[i + 2]) ^ galoisMultiply(11, oldBytes[i + 3]);
			this.bytes[i + 3] = galoisMultiply(11, oldBytes[i]) ^ galoisMultiply(13, oldBytes[i + 1]) ^ galoisMultiply(9, oldBytes[i + 2]) ^ galoisMultiply(14, oldBytes[i + 3]);
		}
		return this;
	}

	// Gets a Word object that can be manipulated independently of this DataBlock.
	// index must be in range [0, 3], for the 0th to 3rd column of this DataBlock
	getWord(index) {
		const offs = index << 2;
		return new Word(this.bytes.slice(offs, offs + 4));
	}
}

// Convert shared secret BigInt to a DataBlock
function getFirstKey(keyInteger) {
	var bytes = [];
	while (keyInteger) {
		bytes.unshift(Number(keyInteger & 0xffn));
		if (bytes.length == 16) {
			return new DataBlock(bytes);
		}
		keyInteger >>= 8n;
	}
	while (bytes.length < 16) {
		bytes.unshift(0);
	}
	return new DataBlock(bytes);
}

// Get the next key in the schedule.
// currentKey is a DataBlock, rc is a Word in the RCON array
// Returns the next key as a DataBlock
function getNextKey(currentKey, rc) {
	var col0 = currentKey.getWord(0);
	var subCol = currentKey.getWord(3);
	subCol.rotate().sub();
	col0.xor(subCol).xor(rc);
	var col1 = currentKey.getWord(1).xor(col0);
	var col2 = currentKey.getWord(2).xor(col1);
	var col3 = currentKey.getWord(3).xor(col2);
	return new DataBlock(col0.bytes.concat(col1.bytes).concat(col2.bytes).concat(col3.bytes));
}

// Container object for encrypted data and associated metadata
// "hex" is a string of hexadecimal digits, "originalLength" is the length of the original unpadded string
class EncryptedData {
	constructor(hex, originalLength) {
		this.hex = hex;
		this.originalLength = originalLength;
	}
}

// Given string "str" and DataBlock "key", returns the encrypted string as a string of hexadecimal digits
function encrypt(str, key) {
	// Convert str into an array of DataBlocks
	var blocks = [];
	const buffer = Buffer.from(str, "utf-8");
	var i = 0;
	while (i < buffer.length) {
		const nextOffs = i + 16;
		var bytes = [];
		if (nextOffs >= buffer.length) {
			// Pad the end of the last block with 00 bytes
			while (i < buffer.length) {
				bytes.push(buffer[i]);
				i++;
			}
			while (bytes.length < 16) {
				bytes.push(0);
			}
		} else {
			while (i < nextOffs) {
				bytes.push(buffer[i]);
				i++;
			}
		}
		blocks.push(new DataBlock(bytes));
	}
	// By this time, i is equal to the original unpadded length in bytes of the input string
	const originalLength = i;
	
	// Encrypt each block
	for (block of blocks) {
		var currentKey = key;
		block.xor(currentKey);
		for (var i = 0; i < 10; i++) {
			currentKey = getNextKey(currentKey, RCON[i]);
			block.sub().shiftRows();
			if (i < 9) {
				block.mixColumns();
			}
			block.xor(currentKey);
		}
	}

	// Convert blocks to an EncryptedData object
	var hex = "";
	for (block of blocks) {
		for (var i = 0; i < 16; i++) {
			var byte = block.bytes[i];
			hex += HEX_MAP[(byte & 0xf0) >> 4];
			hex += HEX_MAP[byte & 0xf];
		}
	}

	return new EncryptedData(hex, originalLength);
}

// Given EncryptedData object "encryptedData" and DataBlock "key", returns the decrypted data as a string
function decrypt(encryptedData, key) {
	// Convert EncryptedData object into an array of DataBlocks
	var blocks = [];
    for (var i = 0; i < encryptedData.hex.length; i += 32) {
        var bytes = [];
        for (var j = i; j < i + 32; j += 2) {
            var byte = 0;
            byte |= HEX_MAP.indexOf(encryptedData.hex[j]) << 4;
            byte |= HEX_MAP.indexOf(encryptedData.hex[j + 1]);
            bytes.push(byte);
        }
        blocks.push(new DataBlock(bytes));
    }

	// Generate all keys in the key schedule so they can be used in reverse order
	var keySchedule = [key];
	for (var i = 0; i < 10; i++) {
		const nextKey = getNextKey(keySchedule[i], RCON[i]);
		keySchedule.push(nextKey);
	}

	// Decrypt each block using the keys
	for (block of blocks) {
		for (var i = 10; i > 0; i--) {
			var currentKey = keySchedule[i];
			block.xor(currentKey);
			if (i < 10) {
				block.mixColumnsInverse();
			}
			block.shiftRowsInverse().subInverse();
		}
		block.xor(keySchedule[0]);
	}

	// Convert the decrypted blocks back into a UTF-8 string
	var fullBytes = [];
	for (block of blocks) {
		fullBytes = fullBytes.concat(block.bytes);
	}
	while (fullBytes.length > encryptedData.originalLength) {
		fullBytes.pop();
	}
	return Buffer.from(fullBytes).toString("utf-8");
}

module.exports = {
	EncryptedData,
	encrypt,
	decrypt,
	getFirstKey
};