import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-mouvements',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './mouvements.component.html',
  styleUrl: './mouvements.component.scss'
})
export class MouvementsComponent implements OnInit {
  mouvements: any[] = [];
  produits: any[] = [];
  loading = true;
  errorMessage = '';
  
  // Formulaire d'ajout
  showAddForm = false;
  newMouvement = {
    produitId: null,
    typeMouvement: 'ENTREE',
    quantite: 1,
    description: ''
  };
  
  // Filtres
  filterType: string = '';
  filterProduit: number | null = null;
  dateDebut: string = '';
  dateFin: string = '';

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMouvements();
    this.loadProduits();
  }

  loadMouvements(): void {
    this.loading = true;
    console.log('� Début du chargement des mouvements...');
    
    this.apiService.getMouvements().subscribe({
      next: (data) => {
        console.log('✅ Mouvements reçus:', data);
        this.mouvements = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des mouvements:', err);
        this.errorMessage = 'Erreur lors du chargement des mouvements: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadProduits(): void {
    this.apiService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des produits:', err);
      }
    });
  }

  addMouvement(): void {
    console.log('🔄 Tentative d\'ajout de mouvement:', this.newMouvement);
    
    if (!this.newMouvement.produitId || !this.newMouvement.quantite || this.newMouvement.quantite <= 0) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    console.log('✅ Validation OK, envoi à l\'API...');
    this.apiService.createMouvement(this.newMouvement).subscribe({
      next: (data) => {
        console.log('✅ Mouvement créé avec succès:', data);
        this.mouvements.unshift(data); // Ajouter au début
        this.resetForm();
        this.showAddForm = false;
        this.errorMessage = '';
        this.loadProduits(); // Recharger les produits pour mettre à jour les quantités
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'ajout du mouvement:', err);
        this.errorMessage = 'Erreur lors de l\'ajout du mouvement: ' + err.message;
      }
    });
  }

  deleteMouvement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce mouvement ?')) {
      this.apiService.deleteMouvement(id).subscribe({
        next: () => {
          this.mouvements = this.mouvements.filter(m => m.id !== id);
          this.loadProduits(); // Recharger les produits pour mettre à jour les quantités
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du mouvement:', err);
          this.errorMessage = 'Erreur lors de la suppression du mouvement';
        }
      });
    }
  }

  resetForm(): void {
    this.newMouvement = {
      produitId: null,
      typeMouvement: 'ENTREE',
      quantite: 1,
      description: ''
    };
  }

  getProduitName(produitId: number): string {
    const produit = this.produits.find(p => p.id === produitId);
    return produit ? produit.nom : 'Produit inconnu';
  }

  getMouvementTypeLabel(type: string): string {
    return type === 'ENTREE' ? 'Entrée' : 'Sortie';
  }

  getMouvementTypeColor(type: string): string {
    return type === 'ENTREE' ? '#28a745' : '#dc3545';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR');
  }

  getFilteredMouvements(): any[] {
    return this.mouvements.filter(mouvement => {
      let matchType = !this.filterType || mouvement.typeMouvement === this.filterType;
      let matchProduit = !this.filterProduit || mouvement.produitId === this.filterProduit;
      let matchDate = true;
      
      if (this.dateDebut && new Date(mouvement.dateMouvement) < new Date(this.dateDebut)) {
        matchDate = false;
      }
      if (this.dateFin && new Date(mouvement.dateMouvement) > new Date(this.dateFin)) {
        matchDate = false;
      }
      
      return matchType && matchProduit && matchDate;
    });
  }

  clearFilters(): void {
    this.filterType = '';
    this.filterProduit = null;
    this.dateDebut = '';
    this.dateFin = '';
  }
}
