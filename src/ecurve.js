// Returns a^b % n
function fastExp(a, b, n) {
	var d = 1n;
	while (b > 1n) {
		if (b & 1n) d = (d * a) % n;
		a = (a * a) % n;
		b >>= 1n;
	}
	return (d * a) % n;
};

// Returns x % n strictly in the range [0, n-1]
function safeMod(x, n) {
	x %= n;
	if (x < 0n) x += n;
	return x;
};

// Returns x^(-1) mod curve.p
function safeInverse(x, curve) {
	return fastExp(safeMod(x, curve.p), curve.pInvPower, curve.p);
};

class EllipticCurvePoint {
	constructor(x, y, isInfinity = false) {
		this.x = x;
		this.y = y;
		this.isInfinity = isInfinity;
	}
}

// Return a new JSON object replacing BigInt fields with strings
// This object is safe to serialise with socket.io
function encodePoint(p) {
	return {x: p.x.toString(), y: p.y.toString(), isInfinity: this.isInfinity};
}

// Return a new EllipticCurvePoint from a received socket.io-safe JSON object
function decodePoint(obj) {
	return new EllipticCurvePoint(BigInt(obj.x), BigInt(obj.y), obj.isInfinity);
}

class EllipticCurve {
	constructor(p, a, b, basePoint, groupSize) {
		this.p = p;
		this.pInvPower = p - 2n;
		this.a = a;
		this.b = b;
		this.basePoint = basePoint;
		this.groupSize = groupSize;
	}

	// Returns p0 + p1 in this elliptic curve group
	addPoints(p0, p1) {
		if (p0.isInfinity) return new EllipticCurvePoint(p1.x, p1.y);
		if (p1.isInfinity) return new EllipticCurvePoint(p0.x, p0.y);
		if (p0.x == p1.x && p0.y == this.p - p1.y) return new EllipticCurvePoint(0n, 0n, true); // Point at infinity
		var slope;
		if (p0.x == p1.x && p0.y == p1.y) slope = safeMod(3n * p0.x * p0.x + this.a, this.p) * safeInverse(2n * p0.y, this);
		else slope = safeMod(p1.y - p0.y, this.p) * safeInverse(p1.x - p0.x, this);
		var xx = safeMod(slope * slope - p0.x - p1.x, this.p);
		var yy = safeMod(slope * (p0.x - xx) - p0.y, this.p);
		return new EllipticCurvePoint(xx, yy);
	}

	// Returns p added to itself k times in this elliptic curve group
	scalePoint(p, k) {
		var result = new EllipticCurvePoint(0n, 0n, true);
		var temp = new EllipticCurvePoint(p.x, p.y);
		while (k > 0n) {
			if (k & 1n) result = this.addPoints(result, temp);
			temp = this.addPoints(temp, temp);
			k >>= 1n;
		}
		return result;
	}
}

const CURVES = {
	"brainpoolP160r1": new EllipticCurve(
		0xe95e4a5f737059dc60dfc7ad95b3d8139515620fn,
		0x340e7be2a280eb74e2be61bada745d97e8f7c300n,
		0n,
		new EllipticCurvePoint(0xbed5af16ea3f6a4f62938c4631eb5af7bdbcdbc3n, 0x1667cb477a1a8ec338f94741669c976316da6321n),
		0xe95e4a5f737059dc60df5991d45029409e60fc09n
	),
	"prime192v1": new EllipticCurve(
		0xfffffffffffffffffffffffffffffffeffffffffffffffffn,
		0xfffffffffffffffffffffffffffffffefffffffffffffffcn,
		0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1n,
		new EllipticCurvePoint(0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012n, 0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811n),
		0xffffffffffffffffffffffff99def836146bc9b1b4d22831n
	),
	"prime256v1": new EllipticCurve(
		0xffffffff00000001000000000000000000000000ffffffffffffffffffffffffn,
		0xffffffff00000001000000000000000000000000fffffffffffffffffffffffcn,
		0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604bn,
		new EllipticCurvePoint(0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296n, 0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5n),
		0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551n
	),
	"ansip384r1": new EllipticCurve(
		0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffffn,
		0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffcn,
		0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aefn,
		new EllipticCurvePoint(0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7n, 0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5fn),
		0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973n
	)
};

// Both endpoints should have one of these objects, using the same EllipticCurve object (field "curve") to exchange the shared secret
class KeyPair {
	// Initialises two fields:
	//		"privateKey": a random big integer in range [1, curve.groupSize - 1]
	//		"publicKey": privateKey * curve.basePoint
	// publicKey can be shared on an insecure channel and combined with the other user's private key to calculate the shared secret
	constructor(curve) {
		this.curve = curve;
		this.sharedSecret = null;
		var multiplier = "";
		var groupSizeDigits = (curve.groupSize - 1n).toString().length;
		while (multiplier.length < groupSizeDigits) {
			multiplier += Math.random().toString().split(".")[1];
		}
		multiplier = multiplier.slice(0, groupSizeDigits);
		var divisor = BigInt("1" + "0".repeat(groupSizeDigits));
		this.privateKey = ((curve.groupSize - 1n) * BigInt(multiplier)) / divisor + 1n;
		this.publicKey = curve.scalePoint(curve.basePoint, this.privateKey);
	}

	// Calculate and return the shared secret using this endpoint's private key and the other endpoint's public key
	calculateSharedSecret(publicKeyOther) {
		this.sharedSecret = this.curve.scalePoint(publicKeyOther, this.privateKey).x;
		return this.sharedSecret;
	}
}

module.exports = {
	EllipticCurvePoint,
	EllipticCurve,
	KeyPair,
	encodePoint,
	decodePoint,
	CURVES
};