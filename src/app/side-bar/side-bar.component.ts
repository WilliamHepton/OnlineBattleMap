import { Component,  OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { BattleImage } from '../entities/battle-image';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  opened: boolean;
  backgroundRAW = "https://i.pinimg.com/originals/1e/94/a7/1e94a7d9d18a0ee861a5a64f6d974e7c.jpg";
  selectedFile;
  maps: BattleImage[] = [];
  players: BattleImage[] = [];
  creatures: BattleImage[] = [];
  effects: BattleImage[] = [];
  other: BattleImage[] = [];

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    //listen to event from socket.io server
    this.webSocketService.listen('test event').subscribe((data) => {
      console.log(data);
    });
  }


  changedOptions(): void {
      console.log("sidebar");
  }

  onFileSelect(event) {
    this.selectedFile = event;
    
  }

  onUpload() {
   /* const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name)
    this.http.post('http....', fd, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          console.log('Upload Progress: ' + Math.round(event.loaded/event.total * 100) + '%' );
        } else if (event.type === HttpEventType.Response) {
          console.log(event);
        }
      });*/
      
    let newImage: BattleImage = {name: "", url: ""};
    newImage.name = this.trimName(this.selectedFile.target.files[0].name);
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedFile.target.files[0]);
    reader.onload = (event) => {
      newImage.url = reader.result;
      this.maps.push(newImage);
    }    
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  trimName(name: string): string{
    var re = /.png/gi;
    name = name.replace(re, "");
    var re = /.jpg/gi;
    name = name.replace(re, "");
    return name;
  }

  deleteImage(name: string, list: string){
    switch(list) {
      case "maps": {
        this.maps.splice(this.maps.indexOf(this.maps.find(x => x.name === name)), 1);
        break;
      }
      case "players": {
        this.players.splice(this.players.indexOf(this.players.find(x => x.name === name)), 1);
        break;
      }
      case "creatures": {
        this.creatures.splice(this.creatures.indexOf(this.creatures.find(x => x.name === name)), 1);
        break;
      }
      case "effects": {
        this.effects.splice(this.effects.indexOf(this.effects.find(x => x.name === name)), 1);
        break;
      }
      case "other": {
        this.other.splice(this.other.indexOf(this.other.find(x => x.name === name)), 1);
        break;
      }
    }
  }

  renameImage(list: string, name: string, newName: string) {
    switch(list) {
      case "maps": {
        this.maps.find(x => x.name === name).name = newName;
        break;
      }
      case "players": {
        this.players.find(x => x.name === name).name = newName;
        break;
      }
      case "creatures": {
        this.creatures.find(x => x.name === name).name = newName;
        break;
      }
      case "effects": {
        this.effects.find(x => x.name === name).name = newName;
        break;
      }
      case "other": {
        this.other.find(x => x.name === name).name = newName;
        break;
      }
    }
  }


}
