import { Component, OnInit } from '@angular/core';
import { Department } from '../../interfaces/department';
import { DepartmentsService } from '../../services/departments.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';


@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent implements OnInit{
  departments: Department[] | undefined;

  constructor(
    private departmentsService: DepartmentsService,
  ) { }

  ngOnInit(): void {
    this.departments = this.departmentsService.departments;
  }

}
