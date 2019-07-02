
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  team: string;
  name: string;
}

@Component({
  selector: 'add-dialog',
  templateUrl: 'addDialog.html',
})
export class AddDialog {
  constructor(
    public dialogRef: MatDialogRef<AddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(){
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateTime(val){
    let ref = this.data['results'][this.data['place']-1];
    if(!ref){
      ref = this.data['results'][this.data['results'].length-1];
    }
    this.data['time'] = ref.TIME;
  }

}