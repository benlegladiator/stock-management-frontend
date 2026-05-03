import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  loading = true;
  errorMessage = '';
  
  // Formulaire d'ajout
  showAddForm = false;
  newCategorie = {
    nom: ''
  };
  
  // Formulaire de modification
  showEditForm = false;
  selectedCategorie: any = {};

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    console.log('🔄 Début du chargement des catégories...');
    
    this.apiService.getCategories().subscribe({
      next: (data) => {
        console.log('✅ Catégories reçues:', data);
        this.categories = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des catégories:', err);
        this.errorMessage = 'Erreur lors du chargement des catégories: ' + err.message;
        this.loading = false;
      }
    });
  }

  addCategorie(): void {
    console.log('🔄 Tentative d\'ajout de catégorie:', this.newCategorie);
    
    if (!this.newCategorie.nom || this.newCategorie.nom.trim() === '') {
      this.errorMessage = 'Veuillez remplir le nom de la catégorie';
      return;
    }

    console.log('✅ Validation OK, envoi à l\'API...');
    this.apiService.createCategorie(this.newCategorie).subscribe({
      next: (data) => {
        console.log('✅ Catégorie créée avec succès:', data);
        this.categories.push(data);
        this.resetForm();
        this.showAddForm = false;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'ajout de la catégorie:', err);
        this.errorMessage = 'Erreur lors de l\'ajout de la catégorie: ' + err.message;
      }
    });
  }

  editCategorie(categorie: any): void {
    this.selectedCategorie = { ...categorie };
    this.showEditForm = true;
  }

  updateCategorie(): void {
    console.log('🔄 Tentative de modification de catégorie:', this.selectedCategorie);
    
    if (!this.selectedCategorie || !this.selectedCategorie.nom || this.selectedCategorie.nom.trim() === '') {
      this.errorMessage = 'Veuillez remplir le nom de la catégorie';
      return;
    }

    this.apiService.updateCategorie(this.selectedCategorie.id, this.selectedCategorie).subscribe({
      next: (data) => {
        const index = this.categories.findIndex(c => c.id === data.id);
        if (index !== -1) {
          this.categories[index] = data;
        }
        this.cancelEdit();
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la catégorie:', err);
        this.errorMessage = 'Erreur lors de la mise à jour de la catégorie';
      }
    });
  }

  deleteCategorie(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.apiService.deleteCategorie(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== id);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la catégorie:', err);
          this.errorMessage = 'Erreur lors de la suppression de la catégorie';
        }
      });
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.selectedCategorie = {};
  }

  resetForm(): void {
    this.newCategorie = {
      nom: ''
    };
  }

  getProduitsCount(categorie: any): number {
    return categorie.produits ? categorie.produits.length : 0;
  }
}
