import { Component, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliveryOrder } from '../model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  doForm!: FormGroup
  itemArray!: FormArray
  // FormArray is similar to FormGroup, but it is used to manage an array of form controls

  // Define an event (output)
  @Output()
  onNewDeliveryOrder = new Subject<DeliveryOrder>

  priorityCtrlName = "priority"

  // Declare a member and declare the injection over a member
  // Don't inject the "Autowired" in the constructor as it may not be ready yet
  // Don't use it in the constructor
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // This method is called when the component is created
    // for initialization 
    this.doForm = this.createForm()
  }

  processDelivery() {
    const delivery = this.doForm.value as DeliveryOrder
    // The line above extracts the form data from the 
    // doForm form and stores it in a delivery variable
    // The as DeliveryOrder portion is a type assertion that tells TypeScript
    // to treat the form data as an instance of the DeliveryOrder class
    this.onNewDeliveryOrder.next(delivery)
    // The line above emits the delivery object to an Observable named 
    // onNewDeliveryOrder. This allows other components or services to 
    // be notified when a new delivery order is created.
    console.info('>>>> delivery: ', delivery)
    this.ngOnInit() // This is typically used to reset the form after it has been submitted
  }

  addItem() {
    console.info(">>> item: ")
    const orderItem = this.createOrderItem()
    this.itemArray.push(orderItem)
  }

  deleteItem(idx: number) {
    this.itemArray.removeAt(idx)
  }

  hasError(cn: string): boolean {
    return !!(this.doForm.get(cn)?.invalid && this.doForm.get(cn)?.dirty)
  }

  isFormInvalid(): boolean {
    const dd = new Date(this.doForm.get('deliveryDate')?.value)

    if (!dd)
      return true

    const deliveryDate = new Date(dd)
    const today = new Date()
    return this.doForm.invalid && (deliveryDate < today)
  }

  // Need to bind this form model into the HTML using attribute binding
  private createForm(): FormGroup {
    this.itemArray = this.fb.array([])
    return this.fb.group({
      name: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      address: this.fb.control<string>('', [Validators.required]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      deliveryDate: this.fb.control<string>('', [Validators.required]),
      session: this.fb.control<string>('PM', [Validators.required]),
      insurance: this.fb.control<boolean>(false),
      priority: this.fb.control<boolean>(false),
      comments: this.fb.control<string>('no comments'),
      orderItems: this.itemArray
    })
  }

  private createOrderItem(): FormGroup {
    return this.fb.group({
      item: this.fb.control<string>('', [Validators.required]),
      quantity: this.fb.control<string>('', [Validators.required, Validators.min(1)])
    })
  }
}
