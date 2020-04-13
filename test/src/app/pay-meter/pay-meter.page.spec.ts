import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayMeterPage } from './pay-meter.page';

describe('PayMeterPage', () => {
  let component: PayMeterPage;
  let fixture: ComponentFixture<PayMeterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayMeterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayMeterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
