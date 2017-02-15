/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PtListComponent } from './pt-list.component';

describe('PtListComponent', () => {
  let component: PtListComponent;
  let fixture: ComponentFixture<PtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
