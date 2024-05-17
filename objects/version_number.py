import typing


class VersionNumber:
    def __init__(self, version_number: typing.Union[list, tuple, str, int, float, 'VersionNumber']) -> None:
        if type(version_number) == VersionNumber:
            version_number = version_number.version_number

        if type(version_number) == str:
            version_number = list(version_number.split("."))

        if type(version_number) == int or type(version_number) == float:
            version_number = [int(version_number)]

        version_number = list(map(self.to_int, version_number))
        self.version_number: tuple = tuple(
            self._ensure_positive_numbers(version_number))

    def _ensure_positive_numbers(self, num_list: list) -> list:
        for i, num in enumerate(num_list):
            if num < 0:
                num_list[i] = 0
                return num_list[:i + 1]

        return num_list

    def __eq__(self, __other: object) -> bool:
        if __other == None:
            return False

        for current, other in self.prepare_comparison(__other):
            if current != other:
                return False

        return True

    def __gt__(self, __other: object) -> bool:
        for current, other in self.prepare_comparison(__other):
            if current > other:
                return True

        return False

    def __ge__(self, __other: object) -> bool:
        return self.__gt__(__other) or self.__eq__(__other)

    def __lt__(self, __other: object) -> bool:
        for current, other in self.prepare_comparison(__other):
            if current > other:
                return False

            if current < other:
                return True

        return False

    def __le__(self, __other: object) -> bool:
        return self.__lt__(__other) or self.__eq__(__other)

    def __str__(self) -> str:
        return ".".join(map(str, self.version_number))

    def prepare_comparison(self, __other: object) -> zip:
        """Prepare the comparison of two version numbers by ensuring they have the same length.

        Args:
            __other (VersionNumber): The version number the current version should be compared to.

        Returns:
            zip: The version tuples of both versions zipped up for iterating over both versions.
        """
        first: tuple = self.version_number
        second: tuple = __other.version_number

        length_difference = len(first) - len(second)

        if length_difference == 0:
            return zip(first, second)

        if length_difference > 0:
            return zip(first, self.pad_tuple(second, len(first)))

        if length_difference < 0:
            return zip(self.pad_tuple(first, len(second)), second)

    def pad_tuple(self, t: tuple, length: int) -> tuple:
        """Pad a tuple to have a certain length.

        Args:
            t (tuple): The tuple that shall be padded.
            length (int): The length of the padded tuple.

        Returns:
            tuple: The padded tuple.
        """
        if length < 0:
            return ()

        length_difference: int = length - len(t)

        if length_difference < 0:
            return t[:length]

        return t + (0,) * length_difference

    def to_int(self, x):
        """Convert a given value to an integer, if possible. Raise a ValueError, if the conversion is not possible."""

        allowed_types = [int, float, str]
        if type(x) in allowed_types:
            return int(x)

        raise ValueError


def main():
    v = VersionNumber("2.83.2")
    v2 = VersionNumber(v)

    pass


if __name__ == "__main__":
    main()
