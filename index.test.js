const ecl = require("./src/index");

test("Both endpoints should calculate the same shared secret.", () => {
	for (curveName in ecl.CURVES) {
		const curve = ecl.CURVES[curveName];
		const userA = new ecl.KeyPair(curve);
		const userB = new ecl.KeyPair(curve);
		const secretA = userA.calculateSharedSecret(userB.publicKey);
		const secretB = userB.calculateSharedSecret(userA.publicKey);
		expect(secretA).toBe(secretB);
	}
});

test("Input string should be the same after being encrypted then decrypted.", () => {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const strLen = Math.floor(Math.random() * 160) + 16;
	var str = "";
	while (str.length < strLen) {
		str += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	const key = ecl.createKey(BigInt(Math.floor(Math.random() * 1000000000)) * BigInt(Math.floor(Math.random() * 1000000000)), ecl.KEY_SIZE_256);
	const encrypted = ecl.encrypt(str, key);
	const decrypted = ecl.decrypt(encrypted, key);
	expect(decrypted).toBe(str);
});

test("Input number should be the same after being encrypted then decrypted.", () => {
	const rInt = Math.floor(Math.random() * 1000000000) + 1000000000;
	const key = ecl.createKey(BigInt(Math.floor(Math.random() * 1000000000)) * BigInt(Math.floor(Math.random() * 1000000000)), ecl.KEY_SIZE_256);
	const encrypted = ecl.encrypt(rInt, key);
	const decrypted = ecl.decrypt(encrypted, key);
	expect(decrypted).toBe(rInt);
});

test("Input JSON object should be the same after being encrypted then decrypted.", () => {
	const obj = {"a": 0, "b": "string1", "c": [{"d": 1}, {"d": 2}, {"d": 3, "e": "string2"}]};
	const key = ecl.createKey(BigInt(Math.floor(Math.random() * 1000000000)) * BigInt(Math.floor(Math.random() * 1000000000)), ecl.KEY_SIZE_256);
	const encrypted = ecl.encrypt(obj, key);
	const decrypted = ecl.decrypt(encrypted, key);
	expect(decrypted).toEqual(obj);
});

test("Input array should be the same after being encrypted then decrypted.", () => {
	const arr = ["a", "b", "c", "d", "e", "f", "g"];
	const key = ecl.createKey(BigInt(Math.floor(Math.random() * 1000000000)) * BigInt(Math.floor(Math.random() * 1000000000)), ecl.KEY_SIZE_256);
	const encrypted = ecl.encrypt(arr, key);
	const decrypted = ecl.decrypt(encrypted, key);
	expect(decrypted).toEqual(arr);
});