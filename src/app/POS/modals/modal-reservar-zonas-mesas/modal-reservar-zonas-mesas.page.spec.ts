import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalReservarZonasMesasPage } from './modal-reservar-zonas-mesas.page';

describe('ModalReservarZonasMesasPage', () => {
  let component: ModalReservarZonasMesasPage;
  let fixture: ComponentFixture<ModalReservarZonasMesasPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReservarZonasMesasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalReservarZonasMesasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
