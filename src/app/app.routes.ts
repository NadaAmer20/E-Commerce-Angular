import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { CategoryListComponent } from './components/category-list/category-list';
import { CategoryDetailComponent } from './components/category-detail/category-detail';
import { ProductListComponent } from './components/product-list/product-list';
import { AddProductComponent } from './components/add-product/add-product';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { NotFoundComponent } from './components/not-found/not-found';
import { HomeComponent } from './components/home/home';
import { ProfileComponent } from './components/profile/profile';



export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/:id', component: CategoryDetailComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/add', component: AddProductComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: '**', component: NotFoundComponent }
];
