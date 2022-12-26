const ecl = require("./src/index");

test("Both endpoints should calculate the same shared secret.", () => {
	const curve = ecl.ecurve.BRAINPOOLP160R1;
	for (var i = 0; i < 10; i++) {
		const userA = new ecl.ecurve.KeyPair(curve);
		const userB = new ecl.ecurve.KeyPair(curve);
		const secretA = userA.calculateSharedSecret(userB.publicKey);
		const secretB = userB.calculateSharedSecret(userA.publicKey);
		expect(secretA).toBe(secretB);
	}
});

test("Input string should be the same after being encrypted then decrypted.", () => {
	const str = "This arbitrarily long string should be the same after going through the encryption and decryption process.";
	const key = ecl.crypt.getFirstKey(BigInt(Math.floor(Math.random() * 1000000000)) * BigInt(Math.floor(Math.random() * 1000000000)));
	const encrypted = ecl.crypt.encrypt(str, key);
	const decrypted = ecl.crypt.decrypt(encrypted, key);
	expect(decrypted).toEqual(str);
});