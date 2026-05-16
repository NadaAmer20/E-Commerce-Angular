import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css']
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];
  loading = true;

  showModal = false;
  isEditMode = false;
  saving = false;

  form: any = { id: null, name: '', description: '' };
  selectedFile: File | null = null;

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (res) => {
        const rawData = res.data?.$values || res.data || [];
        this.categories = rawData.map((cat: any) => {
          let pictureUrl = null;
          if (cat.picture) {
            if (cat.picture.startsWith('http')) {
              pictureUrl = cat.picture.replace('https://localhost:7186', 'http://localhost:5011');
            } else {
              pictureUrl = `http://localhost:5011/images/ImagesCategory/${cat.picture}`;
            }
          }
          return { ...cat, picture: pictureUrl };
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Category API Error:', err);
      }
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.form = { id: null, name: '', description: '' };
    this.selectedFile = null;
    this.showModal = true;
  }

  openEditModal(cat: any) {
    this.isEditMode = true;
    this.form = { id: cat.id, name: cat.name, description: cat.description || '' };
    this.selectedFile = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedFile = null;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSave() {
    if (!this.form.name.trim()) return;
    this.saving = true;

    if (this.isEditMode) {
      const payload = {
        id: this.form.id,
        name: this.form.name,
        description: this.form.description,
        isDeleted: false,
        totalProducts: 0
      };
      this.categoryService.update(payload).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.loadCategories();
        },
        error: (err) => {
          this.saving = false;
          alert('Update failed: ' + (err.error?.message || 'Unknown error'));
        }
      });
    } else {
      this.categoryService.create({ name: this.form.name, description: this.form.description, file: this.selectedFile }).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.loadCategories();
        },
        error: (err) => {
          this.saving = false;
          alert('Create failed: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.delete(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert('Delete failed: ' + (err.error?.message || 'Unknown error'))
      });
    }
  }
}
