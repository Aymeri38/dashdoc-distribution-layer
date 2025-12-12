"""FastAPI entrypoint for the distribution layer backend."""

from datetime import datetime
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScanRequest(BaseModel):
    code: str
    scanned_at: datetime | None = None
    source: str | None = None


class ScanResponse(BaseModel):
    status: str
    code: str
    received_at: datetime


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


@app.post("/scan", response_model=ScanResponse)
def receive_scan(scan: ScanRequest) -> ScanResponse:
    """Accept a scan payload coming from the mobile PWA."""

    if not scan.code or not scan.code.strip():
        raise HTTPException(status_code=400, detail="Missing scan code")

    received_at = datetime.utcnow()
    # Trace each scan for observability; replace with structured logging if needed.
    print(f"[scan] code={scan.code} source={scan.source} scanned_at={scan.scanned_at}")

    return ScanResponse(status="received", code=scan.code.strip(), received_at=received_at)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
