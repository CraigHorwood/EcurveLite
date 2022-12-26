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

const BRAINPOOLP160R1 = new EllipticCurve(
	0xe95e4a5f737059dc60dfc7ad95b3d8139515620fn,
	0x340e7be2a280eb74e2be61bada745d97e8f7c300n,
	0n,
	new EllipticCurvePoint(0xbed5af16ea3f6a4f62938c4631eb5af7bdbcdbc3n, 0x1667cb477a1a8ec338f94741669c976316da6321n),
	0xe95e4a5f737059dc60df5991d45029409e60fc09n
);

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
	BRAINPOOLP160R1
};