import bpy
from bpy.types import Context
from .. import prefs


def expand_all(self, context: Context):
    ''' Property callback to expand all categories in the preferences when searching '''
    for category in list(prefs.filtered_categories):
        prefs.filtered_categories[category] = False

    if not self.error_search_term:
        return


    for addon in filter(lambda el: filter_search(el, self.error_search_term), prefs.unavailable_addons):
        prefs.filtered_categories[addon["issue_type"]] = True


def filter_search(el, search_term: str) -> bool:
    ''' Function for the filter operation to filter by a given search term '''
    search_term = search_term.lower()
    addon_name = el["addon_name"].lower()
    if search_term in addon_name:
        return True

    return False
