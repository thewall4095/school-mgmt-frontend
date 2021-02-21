import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DashboardService } from 'src/app/services/dashboard.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent implements OnInit {
  classForm: FormGroup;
  isbuttonLoaderOn : Boolean = false;
  isDataloaded : Boolean = false;
  public minStartDate: moment.Moment;
  public minEndDate: moment.Moment;

  classrooms = [];
  teachers = [];
  subjects = [];
  students = [];

  selectedClassroom;
  selectedTeacher;
  selectedSubject;
  selectedStudent;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private dashboardService: DashboardService) { 
    console.log(data);
    this.minStartDate = moment();
    this.minEndDate = moment().add(15, 'minutes');
  }

  ngOnInit(): void {
    this.classForm = new FormGroup({
      'startDateTime': new FormControl({ value: '', disabled: false }, [Validators.required]),
      'endDateTime': new FormControl({ value: '', disabled: false }, [Validators.required]),
      'classroom': new FormControl('', [Validators.required]),
      'teacher': new FormControl('', [Validators.required]),
      'subject': new FormControl('', [Validators.required]),
      'student': new FormControl('', [Validators.required]),
    });
    this.classForm.get('startDateTime').setValue(new Date());
    this.classForm.get('endDateTime').setValue(new Date());

    this.getRequiredData();

  }



  onDate(date){
    console.log(date.format('YYYY-MM-DD hh:mm'));
    this.classForm.get('startDateTime').setValue(moment(date));
    this.minEndDate = moment(date).add(15, 'minutes');
    this.classForm.get('endDateTime').setValue(this.minEndDate);
  }


  getRequiredData(){
    let getClassroomsData = this.dashboardService.getClassrooms();
    let getTeachersData = this.dashboardService.getTeachers();
    let getStudentsData = this.dashboardService.getStudents();
    this.isDataloaded = false;
    forkJoin([getClassroomsData, getTeachersData, getStudentsData ]).subscribe((results:any) => {
      this.classrooms = results[0].data;
      this.teachers = results[1].data;
      this.students = results[2].data;
      this.isDataloaded = true;
    });

  }

  getErrorStartDateTime(form) {
    return form.get('startDateTime').hasError('required') ? 'Field is required' : '';
  }

  getErrorEndDateTime(form) {
    return form.get('endDateTime').hasError('required') ? 'Field is required' : '';
  }

  onSubmit(form){
    console.log(form);
    let student_ids = '';
    form.student.forEach(element => {
      student_ids = student_ids + element.id + '_';
    });
    // let body = new FormData;
    // body.append('startTime', form.startDateTime);
    // body.append('endTime', form.endDateTime);
    // body.append('classroom_id', this.selectedClassroom.id);
    // body.append('teacher_id', this.selectedTeacher.id);
    // body.append('subject_id', this.selectedSubject.id);
    // body.append('student_ids', student_ids);
    let body = {
      startTime: form.startDateTime,
      endTime: form.endDateTime,
      classroom_id: this.selectedClassroom.id,
      teacher_id: this.selectedTeacher.id,
      subject_id: this.selectedSubject.id,
      student_ids: student_ids
    };
    this.isbuttonLoaderOn = true;
    this.dashboardService.createClass(body).subscribe((res:any) => {
      this.isbuttonLoaderOn = false;
      location.reload();
      console.log(res);
    });


  }

  selectClassroom(classroom){
    this.selectedClassroom = classroom;
    this.classForm.get('classroom').setValue(classroom.id + ', '+ classroom.seatingCapacity + ', '+ classroom.shape);
  }

  selectTeacher(teacher){
    this.classForm.get('teacher').setValue(teacher.name);
    this.selectedTeacher = teacher;
    this.subjects = teacher.Subjects;
    this.selectedSubject= null;
    this.classForm.get('subject').setValue('');
  }

  selectSubject(subject){
    this.classForm.get('subject').setValue(subject.name);
    this.selectedSubject= subject;
  }

  selectionChange(students){
    this.selectedStudent = students.value;
    console.log(students);
  }
}
