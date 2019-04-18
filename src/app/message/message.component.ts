import { Component, OnInit } from '@angular/core';
import { SystemService } from '../system-service.service';
import { ActivatedRoute } from '@angular/router';
import {Message} from '../classes';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  currentId : string;
  username : string;
  messageId :string;
  currentMessage : string;
  sentTo : string;

  private newMessage : Message;
  constructor(private systemService : SystemService, private route : ActivatedRoute) { }

  ngOnInit() {
    this.currentId = this.route.snapshot.paramMap.get('id');
    console.log('currentId' + `${this.currentId}`);
    this.username = this.route.snapshot.paramMap.get('username');
    console.log('username' + `${this.username}`);
    this.messageId = this.route.snapshot.paramMap.get('messageId');
    console.log('messageId' + `${this.messageId}`);
    this.sentTo = this.route.snapshot.paramMap.get('sentTo');
    console.log('messageId' + `${this.messageId}`);
    this.getStudentMessages();
  }

  getStudentMessages() : void {
    this.systemService.getMessage(`${this.messageId}`).subscribe(fetchedMsg => this.operateReturnedValue(fetchedMsg));
  }

  addMessage() : void {
    this.newMessage = {id: 0, 
      createdBy: 0, 
      messageContent: this.currentMessage, 
      sentTo: parseInt(this.sentTo, 10),
      isRead : 'F'};
    this.systemService.doAddNewMessage(this.newMessage).subscribe(addedReturnedValue => this.operateReturnedValue(addedReturnedValue));
  }

  private operateReturnedValue(returnedValue : any) : void {
    if (returnedValue.auth == false) {
      alert(returnedValue.message);
    } if (returnedValue.isError == true) {
      alert(returnedValue.message);
    } else {
      this.currentMessage = returnedValue[0].messageContent; 
    }
  }

}
