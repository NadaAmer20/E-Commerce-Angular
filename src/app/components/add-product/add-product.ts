import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
})
export class AddProductComponent implements OnInit {
  product: any = {
    Item_Name: '',
    price: 0,
    Description: '',
    CategoryId: null,
    quantity: 0,
    solditems: 0
  };
  categories: any[] = [];
  selectedFiles: File[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res.data?.$values || res.data || [];
        this.cdr.detectChanges();
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onSubmit(): void {
    this.loading = true;
    const formData = new FormData();
    
    Object.keys(this.product).forEach(key => {
      formData.append(key, this.product[key]);
    });

    this.selectedFiles.forEach(file => {
      formData.append('File', file);
    });

    this.productService.create(formData).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Product added successfully!',
          confirmButtonColor: '#667eea'
        }).then(() => {
          this.router.navigate(['/products']);
        });
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add product: ' + (err.error?.message || 'Unknown error'),
          confirmButtonColor: '#667eea'
        });
      }
    });
  }
}
