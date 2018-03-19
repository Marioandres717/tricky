import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { DatePipe } from '@angular/common';
import {SocketService} from '../shared/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: string[] = ['is cs-372 project'];
  messageSubscription: Subscription;
  timestamp = Date.now();

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.messageSubscription = this.socketService.messageReceived().subscribe(OtherUserMsg => this.messages.push(OtherUserMsg));
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }

  sendMessage(message: string) {
    this.messages.push(message);
    this.socketService.messageSend(message);
  }
}
