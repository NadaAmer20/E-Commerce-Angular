import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  model = {
    FirstName: '',
    LastName: '',
    UserName: '',
    Email: '',
    PassWord: '',
    ConfirmPassword: ''
  };
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.authService.register(this.model).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Account created successfully!',
          confirmButtonColor: '#667eea'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: err.error?.message || 'Please check your inputs and try again.',
          confirmButtonColor: '#667eea'
        });
      }
    });
  }
}
