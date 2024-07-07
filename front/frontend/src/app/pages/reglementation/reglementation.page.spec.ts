import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReglementationPage } from './reglementation.page';

describe('ReglementationPage', () => {
  let component: ReglementationPage;
  let fixture: ComponentFixture<ReglementationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglementationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
