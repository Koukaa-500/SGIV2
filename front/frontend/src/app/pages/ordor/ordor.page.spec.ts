import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdorPage } from './ordor.page';

describe('OrdorPage', () => {
  let component: OrdorPage;
  let fixture: ComponentFixture<OrdorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
