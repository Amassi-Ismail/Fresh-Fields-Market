import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { user } from '../../model/user';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css'
})
export class AccountDetailsComponent implements OnInit {

  userForm!: FormGroup;
  isEditing: boolean = false;
  userId!: number;

  constructor(private http: HttpClient, private fb: FormBuilder){}

  local(){
    const token : string = localStorage.getItem('authToken') || '';
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+ token});

    return {
      headers: headers_object
    };
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email:['']
    });

    this.fetchUser();
  }

  fetchUser() {
    this.http.get<any>(`http://localhost:8080/account/me`, this.local()).subscribe(
      (response: any) => {
        this.userId = response.id;
        this.getUser(this.userId);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching current user:', error.message);
      }
    );
  }



  getUser(id: number): void {
    this.http.get<user>(`http://localhost:8080/account/find/${id}`, this.local()).subscribe(
      (response: user) => {
        this.userForm.patchValue({
          firstname: response.firstname,
          lastname: response.lastname,
          email: response.email
        });
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      });
  }

  toggleEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    (response: user) => {
      this.userForm.patchValue({
        firstname: response.firstname,
        lastname: response.lastname
      });
      console.log(response);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.http.put(`http://localhost:8080/account/update/${this.userId}`, this.userForm.value,this.local()).subscribe(
        (response) => {
          console.log(response);
        alert('User details updated successfully');
        this.isEditing = false;
      },
      (error) => {
        console.error('Error updating user details:', error);
      }
    );
    } else {
      this.userForm.markAllAsTouched();
      alert('Please fill out all fields correctly.');
    }
  }
}

