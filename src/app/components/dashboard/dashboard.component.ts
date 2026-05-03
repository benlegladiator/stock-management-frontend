import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  lowStockProducts: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = '';
    console.log('🔄 Début du chargement des données...');
    
    // Timeout pour éviter le chargement infini
    setTimeout(() => {
      if (this.loading) {
        console.log('⏰ Timeout - Arrêt du chargement');
        this.loading = false;
        this.errorMessage = 'Timeout: Les données n\'ont pas pu être chargées. Vérifiez la connexion avec le backend.';
      }
    }, 5000);
    
    // Charger les statistiques du dashboard
    console.log('📊 Appel API: /dashboard/stats');
    this.apiService.getDashboardStats().subscribe({
      next: (data) => {
        console.log('✅ Stats reçues:', data);
        this.stats = data;
      },
      error: (err) => {
        console.error('❌ Erreur stats:', err);
        this.errorMessage = 'Erreur lors du chargement des statistiques: ' + err.message;
        this.loading = false;
      }
    });

    // Charger les produits en stock faible
    console.log('📦 Appel API: /produits/low-stock');
    this.apiService.getLowStockProducts().subscribe({
      next: (data) => {
        console.log('✅ Produits low-stock reçus:', data);
        this.lowStockProducts = data;
        this.loading = false;
        this.cdr.detectChanges(); // Forcer la détection de changement
        console.log('🎉 Chargement terminé !');
      },
      error: (err) => {
        console.error('❌ Erreur produits low-stock:', err);
        this.errorMessage = 'Erreur lors du chargement des produits: ' + err.message;
        this.loading = false;
      }
    });
  }
}
