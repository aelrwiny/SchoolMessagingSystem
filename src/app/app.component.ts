import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
  isVisible: boolean = false;

  title = 'schoolMessagingSystemDemo';
  


  toggleMenuClass(){
    this.isVisible = !this.isVisible;
  }
}
