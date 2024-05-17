# ##### BEGIN GPL LICENSE BLOCK #####
#
#  <A central Updater for all your Addons>
#    Copyright (C) <2023>  <Blender Defender>
#
#  This program is free software; you can redistribute it and/or
#  modify it under the terms of the GNU General Public License
#  as published by the Free Software Foundation; either version 3
#  of the License, or (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software Foundation,
#  Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
#
# ##### END GPL LICENSE BLOCK #####

import unittest

from os import path as p
import sys
sys.path.append(p.dirname(p.dirname(__file__)))

from objects.version_number import VersionNumber


class TestVersionNumber(unittest.TestCase):

    def setUp(self):
        self.v1 = VersionNumber("1.0.0")
        self.v2 = VersionNumber("1.0.0.0")
        self.v3 = VersionNumber("1.0.1")
        self.v4 = VersionNumber("1.0.0.83")

    def test_init(self):
        with self.assertRaises(TypeError):
            VersionNumber(None)

        with self.assertRaises(ValueError):
            VersionNumber("")

        self.assertEqual(VersionNumber(0).version_number, (0,))
        self.assertEqual(VersionNumber(2.5).version_number, (2,))

        self.assertEqual(VersionNumber("1.0.0").version_number, (1, 0, 0))
        self.assertEqual(VersionNumber((5, 3, 9)).version_number, (5, 3, 9))
        self.assertEqual(VersionNumber(
            [7, 91, 97, 7]).version_number, (7, 91, 97, 7))
        self.assertEqual(VersionNumber((1.2, "8")).version_number, (1, 8))

        self.assertEqual(VersionNumber(self.v1).version_number, (1, 0, 0))

        self.assertEqual(VersionNumber(-42).version_number, (0,))
        self.assertEqual(VersionNumber("-1.0.0").version_number, (0,))
        self.assertEqual(VersionNumber("1.-10.0").version_number, (1, 0,))
        self.assertEqual(VersionNumber([1, -10, -2]).version_number, (1, 0,))

    def test_pad_tuple(self):
        v = VersionNumber("0")
        self.assertEqual(v.pad_tuple((1, 1, 1), 2), (1, 1))
        self.assertEqual(v.pad_tuple((1, 1, 1), 6), (1, 1, 1, 0, 0, 0))
        self.assertEqual(v.pad_tuple((1, 1, 1), -6), ())
        self.assertEqual(v.pad_tuple((1, 1, 1), 0), ())

    def test_to_string(self):
        v = VersionNumber("0")
        self.assertEqual(str(v), "0")
        self.assertEqual(str(self.v1), "1.0.0")
        self.assertEqual(str(self.v2), "1.0.0.0")
        self.assertEqual(str(self.v3), "1.0.1")

    def test_equal(self):
        self.assertEqual(self.v1 == self.v2, True)
        self.assertEqual(self.v1 == self.v3, False)
        self.assertEqual(self.v2 == self.v3, False)
        self.assertEqual(self.v3 == self.v4, False)

        self.assertEqual(self.v1 == None, False)
        self.assertEqual(self.v1 != None, True)

    def test_greater(self):
        self.assertEqual(self.v1 > self.v2, False)
        self.assertEqual(self.v1 > self.v3, False)
        self.assertEqual(self.v2 > self.v3, False)
        self.assertEqual(self.v3 > self.v4, True)

    def test_greater_equals(self):
        self.assertEqual(self.v1 >= self.v2, True)
        self.assertEqual(self.v1 >= self.v3, False)
        self.assertEqual(self.v2 >= self.v3, False)
        self.assertEqual(self.v3 >= self.v4, True)

    def test_less(self):
        self.assertEqual(self.v1 < self.v2, False)
        self.assertEqual(self.v1 < self.v3, True)
        self.assertEqual(self.v2 < self.v3, True)
        self.assertEqual(self.v3 < self.v4, False)

    def test_less_equals(self):
        self.assertEqual(self.v1 <= self.v2, True)
        self.assertEqual(self.v1 <= self.v3, True)
        self.assertEqual(self.v2 <= self.v3, True)
        self.assertEqual(self.v3 <= self.v4, False)


def main():
    unittest.main()


if __name__ == "__main__":
    main()
