import os
from os import path as p

import importlib

import unittest


SCRIPT_DIR = p.dirname(__file__)


def main():
    suite = None
    loader = unittest.TestLoader()

    for file in os.listdir(SCRIPT_DIR):
        if p.join(SCRIPT_DIR, file) == __file__:
            continue

        mod = importlib.import_module(p.basename(file).replace(".py", ""))
        if suite == None:
            suite = loader.loadTestsFromModule(mod)
            continue

        suite.addTests(loader.loadTestsFromModule(mod))

    unittest.TextTestRunner(verbosity=2).run(suite)


if __name__ == "__main__":
    main()
