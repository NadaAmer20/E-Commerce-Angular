import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  categoryName = '';
  loading = true;
  selectedImage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe({
      next: (res) => {
        this.product = res.data;
        if (this.product) {
          const urls = this.product.imageUrls?.$values || this.product.imageUrls || [];
          this.product.imageUrls = urls.map((url: string) =>
            url.replace('https://localhost:7186', 'http://localhost:5011')
          );
          this.selectedImage = this.product.imageUrls[0] || '';
          this.loadCategory(this.product.categoryId);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCategory(id: number) {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        const cats = res.data?.$values || res.data || [];
        const cat = cats.find((c: any) => c.id === id);
        this.categoryName = cat ? cat.name : '';
        this.cdr.detectChanges();
      }
    });
  }

  selectImage(url: string) {
    this.selectedImage = url;
  }
}
