import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { DatePipe } from '@angular/common';
import {SocketService} from '../shared/socket.service';
import {AuthService} from '../shared/auth.service';
export interface  Message {
  sender: string;
  content: string;
  owner: boolean;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  messageSubscription: Subscription;
  timestamp = Date.now();
  sender = this.authService.userInfo().email;

  constructor(private socketService: SocketService, private authService: AuthService) { }

  ngOnInit() {
    this.messageSubscription = this.socketService.messageReceived().subscribe(OtherUserMsg => {
      if (OtherUserMsg.sender !== this.sender) { OtherUserMsg.owner = false; }
      this.messages.push(OtherUserMsg);
    });
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
  sendMessage(message: string) {
    this.messages.push({sender: this.sender, content: message, owner: true});
    this.socketService.messageSend({sender: this.sender, content: message, owner: true});
  }
}
