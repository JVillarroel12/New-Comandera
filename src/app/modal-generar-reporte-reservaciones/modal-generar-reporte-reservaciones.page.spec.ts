import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalGenerarReporteReservacionesPage } from './modal-generar-reporte-reservaciones.page';

describe('ModalGenerarReporteReservacionesPage', () => {
  let component: ModalGenerarReporteReservacionesPage;
  let fixture: ComponentFixture<ModalGenerarReporteReservacionesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGenerarReporteReservacionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalGenerarReporteReservacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
