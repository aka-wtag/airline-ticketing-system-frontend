import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, Subscription } from 'rxjs';
import { AirlineService } from 'src/app/core/service/airline.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { ManageAirlinesComponent } from './manage-airlines.component';
import { Airline } from 'src/app/core/interface/airline';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageAirlinesComponent', () => {
    let component: ManageAirlinesComponent;
    let fixture: ComponentFixture<ManageAirlinesComponent>;
    let airlineService: jasmine.SpyObj<AirlineService>;
    let toastService: jasmine.SpyObj<ToastService>;

    const dummyAirline: Airline = {
        airlineId: 1,
        airlineModel: 'BI-101',
        airlineName: 'Biman Bangladesh',
        numberOfSeats: 150,
    };

    beforeEach(async () => {
        const airlineServiceSpy = jasmine.createSpyObj('AirlineService', ['getAirlines', 'deleteAirline']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

        await TestBed.configureTestingModule({
            declarations: [ManageAirlinesComponent],
            imports: [HttpClientTestingModule, NgxPaginationModule],
            providers: [
                { provide: AirlineService, useValue: airlineServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
            ],
        }).compileComponents();

        airlineService = TestBed.inject(AirlineService) as jasmine.SpyObj<AirlineService>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

        fixture = TestBed.createComponent(ManageAirlinesComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load airlines on init', () => {
        const response = { content: [dummyAirline], totalElements: 1 };
        airlineService.getAirlines.and.returnValue(of(response));
        fixture.detectChanges();

        expect(component.airlines).toEqual([dummyAirline]);
        expect(component.totalItems).toBe(1);
    });

    it('should handle page change', () => {
        const response = { content: [dummyAirline], totalElements: 1 };
        airlineService.getAirlines.and.returnValue(of(response));
        fixture.detectChanges();

        component.onPageChange(2);

        expect(component.currentPage).toBe(2);
        expect(airlineService.getAirlines).toHaveBeenCalledWith(1, component.itemsPerPage);
    });

    it('should open edit form with selected airline in edit mode', () => {
        component.editAirlineForm(dummyAirline);
        expect(component.showEditAirlineForm).toBe(true);
        expect(component.selectedAirline).toEqual(dummyAirline);
        expect(component.editMode).toBe(true);
    });

    it('should open add form in add mode', () => {
        component.addAirlineForm();
        expect(component.showEditAirlineForm).toBe(true);
        expect(component.editMode).toBe(false);
    });

    it('should close edit airline form', () => {
        component.closeEditAirlineForm();
        expect(component.showEditAirlineForm).toBe(false);
        expect(component.selectedAirline).toBeNull();
    });

    it('should delete airline and show success toast', () => {
        airlineService.deleteAirline.and.returnValue(of(undefined));

        const response = { content: [dummyAirline], totalElements: 1 };
        airlineService.getAirlines.and.returnValue(of(response));
        fixture.detectChanges();
        
        component.deleteAirline(dummyAirline.airlineId);

        expect(airlineService.deleteAirline).toHaveBeenCalledWith(dummyAirline.airlineId);
        expect(toastService.show).toHaveBeenCalledWith('Delete successful', true);
    });

    it('should show error toast on delete airline failure', () => {
        airlineService.deleteAirline.and.returnValue(throwError('Error occurred'));
        component.deleteAirline(dummyAirline.airlineId);

        expect(toastService.show).toHaveBeenCalledWith('Error occurred', false);
    });

    it('should open confirmation modal', () => {
        component.openConfirmationModal(dummyAirline);
        expect(component.selectedAirline).toEqual(dummyAirline);
        expect(component.isConfirmationModalOpen).toBe(true);
    });

    it('should close confirmation modal and delete airline on confirmation', () => {
        spyOn(component, 'deleteAirline');
        component.selectedAirline = dummyAirline;
        component.closeConfirmationModal(true);

        expect(component.isConfirmationModalOpen).toBe(false);
        expect(component.deleteAirline).toHaveBeenCalledWith(dummyAirline.airlineId);
    });

    it('should close confirmation modal without deleting airline on cancellation', () => {
        spyOn(component, 'deleteAirline');
        component.selectedAirline = dummyAirline;
        component.closeConfirmationModal(false);

        expect(component.isConfirmationModalOpen).toBe(false);
        expect(component.deleteAirline).not.toHaveBeenCalled();
    });

    it('should unsubscribe from all subscriptions on destroy', () => {
        const sub = new Subscription();
        component.airlineSubscription = sub;
        spyOn(sub, 'unsubscribe');
        component.ngOnDestroy();
        expect(sub.unsubscribe).toHaveBeenCalled();
    });
});
