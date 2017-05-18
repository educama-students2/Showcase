import {Address} from "../../../customer/api/datastructures/address.datastructure";
import {Cargo} from "../../api/datastructures/cargo.datastructure";
import {ShipmentServices} from "../../api/datastructures/services.datastructure";
import {Party} from "../../api/datastructures/party.datastructure";
export class SaveShipmentEvent {
    trackingId: string;
    uuidSender: string;
    uuidReceiver: string;
    sender: Party;
    receiver: Party;
    shipmentCargo: Cargo;
    shipmentServices: ShipmentServices;
    customerTypeEnum: string;

    constructor(uuidSender: string, uuidReceiver: string, sender: Party, receiver: Party,
                shipmentCargo: Cargo, shipmentServices: ShipmentServices, customerTypeEnum: string) {
        // this.trackingId = trackingId;
        this.uuidSender = uuidSender;
        this.uuidReceiver = uuidReceiver;
        this.sender = sender;
        this.receiver = receiver;
        this.shipmentCargo = shipmentCargo;
        this.shipmentServices = shipmentServices;
        this.customerTypeEnum = customerTypeEnum;
    }
}
