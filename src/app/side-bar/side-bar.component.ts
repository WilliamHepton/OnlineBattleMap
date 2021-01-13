import { Component,  OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BattleImage, Category } from '../entities/battle-image';
import { WebSocketService } from '../web-socket.service';
import { DownloadedImage } from '../entities/downloaded-image';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  opened: boolean = true;
  backgroundRAW = "https://i.pinimg.com/originals/1e/94/a7/1e94a7d9d18a0ee861a5a64f6d974e7c.jpg";
  selectedFile;
  categories: Category[] = [{name: "maps", images: []},
    {name: "players", images: []}, 
    {name: "creatures", images: []}, 
    {name: "effects", images: []}, 
    {name: "other", images: []}];
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
    let imgFile = this.selectedFile.target.files[0];
    let newImage: BattleImage = {name: "", url: "", category: ""};
    newImage.name = this.trimName(imgFile.name);
    newImage.category = this.trimName("maps");
    var reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = () => {
      newImage.url = reader.result;
      this.categories[0].images.push(newImage);
    }
   /* let uploadObject = {name: imgFile.name, file: imgFile}
    this.webSocketService.emit('imageUpload', uploadObject);*/
  }

  onSave() {
    this.webSocketService.emit('saveAll', this.categories);
  }

  onLoad() {
    this.webSocketService.emit('loadAll', '');
    this.webSocketService.listen('returnImages').subscribe((data) => {
      var images: DownloadedImage[] = data as DownloadedImage[];
      images.forEach(image => {
        console.log(image.category);
        this.categories.find(x => x.name === image.category).images.push(
          {name: this.trimName(image.name), url: image.url, category: image.category}
        );
      });
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
    this.changeCategory(event.container.id);
  }

  changeCategory(category: string){
    console.log(category);
    this.categories.find(x => x.name === category)
      .images.forEach(image => {
        image.category = category;
      });
  }

  trimName(name: string): string{
    var re = /.png/gi;
    name = name.replace(re, "");
    var re = /.jpg/gi;
    name = name.replace(re, "");
    return name;
  }

  deleteImage(name: string, category: string){
    let images = this.categories.find(x => x.name === category).images;
    this.categories.find(x => x.name === category).images.splice(images.indexOf(images.find(x => x.name === name)), 1);
  }

  renameImage(category: string, name: string, newName: string) {
    this.categories.find(x => x.name === category).images.find(x => x.name === name).name = newName;
  }
}
