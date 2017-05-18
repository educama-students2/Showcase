import {ShipmentResource} from "../api/resources/shipment.resource";
import {ActionReducer, Action} from "@ngrx/store";
import * as actions from "./shipment-capture-page.actions"
export interface ShipmentCaptureSlice {
    shipment?: ShipmentResource;
}

export const SHIPMENT_CAPTURE_SLICE_INITIAL_STATE = {
};

export const SHIPMENT_CAPTURE_PAGE_REDUCER: ActionReducer<ShipmentCaptureSlice> = (state: ShipmentCaptureSlice = SHIPMENT_CAPTURE_SLICE_INITIAL_STATE, action: Action) => {
    switch (action.type) {

        case actions.LOAD_SHIPMENT:
            return Object.assign({}, state, {
                shipment: action.payload
            });
        case actions.RESET_SHIPMENT_CAPTURE_SLICE:
            return SHIPMENT_CAPTURE_SLICE_INITIAL_STATE;
        default:
            return state;
    }
};