package org.educama.shipment.boundary.impl;

import org.camunda.bpm.engine.runtime.CaseInstance;
import org.educama.common.exceptions.ResourceNotFoundException;
import org.educama.shipment.api.resource.ShipmentResource;
import org.educama.shipment.boundary.ShipmentBoundaryService;
import org.educama.shipment.control.ShipmentCaseControlService;
import org.educama.shipment.model.Shipment;
import org.educama.shipment.process.ShipmentCaseEvaluator;
import org.educama.shipment.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

/**
 * Boundary service implementation for shipments.
 */
@Service
@Transactional(readOnly = true)
public class ShipmentBoundaryServiceImpl implements ShipmentBoundaryService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private ShipmentCaseControlService shipmentCaseControlService;

    @Autowired
    private ShipmentCaseEvaluator caseModelHandler;

    @Override
    public Shipment createShipment(Shipment shipment) {
        CaseInstance caseInstance = shipmentCaseControlService.create();
        shipment.trackingId = caseInstance.getBusinessKey();
        Shipment createdShipment = shipmentRepository.save(shipment);
        return createdShipment;
    }

    @Override
    public Collection<Shipment> findAll() {
        return shipmentRepository.findAll();
    }

    @Override
    public ShipmentResource getShipment(String trackingId) {
        Shipment shipment = shipmentRepository.findOneBytrackingId(trackingId);
        ShipmentResource convertedShipment = new ShipmentResource().fromShipment(shipment);
        return convertedShipment;
    }

    @Override
    public ShipmentResource updateShipment(String trackingId, Shipment saveShipmentResource) {
        Shipment shipment = shipmentRepository.findOneBytrackingId(trackingId);
        if (shipment == null) {
            throw new ResourceNotFoundException("Shipment not found");
        } else {
            shipment = saveShipmentResource;
            shipment.trackingId = trackingId;
            shipmentRepository.save(shipment);
            // case model should only be reevaluated if all data is complete
            if (shipment.shipmentCargo.dangerousGoods != null && shipment.shipmentCargo.cargoDescription != null
                    && shipment.shipmentCargo.numberPackages != null && shipment.shipmentCargo.totalCapacity != null
                    && shipment.shipmentCargo.totalWeight != null) {
                caseModelHandler.reevaluateCase(shipment.trackingId);
            }
            ShipmentResource convertedShipment = new ShipmentResource().fromShipment(shipment);
            return convertedShipment;
        }

    }
}
