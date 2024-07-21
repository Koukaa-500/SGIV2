import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelevePage } from './releve.page';

describe('RelevePage', () => {
  let component: RelevePage;
  let fixture: ComponentFixture<RelevePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
