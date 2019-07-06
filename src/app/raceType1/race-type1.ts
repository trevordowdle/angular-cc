import { Component, Input, Inject } from '@angular/core';
import { MatButtonModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { GroupingDialog } from './groupingDialog/groupingDialog';
import { AddDialog } from './addRunnerDialog/addDialog';
import { ModifyDialog } from './modifyRunnerDialog/modifyDialog';
import { RaceLogic } from "./script/RaceLogic";
import { DropLogic } from "./script/DropLogic";
import { RaceData } from "./script/RaceData";
import { FormatingUtil } from "./script/FormatingUtil";

@Component({
  selector: 'race-type1',
  templateUrl: './race-type1.html',
  styleUrls: ['./race-type1.css']
})
export class RaceType1 {

raceInfo:object;
scoringKeys:object;
results:any;
originalResults:any;
startResults:any;
resultKeys:Array<string> = ["PL","NAME","TEAM","TIME","SCORE"];
resultsModified:boolean = false;
raceLogic:any;
dropLogic:any;
formatingUtil:any;
raceData:string;
headerInfoExpanded:boolean = false;

 @Input() title: string;

  constructor(public dialog: MatDialog){}

  ngOnInit(){
    this.formatingUtil = new FormatingUtil();
    this.raceLogic = new RaceLogic();
    this.dropLogic = new DropLogic();
    let raceDataInf = new RaceData();
    this.raceData = raceDataInf.dillenger16;
    let initialResults = raceDataInf.buildResultsType1(this.raceData);
    this.originalResults = JSON.parse(JSON.stringify(initialResults));
    this.startResults = initialResults;
    this.buildResults(this.startResults);
  };

  closeHeaderInfo(){
    this.headerInfoExpanded = false;
  }

  buildResults(startResults){
    let info = this.raceLogic.buildResults(startResults);
    this.raceInfo = info.raceInfo;
    this.scoringKeys = info.scoringKeys;
    this.results = info.results;
  }

  openModifyDialog(index): void {

    let entry = this.startResults[index];
    let time = entry.TIME.split(':'),
      minutes,
      seconds;

    if(isNaN(time[0])){
      minutes = 0;
      seconds = 0;
    }
    else {
      minutes = time[0];
      seconds = time[1];
    }

    //minutes
    //seconds

    const dialogRef = this.dialog.open(ModifyDialog, {
      width: '300px',
      height: '400px',
      data: {
        minutes:minutes,
        seconds:seconds,
        team:entry.TEAM,
        name:entry.NAME
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        debugger;
/*         let ref = result['results'][result['place']-1];
        if(!ref){
          ref = result['results'][result['results'].length-1];
        }
        let addedEntry = JSON.parse(JSON.stringify(ref));
        addedEntry.NAME = result.name;
        addedEntry.TEAM = result.team;
        this.startResults.splice(result.place-1, 0,addedEntry);
        this.buildResults(this.startResults);
        this.resultsModified = true; */
      }
    });

  }

  openGroupDialog(team): void {
    let groupTeams = this.raceLogic.currentGroups[team];
    //check for grouping here
    const dialogRef = this.dialog.open(GroupingDialog, {
      width: '300px',
      height: '270px',
      data: {groupTeams:groupTeams,team:team}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.grouped){
          this.raceLogic.handleUngrouping(result);
        }
        else {
          this.raceLogic.handleGrouping(result);
        }
        this.buildResults(this.startResults);
      }
    });
  }

  openAddDialog(team): void {
    //check for grouping here
    const dialogRef = this.dialog.open(AddDialog, {
      width: '300px',
      height: '420px',
      data: {
        results:this.startResults
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let ref = result['results'][result['place']-1];
        if(!ref){
          ref = result['results'][result['results'].length-1];
        }
        let addedEntry = JSON.parse(JSON.stringify(ref));
        addedEntry.NAME = result.name;
        addedEntry.TEAM = result.team;
        this.startResults.splice(result.place-1, 0,addedEntry);
        this.buildResults(this.startResults);
        this.resultsModified = true;
      }
    });
  }

  showGroupingModal(team){
    this.openGroupDialog(team);
  }

  showAddModal(team){
    setTimeout(()=>{
      this.openAddDialog(team);
    },100);
  }

  showModifyModal(index){
    this.openModifyDialog(index);
  }

  undoChanges(){
    this.startResults = JSON.parse(JSON.stringify(this.originalResults));
    this.buildResults(this.startResults);
    this.resultsModified = false;
  }

  undoGroupings(){
    this.raceLogic.groupingData = {};
    this.raceLogic.currentGroups = {};
    this.buildResults(this.startResults);
    this.raceLogic.hasGroupings = false;
  }

}


