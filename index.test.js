const ecl = require("./index");

test("Both endpoints should calculate the same shared secret.", () => {
	const curve = ecl.BRAINPOOLP160R1;
	for (var i = 0; i < 100; i++) {
		var userA = new ecl.KeyPair(curve);
		var userB = new ecl.KeyPair(curve);
		var secretA = userA.calculateSharedSecret(userB.publicKey);
		var secretB = userB.calculateSharedSecret(userA.publicKey);
		expect(secretA).toBe(secretB);
	}
});