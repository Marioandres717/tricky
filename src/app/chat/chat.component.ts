import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {SocketService} from '../shared/socket.service';
import {AuthService} from '../shared/auth.service';
export interface  Message {
  sender: string;
  content: string;
  owner: boolean;
  photo?: string;
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
  sender = this.authService.userInfo();

  constructor(private socketService: SocketService, private authService: AuthService) { }

  ngOnInit() {
    this.messageSubscription = this.socketService.messageReceived().subscribe(OtherUserMsg => {
      if (OtherUserMsg.sender !== this.sender.email) { OtherUserMsg.owner = false; }
      this.messages.push(OtherUserMsg);
    });
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
  sendMessage(message: string) {
    console.log(this.sender.photoURL);
    this.messages.push({sender: this.sender.email, content: message, owner: true, photo: this.sender.photoURL});
    this.socketService.messageSend({sender: this.sender.email, content: message, owner: true, photo: this.sender.photoURL});
  }
}
