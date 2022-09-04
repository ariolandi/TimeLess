def hash(data, salt):
    import hashlib
    return hashlib.pbkdf2_hmac(
        'sha256',
        data,
        salt,
        10000
    ).hex()
