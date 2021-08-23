
def trim_json(json, props_to_remove):
    for prop_name in props_to_remove:
        del json[prop_name]
