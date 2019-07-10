
import { Component } from '@angular/core';

@Component({
  selector: 'main',
  templateUrl: './main.html',
  styleUrls: ['./main.css']
})
export class Main {
  
  type:string = '';
  raceId:string = '';
  title:string = '';

  constructor() {}

  ngOnInit(){}

  setRaceId(id,type,title){
    this.raceId = id;
    this.type = type;
    this.title = title;
  }

}