import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stock-branch',
  template: `
    <div [formGroup]="parent">
      <div formGroupName="store">
        <input 
            type="text" 
            placeholder="Branch ID"
            formControlName="branch"
              >
          <div 
          class="error"
          *ngIf="required('branch')">Branch ID iss required</div>
          <input 
            type="text" 
            placeholder="Manger Code"
            formControlName="code"
              >
          <div 
          class="error" 
          *ngIf="required('code')">Manager ID is required</div> 
        </div>
    </div>
  `,
  styleUrls: ['./stock-branch.component.scss']
})
export class StockBranchComponent implements OnInit {

  @Input()
  parent: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  required(name: string){
    return (
      this.parent.get(`store.${name}`)?.hasError('required') &&
      this.parent.get(`store.${name}`)?.touched
    );
  }

}
