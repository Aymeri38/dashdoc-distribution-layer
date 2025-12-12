"""FastAPI entrypoint for the distribution layer backend."""

from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from backend.edi.generator import EDIGenerator, Package, Shipment
from backend.routing.assignment import RoutingEngine, default_zone_config


class HealthResponse(BaseModel):
    status: str


class DispatchResponse(BaseModel):
    edi: dict[str, Any]


class DriverRequest(BaseModel):
    postal_code: str


class DriverResponse(BaseModel):
    driver: str


app = FastAPI(
    title="Dashdoc Distribution Layer",
    version="0.1.0",
    description="API d'orchestration pour la distribution Traplus vers Dashdoc",
)

generator = EDIGenerator()
routing_engine = RoutingEngine(default_zone_config())


@app.get("/health", response_model=HealthResponse)
def healthcheck() -> HealthResponse:
    """Simple liveness check."""

    return HealthResponse(status="ok")


@app.post("/edi/dispatch", response_model=DispatchResponse)
def build_dispatch(shipment: Shipment) -> DispatchResponse:
    """Expose a simple endpoint to generate EDI payloads."""

    payload = generator.generate_dispatch(shipment)
    return DispatchResponse(edi=payload)


@app.post("/routing/assign-driver", response_model=DriverResponse)
def assign_driver(request: DriverRequest) -> DriverResponse:
    """Return the driver assigned to the provided postal code."""

    driver = routing_engine.assign_driver(request.postal_code)
    if not driver:
        raise HTTPException(status_code=404, detail="No driver configured for this postal code")
    return DriverResponse(driver=driver)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
