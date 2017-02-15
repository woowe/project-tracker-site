/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PtChipListComponent } from './pt-chip-list.component';

describe('PtChipListComponent', () => {
  let component: PtChipListComponent;
  let fixture: ComponentFixture<PtChipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtChipListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
