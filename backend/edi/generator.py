"""EDI generation helpers for Dashdoc."""

from datetime import datetime, timezone
from typing import Any, Dict, List

from pydantic import BaseModel, Field


class Package(BaseModel):
    code: str = Field(..., description="Barcode or unit identifier")
    weight_kg: float | None = Field(None, description="Optional package weight")


class Shipment(BaseModel):
    shipment_id: str
    customer: str
    destination_postal_code: str
    packages: List[Package] = Field(..., min_length=1, description="List of packages to dispatch")


class EDIGenerator:
    """Builds simple EDI-like payloads that can be sent to Dashdoc."""

    def generate_dispatch(self, shipment: Shipment) -> Dict[str, Any]:
        """Convert shipment data into a Dashdoc-friendly EDI payload."""

        manifest = [self._format_package(pkg, shipment.shipment_id) for pkg in shipment.packages]
        return {
            "message_type": "TRANSPORT_DISPATCH",
            "created_at": datetime.now(tz=timezone.utc).isoformat(),
            "shipment": {
                "id": shipment.shipment_id,
                "customer": shipment.customer,
                "destination_postal_code": shipment.destination_postal_code,
            },
            "packages": manifest,
        }

    @staticmethod
    def _format_package(package: Package, shipment_id: str) -> Dict[str, Any]:
        """Uniform representation for packages within the EDI payload."""

        payload: Dict[str, Any] = {
            "code": package.code,
            "shipment_id": shipment_id,
        }
        if package.weight_kg is not None:
            payload["weight_kg"] = package.weight_kg
        return payload


__all__ = ["Package", "Shipment", "EDIGenerator"]
