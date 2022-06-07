import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { Product, Item } from '../../models/product.model';
import { StockInventoryService } from '../../services/stock-inventory.service';

@Component({
  selector: 'app-stock-inventory',
  template: `
    <div>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <app-stock-branch   [parent]="form"></app-stock-branch>
        <app-stock-selector 
          (added)="addStock($event)" 
          [products]="products" 
          [parent]="form">
        </app-stock-selector>
        <app-stock-products 
          (removed)="removeStock($event)" 
          [parent]="form" [map]="productMap">
        </app-stock-products>

        <div class="stock-inventory__price">
          Total: {{ total | currency:'USD':true }}
        </div>

        <div class="stock-inventory__buttons">
          <button 
          type="submit"
          [disabled]="form.invalid"
          >
              Order Stock
          </button>
          <pre>{{form.value | json}}</pre>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./stock-inventory.component.scss'],
  providers: [StockInventoryService]
})
export class StockInventoryComponent implements OnInit {

  products: Product[] = [];
  productMap: Map<number, Product>;
  total: number;

  form = this.fb.group({
    store: this.fb.group({
      branch: ['', Validators.required],
      code: ['', Validators.required]
    }),
    selector: this.createStock({}),
    stock: this.fb.array([])
  })

  constructor( private fb: FormBuilder, private stockService: StockInventoryService) { }

  ngOnInit(): void {
    const products$ = this.stockService.getProducts();
    const cart$ = this.stockService.getCart();
    const observable$ = forkJoin([cart$, products$]);

    observable$.subscribe(([cart, products]: [Item[], Product[]]) => {
      const myMap = products.map<[number, Product]>(product => [product.id, product]);
      this.productMap = new Map<number, Product>(myMap);
      this.products = products;
      cart.forEach(item => this.addStock(item));
      this.calculatTotal(this.form.get('stock')?.value);
      this.form.get('stock')?.valueChanges.subscribe(value => this.calculatTotal(value))
    });

  }

  calculatTotal(value: Item[]){
    const total = value.reduce((prev, next) => {
      return prev +  (next.quantity * (this.productMap.get(next.id)?.price as number))
    }, 0);
    this.total = total;
  }

  createStock(stock: any){
    return this.fb.group({
      id: parseInt(stock.id, 10) || '',
      quantity: stock.quantity || 10,
    })
  }

  addStock(event: any){
    const control = this.form.get('stock') as FormArray;
    control.push(this.createStock(event))
    console.log(control.value)
  }

  onSubmit(){
    console.log('Form: ',this.form.value)
  }

  removeStock({group, index}: {group: FormGroup, index: number}){
    const control = this.form.get('stock') as FormArray;
    control.removeAt(index);
  }

}
