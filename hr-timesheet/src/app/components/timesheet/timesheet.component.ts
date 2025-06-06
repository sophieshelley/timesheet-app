import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../../interfaces/department';
import { DepartmentsService } from '../../services/departments.service';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Employee } from '../../interfaces/employee';
import { EmployeeService } from '../../services/employee.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-timesheet',
  standalone: false,
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss'
})
export class TimesheetComponent implements OnInit {
  $departments: Observable<Department[]> | undefined;
  department: Department | undefined;
  employeeNameFC = new FormControl('', this.nameValidator());
  employees: Employee[] = [];
  employeeId = 0;
  weekdays: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  constructor(
    private route: ActivatedRoute,
    private departmentsService: DepartmentsService,
    private employeeService: EmployeeService,   // <-- ADD THIS
    private router: Router                      // <-- ADD THIS
  ) { }

  ngOnInit(): void {
    this.$departments = this.departmentsService.getDepartments();
  
    this.$departments.subscribe(x => {
      this.department = x.find(dept => dept.id === this.route.snapshot.params['id']);
    });
  }
  

  addEmployee(): void {
    if (this.employeeNameFC.value) {
      this.employeeId++;

      this.employees.push({
        departmentId: this.department?.id,
        name: this.employeeNameFC.value,
        payRate: Math.floor(Math.random() * 50) + 50,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      });

      this.employeeNameFC.setValue('');
    }
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let error = null;
      if (this.employees && this.employees.length) {
        this.employees.forEach(employee => {
          if (employee.name.toLowerCase() === control.value.toLowerCase()) {
            error = { duplicate: true };
          }
        });
      }
      return error;
    };
  }

  getTotalHours(employee: Employee): number {
    return employee.monday + employee.tuesday + employee.wednesday
      + employee.thursday + employee.friday + employee.saturday + employee.sunday;
  }

  deleteEmployee(index: number): void {
    this.employees.splice(index, 1);
  }

  // --- ADD THIS ---
  submit(): void {
    this.employees.forEach(employee => {
      this.employeeService.saveEmployeeHours(employee);
    });

    this.router.navigate(['./departments']);
  }
}

