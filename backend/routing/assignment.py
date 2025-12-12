"""Routing helper selecting a driver based on postal codes."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class RoutingEngine:
    """Simple postal-code based routing engine."""

    def __init__(self, zones: Dict[str, str]):
        self.zones = zones
        self._ordered_prefixes: List[Tuple[str, str]] = sorted(
            zones.items(), key=lambda kv: len(kv[0]), reverse=True
        )

    def assign_driver(self, postal_code: str) -> Optional[str]:
        """Return the driver assigned to the postal code if known."""

        normalized = self._normalize_postal_code(postal_code)
        for prefix, driver in self._ordered_prefixes:
            if normalized.startswith(prefix):
                return driver
        return None

    @staticmethod
    def _normalize_postal_code(postal_code: str) -> str:
        return re.sub(r"\D", "", postal_code)[:5]


def default_zone_config() -> Dict[str, str]:
    """Load default postal zone mapping."""

    path = Path(__file__).with_name("postal_zones.json")
    with path.open() as fh:
        return json.load(fh)


__all__ = ["RoutingEngine", "default_zone_config"]
