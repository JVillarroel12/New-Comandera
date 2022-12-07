import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalListReservacionesGlobalesPage } from './modal-list-reservaciones-globales.page';

describe('ModalListReservacionesGlobalesPage', () => {
  let component: ModalListReservacionesGlobalesPage;
  let fixture: ComponentFixture<ModalListReservacionesGlobalesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalListReservacionesGlobalesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalListReservacionesGlobalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
