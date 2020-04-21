import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeterStatusPage } from './meter-status.page';

describe('MeterStatusPage', () => {
  let component: MeterStatusPage;
  let fixture: ComponentFixture<MeterStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeterStatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeterStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
