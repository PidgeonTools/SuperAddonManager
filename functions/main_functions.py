from .. import prefs


# Callback function to expand all menus in the preferences when searching.
def expand_all(self, context):
    for el in prefs.unavailable_addons:
        setattr(context.scene, el["issue_type"], True)
    pass


# Function for the filter operation to filter by a given search term.
def filter_search(el, search_term):
    search_term = search_term.lower()
    addon_name = el["addon_name"].lower()
    if search_term in addon_name:
        return True

    return False
