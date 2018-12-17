import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITravel } from 'app/shared/model/travel.model';
import { Principal } from 'app/core';
import { TravelService } from './travel.service';

@Component({
    selector: 'jhi-travel',
    templateUrl: './travel.component.html'
})
export class TravelComponent implements OnInit, OnDestroy {
    travels: ITravel[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private travelService: TravelService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.travelService.query().subscribe(
            (res: HttpResponse<ITravel[]>) => {
                this.travels = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTravels();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITravel) {
        return item.id;
    }

    registerChangeInTravels() {
        this.eventSubscriber = this.eventManager.subscribe('travelListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
