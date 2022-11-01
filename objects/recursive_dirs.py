class RecursiveDirs:
    """This class brings a flat list into a nested structure.
    With get_recursive_dirs, the list is filtered to only contain
    the files of an addon. This class is used for getting all files
    that need to be extracted to the temporary directory"""

    def __init__(self, dirlist, search_file="__init__.py") -> None:
        self.directory_structure = self._make_recursive_dirs(dirlist)
        self.extract_files = self._get_recursive_dirs(
            self.directory_structure, search_file)

    def _make_recursive_dirs(self, dirlist, dirname="") -> list:
        dirlist: list = dirlist[:]

        dirs = {}

        while dirlist:
            dir: str = dirlist.pop(0)

            # Determine, whether the current file or directory belongs to a directory, that hasn't been added yet.
            dirname_missing: bool = len(
                dir.replace(dirname, "").split("/")) > 1 and not dir.endswith("/")

            if dirname_missing:
                dirlist.append(dir)

                # Set dir to the path of the topmost directory that hasn't been added yet.
                # Example: dirname = ""; dir = "a/s/d.py" will result in dir being set to "a/"
                dir = dirname + dir.replace(dirname, "").split("/")[0] + "/"

            if dir.endswith("/") or dirname_missing:
                new_dirlist = []
                index = 0
                while index < len(dirlist):
                    if dirlist[index].startswith(dir):
                        new_dirlist.append(dirlist.pop(index))
                    else:
                        index += 1
                dirs[dir] = dir
                dirs[dir.replace(dirname, "")] = self._make_recursive_dirs(
                    new_dirlist, dir)
            else:
                dirs[dir.replace(dirname, "")] = dir

        return dirs

    def _get_recursive_dirs(self, input_object: dict, search_file: str, greatest_common_subpath=""):
        if search_file in input_object.keys():
            # Make sure the greatest common subpath doesn't appear in the addon list.
            # This might happen sometimes, if the original dirlist looks like this: ["a/__init__.py", "a/"] (directory after file)
            addon_list = [p for p in self._flatten_list(
                input_object) if p != greatest_common_subpath]
            return greatest_common_subpath, addon_list

        for key, value in input_object.items():
            if type(value) == dict:
                new_try = self._get_recursive_dirs(
                    value, search_file, greatest_common_subpath + key)
                if new_try[1] != []:
                    return new_try

        return "", []

    def _flatten_list(self, input_object: dict):
        final_list = []
        for el in input_object.values():
            if type(el) == dict:
                final_list.extend(self._flatten_list(el))
            else:
                final_list.append(el)
        return final_list
