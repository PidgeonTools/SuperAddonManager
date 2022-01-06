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
        dirlist = dirlist[:]

        dirs = {}

        while dirlist:
            dir = dirlist.pop(0)

            if dir.endswith("/"):
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
            return greatest_common_subpath, self._flatten_list(input_object)

        for key in input_object.keys():
            el = input_object[key]
            if type(el) == dict:
                new_try = self._get_recursive_dirs(
                    el, search_file, greatest_common_subpath + key)
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
