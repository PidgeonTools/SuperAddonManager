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

from objects.recursive_dirs import RecursiveDirs


class TestRecursiveDirs(unittest.TestCase):
    def setUp(self):
        self.object = RecursiveDirs(["a/b.txt"])

    def test_init(self):
        dirs1 = RecursiveDirs(["a/__init__.py", "a/"])
        self.assertEqual(dirs1.directory_structure, {
                         "a": {"__init__.py": "__init__.py"}})
        self.assertEqual(dirs1.extract_files, ["a/__init__.py"])
        self.assertEqual(dirs1.remove_subpath, "a/")

        # TODO: Write a test for nested folders without additional files
        # TODO: like test/empty/folder/file.txt
        ...

    def test_make_recursive_dirs(self):
        ...

    def test_search_addon_files(self):
        ...

    def test_flatten_dir_list(self):
        flatten_dir_list = self.object._flatten_dir_list

        directory = {
            "dir1": {
                "dir2": {
                    "file1": "file1",
                    "file2": "file2"
                },
                "file3": "file3"
            },
            "dir3": {
                "file4": "file4"
            },
            "file5": "file5"
        }

        self.assertEqual(flatten_dir_list(directory), [
            "dir1/",
            "dir1/dir2/",
            "dir1/dir2/file1",
            "dir1/dir2/file2",
            "dir1/file3",
            "dir3/",
            "dir3/file4",
            "file5",
        ])

        self.assertEqual(flatten_dir_list(directory, "prefix/"), [
            "prefix/dir1/",
            "prefix/dir1/dir2/",
            "prefix/dir1/dir2/file1",
            "prefix/dir1/dir2/file2",
            "prefix/dir1/file3",
            "prefix/dir3/",
            "prefix/dir3/file4",
            "prefix/file5",
        ])

        self.assertEqual(flatten_dir_list(directory, "prefix"), [
            "prefix/dir1/",
            "prefix/dir1/dir2/",
            "prefix/dir1/dir2/file1",
            "prefix/dir1/dir2/file2",
            "prefix/dir1/file3",
            "prefix/dir3/",
            "prefix/dir3/file4",
            "prefix/file5",
        ])

        self.assertEqual(flatten_dir_list({}), [])
        self.assertEqual(flatten_dir_list({}, "prefix"), [])

        directory = {"test": {"not_a_file": 42}}
        with self.assertRaises(TypeError):
            flatten_dir_list(directory)

        directory = {"test": {"other": "other"}, "not_a_file": 42}
        with self.assertRaises(TypeError):
            flatten_dir_list(directory)

    def test_set_recursive_item(self):
        sri = self.object._set_recursive_item

        self.assertEqual(sri({}, "Test", ["test", "sub"]), {
                         "test": {"sub": "Test"}})
        self.assertEqual(sri({}, 42, ["test", "sub"]), {
                         "test": {"sub": 42}})
        self.assertEqual(sri({}, {"sub": [42, 0, 0]}, ["test", "sub"]), {
                         "test": {"sub": {"sub": [42, 0, 0]}}})

        self.assertEqual(sri({"test": 42}, "Test", ["test", "sub"]), {
                         "test": {"sub": "Test"}})

        self.assertEqual(sri({"test": {"other": "untouched"}}, "Test", ["test", "sub"]), {
                         "test": {"sub": "Test", "other": "untouched"}})

        # Test, if the function modifies the passed keys variable.
        # Should fail if that's the case.
        keys = ["test", "other"]
        self.assertEqual(
            sri({}, "42", keys), {"test": {"other": "42"}})
        self.assertEqual(
            sri({}, "42", keys), {"test": {"other": "42"}})

    def test_get_recursive_item(self):
        gri = self.object._get_recursive_item

        self.assertEqual(
            gri({"test": {"sub": "Test"}}, ["test", "sub"]), "Test")
        self.assertEqual(
            gri({"test": {"sub": 42}}, ["test", "sub"]), 42)
        self.assertEqual(
            gri({"test": {"sub": {}}}, ["test", "sub"]), {})

        self.assertEqual(
            gri({"test": {}}, ["test", "sub"]), None)

        self.assertEqual(
            gri({"test": {}}, ["test", "sub"], 42), 42)

        self.assertEqual(
            gri({"test": 42}, ["test", "sub"]), None)

        self.assertEqual(
            gri({}, ["test", "sub"]), None)

        # Test, if the function modifies the passed keys variable.
        # Should fail if that's the case.
        keys = ["test", "other"]
        self.assertEqual(
            gri({"test": {"other": "42"}, "other": "Not42"}, keys), "42")
        self.assertEqual(
            gri({"test": {"other": "42"}, "other": "Not42"}, keys), "42")


def main():
    unittest.main()


if __name__ == "__main__":
    main()
