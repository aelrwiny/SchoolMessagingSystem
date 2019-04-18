import { Component, OnInit } from '@angular/core';
import { Person } from '../classes';
import { SystemService } from '../system-service.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  person : Person;
  isStudentVisible: boolean = false;
  isAdminVisible: boolean = false;

  constructor(private systemService : SystemService, 
      private location: Location,
      private router : Router) { }

  ngOnInit() {
    this.person = new Person();
    this.isStudentVisible = false;
    this.isAdminVisible = false;
    if(this.location.path() == '/studentLogin') {
      this.isStudentVisible = true;
    } else {
      this.isAdminVisible = true;
    }
  }

  doAdminLogin() : void {
    this.systemService.doAdminLogin(this.person)
      .subscribe(returnedValue => this.operateReturnedValue(returnedValue));
  }

  doStudentLogin() : void {
    this.systemService.doStudentLogin(this.person)
      .subscribe(returnedValue => this.operateReturnedValue(returnedValue));
  }

  private operateReturnedValue(returnedValue : any) : void {
    if (returnedValue.auth && returnedValue.auth == true) {
      // add to the root scope isAdmin
      // add to the root scope username;
      this.systemService.setUsername(returnedValue.username);
      if(returnedValue.isAdmin) {
        this.systemService.setIsAdmin(true);
        //this.location.go('students', '', null);
      } else {
        this.systemService.setIsAdmin(false);
        //this.location.go('messages', '', null);
      }
    } else {
      alert('Failed To loging'); 
    }
  }

}
