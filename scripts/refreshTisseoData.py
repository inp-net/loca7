#!/usr/bin/env python
from multiprocessing import Pool
from threading import Lock
from collections.abc import Iterable
from typing import Any
from pathlib import Path
from tqdm import tqdm
from subprocess import run
import json

here = Path(__file__).parent

FLOAT_FIELDS = {"stop_lat", "stop_lon"}
INT_FIELDS = set()
ROUTE_TYPE_FIELD_MAP = {
    0: "tram",
    1: "metro",
    2: "train",
    3: "bus",
    4: "ferry",
    5: "cable_car",
    6: "gondola",
    7: "funicular",
    11: "trolleybus",
    12: "monorail",
}
LOCATION_TYPE_FIELD_MAP = {
    0: "stop",
    1: "station",
    2: "entrance",
    3: "generic",
    4: "boarding_area",
}

WHEELCHAIR_BOARDING_FIELD_MAP = {
    0: None,
    1: True,
    2: False,
}


def split_row(row: str) -> Iterable[str]:
    """Split a CSV row into a list of values."""
    in_quotes = False
    current_value = ""
    for char in row:
        if char == '"':
            in_quotes = not in_quotes
        elif char == "," and not in_quotes:
            yield current_value
            current_value = ""
        else:
            current_value += char
    yield current_value


def from_str(key: str, value: str) -> Any:
    if key in FLOAT_FIELDS:
        return float(value)
    if key in INT_FIELDS:
        return int(value)
    if key == "route_type":
        return ROUTE_TYPE_FIELD_MAP[int(value)]
    if key == "location_type":
        return LOCATION_TYPE_FIELD_MAP[int(value)]
    if key == "wheelchair_boarding":
        return WHEELCHAIR_BOARDING_FIELD_MAP[int(value)]
    return value


def to_dict(raw_csv: str) -> list[dict[str, Any]]:
    """Convert a raw CSV string to a dictionary."""
    header = raw_csv.splitlines()[0]
    rows = raw_csv.splitlines()[1:]
    return [
        {
            key: from_str(key, value)
            for key, value in zip(split_row(header), split_row(row))
        }
        for row in rows
    ]


def load_text(filestem: str) -> list[dict[str, str]]:
    """Load all the CSV files into a dictionary."""
    return to_dict(Path(here / (filestem + ".txt")).read_text())


if __name__ == "__main__":
    run(
        [
            "wget",
            "https://data.toulouse-metropole.fr/explore/dataset/tisseo-gtfs/files/fc1dda89077cf37e4f7521760e0ef4e9/download/",
            "-O",
            "tisseo.zip",
        ],
        cwd=here,
    )
    run(["unzip", "-o", "tisseo.zip"], cwd=here)

    run(["rm", "tisseo.zip"], cwd=here)

    print("Loading data...")
    stops = load_text("stops")
    print("\t1/4")
    routes = load_text("routes")
    print("\t2/4")
    trips = load_text("trips")
    print("\t3/4")
    stop_times = load_text("stop_times")
    print("\t4/4")

    stops_full = []

    def connect_stop_to_routes(stop: dict) -> list[dict[str, Any]]:
        fullroutes = []
        if stop["stop_id"].startswith("stop_area"):
            return []
        for stop_time in stop_times:
            if stop_time["stop_id"] == stop["stop_id"]:
                for trip in trips:
                    if trip["trip_id"] == stop_time["trip_id"]:
                        for route in routes:
                            if route["route_id"] == trip["route_id"]:
                                fullroute = {**stop, **route}
                                if json.dumps(fullroute) not in [
                                    json.dumps(f) for f in fullroutes
                                ]:
                                    fullroutes.append(fullroute)
        return fullroutes

    print("Connecting stops to routes...")
    stops_full = []

    with Pool() as pool:
        for routes_of_stops in tqdm(
            pool.imap(connect_stop_to_routes, stops), total=len(stops)
        ):
            stops_full.extend(routes_of_stops)

    Path(here.parent / "public" / "tisseo-stops.json").write_text(
        json.dumps(stops_full, indent=4, ensure_ascii=False)
    )

    [f.unlink() for f in here.glob("*.txt")]
