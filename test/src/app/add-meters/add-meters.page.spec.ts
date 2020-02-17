import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMetersPage } from './add-meters.page';

describe('AddMetersPage', () => {
  let component: AddMetersPage;
  let fixture: ComponentFixture<AddMetersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMetersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMetersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
