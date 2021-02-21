import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import {CreateClassComponent} from 'src/app/components/create-class/create-class.component';
import { DashboardService } from 'src/app/services/dashboard.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import * as moment from 'moment';

export interface ClassElement {
  id: number;
  startTime: string,
  duration: number,
  classroom: string;
  teacher: string;
  subject: string;
  students: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'School Preview';
  displayedColumns: string[] = ['id', 'startTime', 'duration', 'classroom', 'teacher', 'subject', 'students'];

  tableData: ClassElement[] = [];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses(){{
    this.dashboardService.getClasses().subscribe((res:any) => {
      console.log(res.data);
      res.data.forEach(element => {
        let studentNames = '';
        element.Students.forEach(student => {
          studentNames = studentNames + student.name + ', '
        });
        this.tableData.push({
          id: element.id,
          startTime: moment(element.startTime).format('YYYY-MM-DD hh:mm'),
          duration: Math.ceil(moment(element.endTime).diff(moment(element.startTime)) / 60000),
          classroom: element.Classroom.id+', '+element.Classroom.seatingCapacity+ ', '+ element.Classroom.shape,
          teacher: element.Teacher.name,
          subject: element.Subject.name,
          students: studentNames //.reduce((a, b) => a.name +', ' + b.name)
        });
      });
      this.dataSource = new MatTableDataSource(this.tableData);
    })
  }}

  openCreateclassDialog(){
    this.dialog.open(CreateClassComponent, {
      width: '90vw',
      height:  '90vh',
      // maxWidth: '95vw',
      hasBackdrop: true,
      // data: { autoCheck : autoCheck}
    });
  }
}
