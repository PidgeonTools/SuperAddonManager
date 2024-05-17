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

import typing


class RecursiveDirs:
    """This class brings a flat list into a nested structure.
    With get_recursive_dirs, the list is filtered to only contain
    the files of an addon. This class is used for getting all files
    that need to be extracted to the temporary directory"""

    def __init__(self, dirlist: list, search_file: str = "__init__.py") -> None:
        self.extract_files = None
        self.remove_subpath = None

        self.directory_structure = self._make_recursive_dirs(dirlist)

        self._search_addon_files(self.directory_structure, search_file)

    def _make_recursive_dirs(self, dirlist: typing.List[str], dirname="") -> list:
        dirlist: typing.List[str] = dirlist[:]

        dirs = {}

        for d in dirlist:
            keys = d.split("/")

            if not d.endswith("/"):
                file = keys[-1]
                dirs = self._set_recursive_item(dirs, file, keys)
                continue

            keys = keys[:-1]

            if not type(self._get_recursive_item(dirs, keys)) == dict:
                self._set_recursive_item(dirs, {}, keys)
        return dirs

    def _search_addon_files(self, directory: dict, search_file: str, greatest_common_subpath=""):
        if search_file in directory.keys():
            self.remove_subpath = greatest_common_subpath
            self.extract_files = self._flatten_dir_list(
                directory, greatest_common_subpath)
            return

        for key, value in directory.items():
            if type(value) == dict:
                self._search_addon_files(
                    value, search_file, greatest_common_subpath + key + "/")

                if self.remove_subpath != None:
                    return

    def _flatten_dir_list(self, directory: dict, sub_path_prefix: str = "") -> typing.List[str]:
        """Convert a folder structure object into a flat list with a sub-path prefix added to every item.

        Args:
            directory (dict): The folder structure object
            sub_path_prefix (str, optional): The sub-path prefix added to every item in the list. Defaults to "".

        Raises:
            TypeError: Error, if the dictionary is not a valid folder structure object.

        Returns:
            typing.List[str]: The list with folder- and file-paths.
        """

        final_list: typing.List[str] = []

        if sub_path_prefix != "" and not sub_path_prefix.endswith("/"):
            sub_path_prefix += "/"

        for key, value in directory.items():
            if type(value) not in (str, dict):
                raise TypeError(
                    "Only type 'str' and 'dict' allowed when converting a directory dict to a flat list.")

            if type(value) == str:
                final_list.append(sub_path_prefix + value)
                continue

            dir_path = sub_path_prefix + key + "/"

            final_list.append(dir_path)
            final_list.extend(self._flatten_dir_list(
                value, dir_path))

        return final_list

    def _set_recursive_item(self, dictionary: dict, value, keys: typing.List[str]) -> dict:
        """Set an item in a dictionary (and any dictionary inside) recursively.

        Args:
            dictionary (dict): The dictionary in which the value is to be set
            value (any): The value that the dictionary item should be set to.
            keys (typing.List[str]): The key path where the value should be set.

        Returns:
            dict: The updated dictionary.
        """

        k = keys[:]
        key = k.pop(0)

        if len(k) == 0:
            dictionary[key] = value
            return dictionary

        if not type(dictionary.get(key, None)) == dict:
            dictionary[key] = {}

        dictionary[key] = self._set_recursive_item(
            dictionary[key], value, k)
        return dictionary

    def _get_recursive_item(self, dictionary: dict, keys: typing.List[str], default=None):
        """Get an item from a dictionary and any dictionary inside recursively.

        Args:
            dictionary (dict): The dictionary the item should be retreived from.
            keys (typing.List[str]): A list of keys that lead to item
            default (any, optional): The default value that should be returned, if the item cannot be found in the dictionary. Defaults to None.

        Returns:
            any: The item at the specified key path.
        """

        k = keys[:]
        key = k.pop(0)

        if type(dictionary) != dict:
            return default

        if len(k) == 0:
            return dictionary.get(key, default)

        return self._get_recursive_item(dictionary.get(key, {}), k, default)


def main():
    ...


if __name__ == "__main__":
    main()
