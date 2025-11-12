# Plateforme de Gestion des Ressources Humaines (HR Platform)

Une application web complète pour la gestion du personnel, des salaires, des congés et du recrutement en Tunisie.

## Caractéristiques

### Modules Principaux
1. **Gestion des Employés** - Profils complets, contrats, historique
2. **Gestion de la Paie** - Calcul des salaires, fiches de paie, TND
3. **Gestion des Congés** - Demandes de congés, absences, approbations
4. **Recrutement** - Offres d'emploi, candidatures, évaluations
5. **Tableaux de Bord** - Statistiques, analytiques, rapports

### Fonctionnalités de Sécurité
- Authentification JWT
- Autorisation basée sur les rôles (Admin/Employee/Manager)
- Protection des données sensibles
- Chiffrage des mots de passe

## Installation et Configuration

### Prérequis
- Node.js 16+
- Angular CLI 15+
- MySQL 8+

### Installation du Backend

\`\`\`bash
cd backend
npm install
\`\`\`

### Configuration de la Base de Données

1. Créez une base de données MySQL
2. Exécutez le script SQL:
\`\`\`bash
mysql -u root -p < database/init.sql
\`\`\`

3. Configurez les variables d'environnement dans `backend/.env`

### Démarrage du Backend

\`\`\`bash
npm run dev
\`\`\`

Le serveur démarre sur `http://localhost:3000`

### Installation du Frontend (Angular)

\`\`\`bash
npm install
ng serve
\`\`\`

L'application démarre sur `http://localhost:4200`

## Comptes de Démonstration

### Admin
- Email: `admin@hrplatform.tn`
- Mot de passe: `admin123`

### Employé
- Email: `m.benali@hrplatform.tn`
- Mot de passe: `employee123`

## Structure du Projet

\`\`\`
hr-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.ts
│   ├── database/
│   │   └── init.sql
│   └── package.json
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── app.module.ts
│   └── styles.css
└── README.md
\`\`\`

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Employés
- `GET /api/employees` - Tous les employés
- `GET /api/employees/:id` - Employé spécifique
- `POST /api/employees` - Créer employé
- `PUT /api/employees/:id` - Mettre à jour employé

### Paie
- `GET /api/payroll` - Tous les fiches de paie
- `POST /api/payroll` - Créer fiche de paie
- `PUT /api/payroll/:id` - Mettre à jour fiche de paie

### Congés
- `GET /api/leaves` - Tous les congés
- `POST /api/leaves` - Demander un congé
- `PUT /api/leaves/:id` - Approuver/Rejeter congé

### Recrutement
- `GET /api/recruitment/openings` - Offres d'emploi
- `POST /api/recruitment/openings` - Créer offre
- `GET /api/recruitment/candidates` - Candidats
- `POST /api/recruitment/candidates` - Soumettre candidature
- `PUT /api/recruitment/candidates/:id` - Mettre à jour candidat

## Utilisation

### Pour les Administrateurs
1. Connectez-vous avec vos identifiants admin
2. Accédez au tableau de bord administrateur
3. Gérez les employés, la paie, les congés et le recrutement
4. Consultez les statistiques et rapports

### Pour les Employés
1. Connectez-vous avec vos identifiants
2. Consultez votre profil et vos informations
3. Visualisez vos fiches de paie
4. Demandez des congés
5. Suivez l'état de vos demandes

## Personnalisation

### Modifier les Couleurs
Éditez `src/styles.css` pour personnaliser le thème

### Ajouter des Champs Employé
1. Modifiez le schéma MySQL dans `backend/database/init.sql`
2. Mettez à jour le modèle TypeScript `src/app/models/employee.model.ts`
3. Mettez à jour les formulaires dans les composants

## Support et Maintenance

Pour toute question ou problème:
1. Vérifiez les logs du serveur
2. Consultez la documentation de l'API
3. Vérifiez la configuration de la base de données

## Licence

Propriétaire - Tous droits réservés
