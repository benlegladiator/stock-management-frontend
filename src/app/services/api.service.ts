import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`);
  }

  // Catégories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  createCategorie(categorie: any): Observable<any> {
    console.log('🔄 Envoi catégorie au backend:', categorie);
    return this.http.post(`${this.apiUrl}/categories`, categorie);
  }

  updateCategorie(id: number, categorie: any): Observable<any> {
    console.log('🔄 Envoi modification catégorie au backend:', categorie);
    return this.http.put(`${this.apiUrl}/categories/${id}`, categorie);
  }

  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  // Produits
  getProduits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produits`);
  }

  getProduit(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produits/${id}`);
  }

  createProduit(produit: any): Observable<any> {
    // Transformer les données pour correspondre au format attendu par le backend
    const produitToSend = {
      nom: produit.nom,
      marque: produit.marque,
      prix: produit.prix,
      quantite: produit.quantite || 0,
      seuilAlerte: produit.seuilAlerte || 10,
      categorie: {
        id: produit.categorieId
      }
    };
    console.log('🔄 Envoi au backend:', produitToSend);
    return this.http.post(`${this.apiUrl}/produits`, produitToSend);
  }

  updateProduit(id: number, produit: any): Observable<any> {
    // Transformer les données pour correspondre au format attendu par le backend
    const produitToSend = {
      nom: produit.nom,
      marque: produit.marque,
      prix: produit.prix,
      quantite: produit.quantite || 0,
      seuilAlerte: produit.seuilAlerte || 10,
      categorie: {
        id: produit.categorieId
      }
    };
    console.log('🔄 Envoi modification au backend:', produitToSend);
    return this.http.put(`${this.apiUrl}/produits/${id}`, produitToSend);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produits/${id}`);
  }

  getLowStockProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produits/low-stock`);
  }

  // Mouvements de stock
  getMouvements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mouvements`);
  }

  createMouvement(mouvement: any): Observable<any> {
    console.log('🔄 Envoi mouvement au backend:', mouvement);
    return this.http.post(`${this.apiUrl}/mouvements`, mouvement);
  }

  deleteMouvement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/mouvements/${id}`);
  }

  getMouvementsByProduit(produitId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mouvements/produit/${produitId}`);
  }
}
