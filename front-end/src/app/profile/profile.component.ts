import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing: boolean = false;
  user: any = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Fetch user details from backend
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get('http://localhost:8080/api/user/profile', { headers }).subscribe(
      (response: any) => {
        this.user = response;
        this.profileForm.patchValue({
          firstName: response.firstName,
          lastName: response.lastName,
          phone: response.phone,
          address: response.address
        });
      },
      error => console.error('Error fetching profile:', error)
    );
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue(this.user);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      this.http.put('http://localhost:8080/api/user/profile', this.profileForm.value, { headers })
        .subscribe(
          (response: any) => {
            this.user = response;
            this.isEditing = false;
          },
          error => console.error('Error updating profile:', error)
        );
    }
  }
}