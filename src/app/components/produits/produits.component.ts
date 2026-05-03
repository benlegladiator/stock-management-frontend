import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.scss'
})
export class ProduitsComponent implements OnInit {
  produits: any[] = [];
  categories: any[] = [];
  selectedProduit: any = null;
  showAddForm = false;
  showEditForm = false;
  loading = true;
  errorMessage = '';
  
  // Form models
  newProduit = {
    nom: '',
    marque: '',
    prix: 0,
    quantite: 0,
    seuilAlerte: 10,
    categorieId: null
  };

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProduits();
    this.loadCategories();
  }

  loadProduits(): void {
    this.loading = true;
    console.log('🔄 Début du chargement des produits...');
    
    // Timeout pour éviter le chargement infini
    setTimeout(() => {
      if (this.loading) {
        console.log('⏰ Timeout produits - Arrêt du chargement');
        this.loading = false;
        this.errorMessage = 'Timeout: Les produits n\'ont pas pu être chargés. Vérifiez la connexion avec le backend.';
      }
    }, 5000);
    
    this.apiService.getProduits().subscribe({
      next: (data) => {
        console.log('✅ Produits reçus:', data);
        this.produits = data;
        this.loading = false;
        this.cdr.detectChanges(); // Forcer la détection de changement
        console.log('🎉 Chargement produits terminé !');
      },
      error: (err) => {
        console.error('❌ Erreur produits:', err);
        this.errorMessage = 'Erreur lors du chargement des produits: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    console.log('🔄 Début du chargement des catégories...');
    this.apiService.getCategories().subscribe({
      next: (data) => {
        console.log('✅ Catégories reçues:', data);
        this.categories = data;
        this.cdr.detectChanges(); // Forcer la mise à jour
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des catégories:', err);
      }
    });
  }

  addProduit(): void {
    console.log('🔄 Tentative d\'ajout de produit:', this.newProduit);
    
    if (!this.newProduit.nom || !this.newProduit.marque || this.newProduit.prix <= 0 || !this.newProduit.categorieId) {
      console.log('❌ Validation échouée:', {
        nom: !!this.newProduit.nom,
        marque: !!this.newProduit.marque,
        prix: this.newProduit.prix,
        categorieId: this.newProduit.categorieId
      });
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    console.log('✅ Validation OK, envoi à l\'API...');
    this.apiService.createProduit(this.newProduit).subscribe({
      next: (data) => {
        console.log('✅ Produit créé avec succès:', data);
        this.produits.push(data);
        this.resetForm();
        this.showAddForm = false;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'ajout du produit:', err);
        this.errorMessage = 'Erreur lors de l\'ajout du produit: ' + err.message;
      }
    });
  }

  editProduit(produit: any): void {
    this.selectedProduit = { ...produit };
    this.showEditForm = true;
  }

  updateProduit(): void {
    console.log('🔄 Tentative de modification de produit:', this.selectedProduit);
    
    if (!this.selectedProduit || !this.selectedProduit.nom || !this.selectedProduit.marque || this.selectedProduit.prix <= 0) {
      console.log('❌ Validation modification échouée:', {
        hasProduit: !!this.selectedProduit,
        nom: !!this.selectedProduit?.nom,
        marque: !!this.selectedProduit?.marque,
        prix: this.selectedProduit?.prix,
        categorieId: this.selectedProduit?.categorieId
      });
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.apiService.updateProduit(this.selectedProduit.id, this.selectedProduit).subscribe({
      next: (data) => {
        const index = this.produits.findIndex(p => p.id === data.id);
        if (index !== -1) {
          this.produits[index] = data;
        }
        this.cancelEdit();
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du produit:', err);
        this.errorMessage = 'Erreur lors de la mise à jour du produit';
      }
    });
  }

  deleteProduit(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.apiService.deleteProduit(id).subscribe({
        next: () => {
          this.produits = this.produits.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du produit:', err);
          this.errorMessage = 'Erreur lors de la suppression du produit';
        }
      });
    }
  }

  cancelEdit(): void {
    this.selectedProduit = null;
    this.showEditForm = false;
  }

  resetForm(): void {
    this.newProduit = {
      nom: '',
      marque: '',
      prix: 0,
      quantite: 0,
      seuilAlerte: 10,
      categorieId: null
    };
  }

  getCategorieName(categorieId: number): string {
    const categorie = this.categories.find(c => c.id === categorieId);
    return categorie ? categorie.nom : 'Inconnue';
  }

  getStockStatus(quantite: number, seuilAlerte: number): string {
    if (quantite === 0) return 'out';
    if (quantite <= seuilAlerte) return 'low';
    return 'normal';
  }
}
