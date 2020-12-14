import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from "socket.io-client/dist/socket.io";

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {

  socket: any;
  readonly uri: string = "ws://localhost:3000"; //replace localhost:3000 with the uri of the socket.io server

  constructor() {
    this.socket = io(this.uri);
   }

  listen(eventName: string){
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data){
    this.socket.emit(eventName, data);
  }

}
