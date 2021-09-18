import json


def decode_json(path):
    try:
        with open(path) as f:
            j = json.load(f)
        return j
    except FileNotFoundError:
        return None


def encode_json(j, path):
    with open(path, "w") as f:
        json.dump(j, f, indent=4)
    return j
