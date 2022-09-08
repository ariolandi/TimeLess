from models.user import User
import unittest


class TestUser(unittest.TestCase):
    def setUp(self):
        self.user = User('test_user', 'test_password')
 
    def test_eq(self):
        other = User('test_user', 'test_password')
        self.assertTrue(self.user == other)

    def test_repr(self):
        self.assertEqual(str(self.user), 'test_user')


if __name__ == '__main__':
    unittest.main()
