import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  userId: number | null = null;
  loading = true;
  saving = false;
  
  model: any = {
    Id: null,
    FirstName: '',
    LastName: '',
    UserName: '',
    Email: '',
    Address: '',
    Country: '',
    PhoneNumber: ''
  };

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    if (this.userId) {
      this.loadProfile(this.userId);
    } else {
      this.loading = false;
      Swal.fire('Error', 'User ID not found. Please log in again.', 'error');
    }
  }

  loadProfile(id: number) {
    this.authService.getUserProfile(id).subscribe({
      next: (res) => {
        const data = res.data || res;
        this.model = {
          Id: id,
          FirstName: data.firstName || '',
          LastName: data.lastName || '',
          UserName: data.userName || '',
          Email: data.email || '',
          Address: data.address || '',
          Country: data.country || '',
          PhoneNumber: data.phoneNumber || ''
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
        Swal.fire('Error', 'Failed to load profile data', 'error');
      }
    });
  }

  onSubmit() {
    this.saving = true;
    this.authService.updateUserProfile(this.model).subscribe({
      next: () => {
        this.saving = false;
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully.',
          confirmButtonColor: '#667eea'
        });
      },
      error: (err) => {
        this.saving = false;
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.error?.message || 'Something went wrong while updating your profile.',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }
}
