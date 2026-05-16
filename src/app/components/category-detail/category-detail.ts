import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-detail.html',
  styleUrls: ['./category-detail.css']
})
export class CategoryDetailComponent implements OnInit {
  category: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCategory(Number(id));
    }
  }

  loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getById(id).subscribe({
      next: (res) => {
        const data = res.data || res;
        this.category = {
          ...data,
          picture: data.picture ? (data.picture.startsWith('http') ? data.picture.replace('https://localhost:7186', 'http://localhost:5011').replace('http://localhost:7186', 'http://localhost:5011') : `http://localhost:5011/images/ImagesCategory/${data.picture}`) : null,
          products: (data.productResponse?.$values || data.productResponse || []).map((p: any) => ({
            ...p,
            imageUrls: (p.imageUrls?.$values || p.imageUrls || []).map((url: string) => url.replace('https://localhost:7186', 'http://localhost:5011').replace('http://localhost:7186', 'http://localhost:5011'))
          }))
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading category:', err);
      }
    });
  }
}
