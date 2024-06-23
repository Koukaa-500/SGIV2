import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfondeurPage } from './profondeur.page';

describe('ProfondeurPage', () => {
  let component: ProfondeurPage;
  let fixture: ComponentFixture<ProfondeurPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfondeurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
