import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  loading = true;

  showEditModal = false;
  saving = false;
  editForm: any = {};

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getPaginated(1, 20).subscribe({
      next: (res) => {
        const rawData = res.data?.$values || res.data || res.$values || [];
        this.products = rawData.map((p: any) => {
          let urls = p.imageUrls?.$values || p.imageUrls || [];
          urls = urls.map((url: string) =>
            url.replace('https://localhost:7186', 'http://localhost:5011')
          );
          return { ...p, imageUrls: urls };
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Products API Error:', err);
      }
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res.data?.$values || res.data || [];
        this.cdr.detectChanges();
      }
    });
  }

  openEditModal(prod: any) {
    this.editForm = {
      id: prod.productID,
      item_Name: prod.item_Name,
      price: prod.price,
      description: prod.description,
      categoryId: prod.categoryId,
      quantity: prod.quantity,
      solditems: prod.solditems
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  onUpdateProduct() {
    this.saving = true;
    const formData = new FormData();
    formData.append('Id', this.editForm.id);
    formData.append('Item_Name', this.editForm.item_Name);
    formData.append('price', this.editForm.price);
    formData.append('Description', this.editForm.description || '');
    formData.append('CategoryId', this.editForm.categoryId);
    formData.append('quantity', this.editForm.quantity || 0);
    formData.append('solditems', this.editForm.solditems || 0);

    this.productService.update(formData).subscribe({
      next: () => {
        this.saving = false;
        this.showEditModal = false;
        this.loadProducts();
      },
      error: (err) => {
        this.saving = false;
        alert('Update failed: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert('Delete failed: ' + (err.error?.message || 'Unknown error'))
      });
    }
  }

  getCategoryName(id: number): string {
    const cat = this.categories.find((c: any) => c.id === id);
    return cat ? cat.name : '';
  }
}
