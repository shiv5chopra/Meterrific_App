import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InputDestinationPage } from './input-destination.page';

describe('InputDestinationPage', () => {
  let component: InputDestinationPage;
  let fixture: ComponentFixture<InputDestinationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDestinationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputDestinationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
