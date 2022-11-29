import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalDescuentoFacturarPage } from './modal-descuento-facturar.page';

describe('ModalDescuentoFacturarPage', () => {
  let component: ModalDescuentoFacturarPage;
  let fixture: ComponentFixture<ModalDescuentoFacturarPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDescuentoFacturarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDescuentoFacturarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
