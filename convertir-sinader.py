import json
import math

import openpyxl


INPUT = "gi-sinader-2024-ckan (1).xlsx"
GEOJSON_OUTPUT = "sinader-2024.geojson"
JS_OUTPUT = "sinader-data.js"
REGION_NAMES = {
    "Aysén del Gral. Carlos Ibañez del Campo": "Aysén del General Carlos Ibáñez del Campo",
    "Libertador Gral. Bernardo O'Higgins": "Libertador General Bernardo O'Higgins",
}

sheet = openpyxl.load_workbook(INPUT, read_only=True, data_only=True)["Datos"]
rows = sheet.iter_rows(values_only=True)
headers = list(next(rows))
indexes = {name: headers.index(name) for name in (
    "id_vu", "razon_social", "rut_razon_social", "nombre_establecimiento",
    "rubro", "region", "provincia", "comuna", "codigo_unico_territorial",
    "latitud", "longitud", "rol_establecimiento", "declaracion_id",
    "cantidad_toneladas",
)}

establishments = {}
invalid_coordinates = 0
valid_rows = 0
valid_tonnes = 0

for row in rows:
    try:
        lat = float(str(row[indexes["latitud"]]).replace(",", "."))
        lon = float(str(row[indexes["longitud"]]).replace(",", "."))
        if not (math.isfinite(lat) and math.isfinite(lon) and -90 <= lat <= 90 and -180 <= lon <= 180):
            raise ValueError
    except (TypeError, ValueError):
        invalid_coordinates += 1
        continue

    key = (row[indexes["id_vu"]], lon, lat)
    if key not in establishments:
        establishments[key] = {
            "properties": {
                "ano": row[0],
                "id_vu": row[indexes["id_vu"]],
                "razon_social": row[indexes["razon_social"]],
                "rut_razon_social": row[indexes["rut_razon_social"]],
                "nombre_establecimiento": row[indexes["nombre_establecimiento"]],
                "rubro": row[indexes["rubro"]],
                "region": REGION_NAMES.get(row[indexes["region"]], row[indexes["region"]]),
                "provincia": row[indexes["provincia"]],
                "comuna": row[indexes["comuna"]],
                "codigo_unico_territorial": row[indexes["codigo_unico_territorial"]],
                "rol_establecimiento": row[indexes["rol_establecimiento"]],
                "cantidad_toneladas": 0,
                "registros": 0,
            },
            "declaraciones": set(),
            "coordinates": [lon, lat],
        }

    item = establishments[key]
    tonnes = float(row[indexes["cantidad_toneladas"]] or 0)
    item["properties"]["cantidad_toneladas"] += tonnes
    item["properties"]["registros"] += 1
    valid_rows += 1
    valid_tonnes += tonnes
    declaration = row[indexes["declaracion_id"]]
    if declaration is not None:
        item["declaraciones"].add(declaration)

features = []
for item in establishments.values():
    item["properties"]["cantidad_toneladas"] = round(item["properties"]["cantidad_toneladas"], 6)
    item["properties"]["declaraciones"] = len(item["declaraciones"])
    features.append({
        "type": "Feature",
        "properties": item["properties"],
        "geometry": {"type": "Point", "coordinates": item["coordinates"]},
    })

geojson = {"type": "FeatureCollection", "features": features}
payload = json.dumps(geojson, ensure_ascii=False, separators=(",", ":"))
with open(GEOJSON_OUTPUT, "w", encoding="utf-8") as output:
    output.write(payload)
with open(JS_OUTPUT, "w", encoding="utf-8") as output:
    output.write("window.SINADER_GEOJSON = " + payload + ";\n")

assert all(feature["geometry"]["type"] == "Point" for feature in features)
assert sum(feature["properties"]["registros"] for feature in features) == valid_rows
assert math.isclose(sum(feature["properties"]["cantidad_toneladas"] for feature in features), valid_tonnes, abs_tol=0.01)
print(f"{len(features)} establecimientos exportados; {invalid_coordinates} filas omitidas por coordenadas inválidas.")
