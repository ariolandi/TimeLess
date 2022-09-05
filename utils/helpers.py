def hash(data, salt):
    import hashlib
    return hashlib.pbkdf2_hmac(
        'sha256',
        data.encode(),
        salt.encode(),
        10000
    ).hex()


def read_user_data():
    import getpass
    username = input('Username: ')
    password = getpass.getpass('Password: ')
    return username, password
