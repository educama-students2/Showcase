
import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
// import {ErrorService} from "../../common/error/services/error.service";
import {State} from "../../app.reducers";
import {Store} from "@ngrx/store";
import {SaveShipmentEvent} from "../components/events/save-shipment.event";
import {ShipmentResource} from "../api/resources/shipment.resource";
import {Subscription, Observable} from "rxjs";
import {ShipmentService} from "../api/shipment.service";
import {ShipmentCapturePageModel} from "./shipment-capture-page.model";
import {ShipmentCaptureSlice} from "../reducer/shipment-capture-page.reducer";
import * as actions from "../reducer/shipment-capture-page.actions";
import * as _ from "lodash";

@Component({
    selector: "educama-shipment-capture-page",
    templateUrl: "shipment-capture-page.component.html",
})
export class ShipmentCapturePageComponent implements OnInit, OnDestroy {

    // relevant slice of store and subscription for this slice
    public shipmentCaptureSlice: Observable<ShipmentCaptureSlice>;
    public shipmentCaptureSliceSubscription: Subscription;

    // model for the page
    public shipmentCaptureModel: ShipmentCapturePageModel = new ShipmentCapturePageModel();

    constructor(private _activatedRoute: ActivatedRoute,
                //private _errorService: ErrorService,
                private _shipmentService: ShipmentService,
                private _router: Router,
                private _store: Store<State>) {

        this.shipmentCaptureSlice = this._store.select(state => state.shipmentCaptureSlice);

        this.shipmentCaptureSliceSubscription = this.shipmentCaptureSlice.subscribe(
            shipmentCaptureSlice => this.updateShipmentCaptureModel(shipmentCaptureSlice)
        );
    }

    public ngOnInit() {
        this._activatedRoute.params.subscribe(params => {
            if (params["id"] && params["id"] !== "capture") {
                this.loadShipment(params["id"]);
            }
            console.log(params["id"]);
        });
    }

    public ngOnDestroy() {
        this._store.dispatch(new actions.ResetShipmentCaptureSliceAction(""));
        this.shipmentCaptureSliceSubscription.unsubscribe();
    }

    // ***************************************************
    // Event Handler
    // ***************************************************

    /*
     * Handles the save event for a shipment
     */
    public onSaveShipmentEvent(saveShipmentEvent: SaveShipmentEvent) {
        if (_.isUndefined(this.shipmentCaptureModel.shipment)) {
            this._shipmentService.createShipment(this.mapShipmentFromSaveShipmentEvent(saveShipmentEvent))
                .subscribe(shipment => {
                    this._router.navigate(["/shipments"]);
                })
        }
        else {
            this._shipmentService.updateShipment(saveShipmentEvent.trackingId, this.mapShipmentFromSaveShipmentEvent(saveShipmentEvent))
                .subscribe(shipment => {
                    this._router.navigate(["/shipments"]);
                })
        }
    }

    /*
     * Handles the cancellation of a new shipment creation
     */
    public onSaveShipmentCancellationEvent(saveShipmentEvent: SaveShipmentEvent) {
        this._router.navigate(["/shipments"]);
    }

    /*
     * Handles the error events from components
     */
    // public onSaveEvent(errorMessage: string) {
    //     this._errorService.showError(errorMessage);
    // }

    // ***************************************************
    // Data Retrieval
    // ***************************************************

    private loadShipment(trackingId: string) {
        this._shipmentService.findShipmentbyId(trackingId).subscribe(
            shipment => {
                this._store.dispatch(new actions.LoadShipmentAction(shipment));
            }
        );
        console.log(trackingId);

    }

    private updateShipmentCaptureModel(shipmentCaptureSlice: ShipmentCaptureSlice) {
        this.shipmentCaptureModel.shipment = shipmentCaptureSlice.shipment;
    }

    private mapShipmentFromSaveShipmentEvent(saveShipmentEvent: SaveShipmentEvent): ShipmentResource {
        let shipment = new ShipmentResource();
        shipment.trackingId = saveShipmentEvent.trackingId;
        shipment.uuidSender = saveShipmentEvent.uuidSender;
        shipment.uuidReceiver = saveShipmentEvent.uuidReceiver;
        shipment.sender = saveShipmentEvent.sender;
        shipment.receiver = saveShipmentEvent.receiver;
        shipment.customerTypeEnum = saveShipmentEvent.customerTypeEnum;
        shipment.shipmentCargo = saveShipmentEvent.shipmentCargo;
        shipment.shipmentServices = saveShipmentEvent.shipmentServices;
        return shipment;
    }

}
