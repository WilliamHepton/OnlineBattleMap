import { Component,  OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BattleImage } from '../entities/battle-image';
import { WebSocketService } from '../web-socket.service';
import { DownloadedImage } from '../entities/downloaded-image';

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
  testSource: string = '';

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    //listen to event from socket.io server
    this.webSocketService.listen('test event').subscribe((data) => {
      console.log(data);
    });
  }


  changedOptions(): void {
  }

  onFileSelect(event) {
    this.selectedFile = event;
    
  }

  onUpload() {
    let imgFile = this.selectedFile.target.files[0];
    let newImage: BattleImage = {name: "", url: ""};
    newImage.name = this.trimName(imgFile.name);
    var reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = () => {
      newImage.url = reader.result;
      this.maps.push(newImage);
    }
    let uploadObject = {name: imgFile.name, file: imgFile}
    this.webSocketService.emit('imageUpload', uploadObject);
    console.log(newImage);

  }

  getImage() {
    let newImage: BattleImage = {name: "", url: ""};
    this.webSocketService.emit('getImage', 'auroramum.jpg');
    this.webSocketService.listen('returnImage').subscribe((data) => {
      let imgData: DownloadedImage = data as DownloadedImage;
      newImage.name = this.trimName(imgData.name);
      newImage.url = "data:image/jpeg;base64,"+ imgData.file;
      this.maps.push(newImage);
    });
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
