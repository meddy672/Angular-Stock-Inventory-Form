import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-stock-products',
  template: `
    <div class="stock-selector" [formGroup]="parent">
      <div formArrayName="stock">
        <div *ngFor="let item of stocks; let i = index;">
          <div class="stock-product__content" [formGroupName]="i">
            <div class="stock-product__name">
              {{ getProduct(item.value.id)?.name }}
            </div>
            <div class="stock-product__name">
              {{ getProduct(item.value.id)?.price  | currency: 'USD':true }}
            </div>
            <input 
              type="number"
              step="10"
              min="10"
              max="1000"
              formControlName="quantity">
            <button type="button" (click)="onRemove(item, i)">Remove</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./stock-products.component.scss']
})
export class StockProductsComponent implements OnInit {

  @Input()
  parent: FormGroup;

  @Input()
  map: Map<number, Product>;

  @Output()
  removed = new EventEmitter<any>();


  constructor() { }

  ngOnInit(): void {
  }

  get stocks() {
    return (this.parent.get('stock') as FormArray).controls;
  }

  getProduct(id: number){
    return this.map.get(id);
  }

  onRemove(group: any, index: number){
    this.removed.emit({group, index })
  }

}
