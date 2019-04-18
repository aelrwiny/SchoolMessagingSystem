import { Component, OnInit } from '@angular/core';
import { Person} from '../classes';
import { SystemService } from '../system-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  newStudent : Person;

  constructor(private systemService : SystemService) { }

  ngOnInit() {
    this.newStudent = new Person();
  }

  addNewStudent():void {
    this.systemService
      .doStudentRegister(this.newStudent)
        .subscribe(returnedValue => this.operateReturnedValue(returnedValue));
  }

  clear():void {
    this.newStudent = new Person();
  }

  private operateReturnedValue(returnedValue : any):void {  
    console.log(returnedValue);
    if(returnedValue.isError == true) {
      alert('Error in Registeration');
    } else {
      alert('Registeration is Done Successfully');
    }
  }


}
