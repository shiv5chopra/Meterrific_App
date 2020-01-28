import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HihiPage } from './hihi.page';

describe('HihiPage', () => {
  let component: HihiPage;
  let fixture: ComponentFixture<HihiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HihiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HihiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
