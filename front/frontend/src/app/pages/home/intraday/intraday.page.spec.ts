import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntradayPage } from './intraday.page';

describe('IntradayPage', () => {
  let component: IntradayPage;
  let fixture: ComponentFixture<IntradayPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IntradayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
