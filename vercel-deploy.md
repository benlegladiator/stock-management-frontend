# Déploiement du frontend Angular sur Vercel

## 1. Créer un compte Vercel
- Allez sur https://vercel.com/signup
- Connectez-vous avec GitHub/GitLab

## 2. Build du frontend pour la production
```bash
cd c:\Users\PC\Desktop\projet_java\stock-management-frontend
npm run build --prod
```

## 3. Déployer sur Vercel
```bash
# Option A : Via l'interface web Vercel
# 1. Importez votre projet GitHub
# 2. Configurez le framework : Angular
# 3. Build Command : npm run build --prod
# 4. Output Directory : dist/stock-management-frontend
# 5. Environment Variables : (aucune nécessaire)

# Option B : Via Vercel CLI
npm i -g vercel
vercel --prod
```

## 4. Mettre à jour l'URL du backend dans environment.prod.ts
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://ton-backend-unique-name.herokuapp.com/api'
};
```

## 5. Redéployer après la mise à jour
```bash
npm run build --prod
vercel --prod
```
